import { EventEmitter } from "events";
import { processVideo } from "@/lib/utils/video";
import { getUserCredits, validateAndDeductCredits } from "@/lib/db";

interface VideoJob {
  id: string;
  userId: string;
  inputPath: string;
  options: {
    startTime?: number;
    duration: number;
    enhance?: boolean;
    captions?: boolean;
    backgroundMusic?: string;
    outputFormat?: "mp4" | "mov" | "webm";
    quality?: "low" | "medium" | "high";
  };
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  error?: string;
  result?: {
    outputPath: string;
    duration: number;
    size: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface JobUpdate {
  status?: VideoJob["status"];
  progress?: number;
  error?: string;
  result?: VideoJob["result"];
}

class VideoProcessingQueue extends EventEmitter {
  private queue: VideoJob[] = [];
  private processing: boolean = false;
  private maxConcurrent: number = 2;
  private currentJobs: number = 0;

  constructor() {
    super();
    this.on("jobComplete", this.processNextJob.bind(this));
    this.on("jobFailed", this.processNextJob.bind(this));
  }

  public async addJob(
    userId: string,
    inputPath: string,
    options: VideoJob["options"]
  ): Promise<string> {
    // Calculate required credits (2 credits per minute)
    const requiredCredits = Math.ceil(options.duration / 60) * 2;

    // Check if user has enough credits
    const userCredits = await getUserCredits(userId);
    if (userCredits < requiredCredits) {
      throw new Error(`Insufficient credits. Required: ${requiredCredits}, Available: ${userCredits}`);
    }

    const jobId = crypto.randomUUID();
    const job: VideoJob = {
      id: jobId,
      userId,
      inputPath,
      options,
      status: "pending",
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.queue.push(job);
    this.emit("jobAdded", job);

    if (!this.processing) {
      this.processNextJob();
    }

    return jobId;
  }

  public getJob(jobId: string): VideoJob | undefined {
    return this.queue.find(job => job.id === jobId);
  }

  public getUserJobs(userId: string): VideoJob[] {
    return this.queue.filter(job => job.userId === userId);
  }

  public cancelJob(jobId: string): boolean {
    const index = this.queue.findIndex(job => job.id === jobId);
    if (index === -1) return false;

    const job = this.queue[index];
    if (job.status === "processing") {
      // Can't cancel a job that's already processing
      return false;
    }

    this.queue.splice(index, 1);
    this.emit("jobCancelled", job);
    return true;
  }

  private async processNextJob() {
    if (this.currentJobs >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    this.currentJobs++;

    const job = this.queue.find(job => job.status === "pending");
    if (!job) {
      this.currentJobs--;
      this.processing = this.currentJobs > 0;
      return;
    }

    try {
      this.updateJob(job.id, { status: "processing", progress: 0 });

      // Calculate and deduct credits before processing
      const requiredCredits = Math.ceil(job.options.duration / 60) * 2;
      await validateAndDeductCredits(
        job.userId,
        requiredCredits,
        `Video processing job ${job.id}`
      );

      // Process the video
      const outputPath = await processVideo(job.inputPath, job.options);

      this.updateJob(job.id, {
        status: "completed",
        progress: 100,
        result: {
          outputPath,
          duration: job.options.duration,
          size: 0, // TODO: Get actual file size
        },
      });

      this.emit("jobComplete", job);
    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      this.updateJob(job.id, {
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error occurred",
      });
      this.emit("jobFailed", job);
    } finally {
      this.currentJobs--;
      this.processing = this.currentJobs > 0;
      this.processNextJob();
    }
  }

  private updateJob(jobId: string, update: JobUpdate) {
    const job = this.queue.find(job => job.id === jobId);
    if (!job) return;

    Object.assign(job, {
      ...update,
      updatedAt: new Date(),
    });

    this.emit("jobUpdated", job);
  }

  public getQueueStatus() {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      currentJobs: this.currentJobs,
      pendingJobs: this.queue.filter(job => job.status === "pending").length,
      processingJobs: this.queue.filter(job => job.status === "processing").length,
      completedJobs: this.queue.filter(job => job.status === "completed").length,
      failedJobs: this.queue.filter(job => job.status === "failed").length,
    };
  }
}

// Create a singleton instance
export const videoQueue = new VideoProcessingQueue();

// Export types
export type { VideoJob, JobUpdate };