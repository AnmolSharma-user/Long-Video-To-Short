import { EventEmitter } from "events";

interface ProgressUpdate {
  jobId: string;
  progress: number;
  stage: ProcessingStage;
  message: string;
  error?: string;
}

export type ProcessingStage =
  | "initializing"
  | "downloading"
  | "analyzing"
  | "processing"
  | "enhancing"
  | "generating_captions"
  | "adding_music"
  | "finalizing"
  | "completed"
  | "failed";

class ProgressTracker extends EventEmitter {
  private progress: Map<string, ProgressUpdate>;
  private static instance: ProgressTracker;

  private constructor() {
    super();
    this.progress = new Map();
  }

  public static getInstance(): ProgressTracker {
    if (!ProgressTracker.instance) {
      ProgressTracker.instance = new ProgressTracker();
    }
    return ProgressTracker.instance;
  }

  public updateProgress(update: ProgressUpdate): void {
    this.progress.set(update.jobId, update);
    this.emit("progress", update);
  }

  public getProgress(jobId: string): ProgressUpdate | undefined {
    return this.progress.get(jobId);
  }

  public getAllProgress(): ProgressUpdate[] {
    return Array.from(this.progress.values());
  }

  public clearProgress(jobId: string): void {
    this.progress.delete(jobId);
    this.emit("clear", jobId);
  }

  public onProgress(callback: (update: ProgressUpdate) => void): void {
    this.on("progress", callback);
  }

  public onClear(callback: (jobId: string) => void): void {
    this.on("clear", callback);
  }

  public removeProgressListener(callback: (update: ProgressUpdate) => void): void {
    this.off("progress", callback);
  }

  public removeClearListener(callback: (jobId: string) => void): void {
    this.off("clear", callback);
  }

  public getStageWeight(stage: ProcessingStage): number {
    switch (stage) {
      case "initializing":
        return 0;
      case "downloading":
        return 20;
      case "analyzing":
        return 30;
      case "processing":
        return 50;
      case "enhancing":
        return 70;
      case "generating_captions":
        return 80;
      case "adding_music":
        return 90;
      case "finalizing":
        return 95;
      case "completed":
        return 100;
      case "failed":
        return -1;
      default:
        return 0;
    }
  }

  public getStageMessage(stage: ProcessingStage): string {
    switch (stage) {
      case "initializing":
        return "Initializing video processing...";
      case "downloading":
        return "Downloading video...";
      case "analyzing":
        return "Analyzing video content...";
      case "processing":
        return "Processing video segments...";
      case "enhancing":
        return "Enhancing video quality...";
      case "generating_captions":
        return "Generating captions...";
      case "adding_music":
        return "Adding background music...";
      case "finalizing":
        return "Finalizing video...";
      case "completed":
        return "Processing completed successfully";
      case "failed":
        return "Processing failed";
      default:
        return "Unknown stage";
    }
  }

  public calculateOverallProgress(stages: ProcessingStage[]): number {
    if (stages.length === 0) return 0;
    if (stages.includes("failed")) return -1;
    if (stages.includes("completed")) return 100;

    const currentStage = stages[stages.length - 1];
    const currentWeight = this.getStageWeight(currentStage);
    const previousStages = stages.slice(0, -1);
    const previousProgress = previousStages.reduce(
      (acc, stage) => acc + this.getStageWeight(stage),
      0
    );

    return Math.min(
      Math.round((previousProgress + currentWeight) / stages.length),
      99
    );
  }

  public formatProgressMessage(
    stage: ProcessingStage,
    progress: number,
    error?: string
  ): string {
    if (error) {
      return `Error: ${error}`;
    }

    const baseMessage = this.getStageMessage(stage);
    if (stage === "completed") {
      return baseMessage;
    }

    if (stage === "failed") {
      return error || "Processing failed due to an unknown error";
    }

    return `${baseMessage} (${Math.round(progress)}%)`;
  }
}

export const progressTracker = ProgressTracker.getInstance();
export type { ProgressUpdate };