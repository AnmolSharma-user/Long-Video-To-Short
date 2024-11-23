import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { videoQueue } from "@/lib/jobs/videoProcessor";
import { validateVideo } from "@/lib/utils/video";
import { handleDatabaseError } from "@/lib/utils/db-errors";

const UPLOADS_DIR = join(process.cwd(), "uploads");

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

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const options = JSON.parse(formData.get("options") as string);

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["video/mp4", "video/quicktime", "video/webm"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Supported types: MP4, MOV, WEBM" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    try {
      await writeFile(join(UPLOADS_DIR, ".keep"), "");
    } catch (error) {
      // Directory already exists or can't be created
      console.error("Error creating uploads directory:", error);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filepath = join(UPLOADS_DIR, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    try {
      // Validate video
      const metadata = await validateVideo(filepath);

      // Add job to queue
      const jobId = await videoQueue.addJob(session.user.id, filepath, {
        duration: metadata.duration,
        enhance: options.enhance || false,
        captions: options.captions || false,
        backgroundMusic: options.backgroundMusic,
        outputFormat: options.outputFormat || "mp4",
        quality: options.quality || "medium",
      });

      return NextResponse.json({
        jobId,
        message: "Video upload successful",
        metadata,
      });
    } catch (error) {
      // Clean up file if validation fails
      try {
        await unlink(filepath);
      } catch (unlinkError) {
        console.error("Error deleting invalid file:", unlinkError);
      }

      throw error;
    }
  } catch (error) {
    console.error("Upload error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.name === "ValidationError" ? 400 : 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

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
      return NextResponse.json({ jobs });
    }

    // Return specific job
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

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Job fetch error:", error);
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

    // Cancel job
    const cancelled = videoQueue.cancelJob(jobId);
    if (!cancelled) {
      return NextResponse.json(
        { error: "Job cannot be cancelled" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Job cancelled successfully",
    });
  } catch (error) {
    console.error("Job cancellation error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}