import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { unlink } from "fs/promises";
import { authOptions } from "@/lib/auth";
import { videoQueue } from "@/lib/jobs/videoProcessor";
import { progressTracker } from "@/lib/utils/progress";

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      // Return all jobs for the user
      const jobs = videoQueue.getUserJobs(session.user.id);
      const jobsWithProgress = jobs.map(job => ({
        ...job,
        progress: progressTracker.getProgress(job.id),
      }));

      return NextResponse.json({ jobs: jobsWithProgress });
    }

    // Get specific job
    const job = videoQueue.getJob(jobId);
    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Check if job belongs to user
    if (job.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const progress = progressTracker.getProgress(jobId);

    return NextResponse.json({
      job: {
        ...job,
        progress,
      },
    });
  } catch (error) {
    console.error("Job status error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { jobId, action } = body;

    if (!jobId || !action) {
      return NextResponse.json(
        { error: "Job ID and action are required" },
        { status: 400 }
      );
    }

    // Get job
    const job = videoQueue.getJob(jobId);
    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Check if job belongs to user
    if (job.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    switch (action) {
      case "cancel":
        const cancelled = videoQueue.cancelJob(jobId);
        if (!cancelled) {
          return NextResponse.json(
            { error: "Job cannot be cancelled" },
            { status: 400 }
          );
        }
        progressTracker.clearProgress(jobId);
        return NextResponse.json({
          message: "Job cancelled successfully",
        });

      case "retry":
        if (job.status !== "failed") {
          return NextResponse.json(
            { error: "Only failed jobs can be retried" },
            { status: 400 }
          );
        }

        // Add new job with same parameters
        const newJobId = await videoQueue.addJob(
          session.user.id,
          job.inputPath,
          job.options
        );

        return NextResponse.json({
          message: "Job retry initiated",
          newJobId,
        });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Job action error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID required" },
        { status: 400 }
      );
    }

    // Get job
    const job = videoQueue.getJob(jobId);
    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Check if job belongs to user
    if (job.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Only completed or failed jobs can be deleted
    if (job.status !== "completed" && job.status !== "failed") {
      return NextResponse.json(
        { error: "Only completed or failed jobs can be deleted" },
        { status: 400 }
      );
    }

    // Cancel job if it's still in queue
    videoQueue.cancelJob(jobId);
    progressTracker.clearProgress(jobId);

    // Clean up files
    try {
      if (job.result?.outputPath) {
        await unlink(job.result.outputPath);
      }
      await unlink(job.inputPath);
    } catch (error) {
      console.error("Error cleaning up files:", error);
    }

    return NextResponse.json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Job deletion error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}