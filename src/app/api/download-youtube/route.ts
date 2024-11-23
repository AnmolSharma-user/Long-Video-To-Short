import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { join } from "path";
import { writeFile, unlink } from "fs/promises";
import ytdl from "ytdl-core";
import { authOptions } from "@/lib/auth";
import { videoQueue } from "@/lib/jobs/videoProcessor";
import { validateVideo } from "@/lib/utils/video";

const DOWNLOADS_DIR = join(process.cwd(), "downloads");

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

    // Parse request body
    const body = await req.json();
    const { url, options } = body;

    if (!url) {
      return NextResponse.json(
        { error: "YouTube URL is required" },
        { status: 400 }
      );
    }

    // Validate YouTube URL
    if (!ytdl.validateURL(url)) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    try {
      // Get video info
      const info = await ytdl.getInfo(url);
      const { videoDetails } = info;

      // Check video duration
      const duration = parseInt(videoDetails.lengthSeconds);
      const maxDuration = parseInt(process.env.NEXT_PUBLIC_MAX_VIDEO_DURATION || "3600");

      if (duration > maxDuration) {
        return NextResponse.json(
          {
            error: `Video duration (${Math.floor(duration / 60)} minutes) exceeds maximum limit (${Math.floor(maxDuration / 60)} minutes)`,
          },
          { status: 400 }
        );
      }

      // Create downloads directory if it doesn't exist
      try {
        await writeFile(join(DOWNLOADS_DIR, ".keep"), "");
      } catch (error) {
        // Directory already exists or can't be created
        console.error("Error creating downloads directory:", error);
      }

      // Generate unique filename
      const timestamp = Date.now();
      const safeTitle = videoDetails.title.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filename = `${timestamp}-${safeTitle}.mp4`;
      const filepath = join(DOWNLOADS_DIR, filename);

      // Get best quality format with both video and audio
      const format = ytdl.chooseFormat(info.formats, {
        quality: "highest",
        filter: "audioandvideo",
      });

      if (!format) {
        return NextResponse.json(
          { error: "No suitable video format found" },
          { status: 400 }
        );
      }

      // Download video
      const videoStream = ytdl.downloadFromInfo(info, { format });
      const chunks: Buffer[] = [];

      for await (const chunk of videoStream) {
        chunks.push(Buffer.from(chunk));
      }

      const buffer = Buffer.concat(chunks);
      await writeFile(filepath, buffer);

      try {
        // Validate downloaded video
        const metadata = await validateVideo(filepath);

        // Add job to queue
        const jobId = await videoQueue.addJob(session.user.id, filepath, {
          duration: metadata.duration,
          enhance: options?.enhance || false,
          captions: options?.captions || false,
          backgroundMusic: options?.backgroundMusic,
          outputFormat: options?.outputFormat || "mp4",
          quality: options?.quality || "medium",
        });

        return NextResponse.json({
          jobId,
          message: "YouTube video download successful",
          metadata,
          videoDetails: {
            title: videoDetails.title,
            author: videoDetails.author.name,
            duration: parseInt(videoDetails.lengthSeconds),
            thumbnail: videoDetails.thumbnails[0]?.url,
          },
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
      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: error.name === "ValidationError" ? 400 : 500 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("YouTube download error:", error);
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
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "YouTube URL is required" },
        { status: 400 }
      );
    }

    // Validate YouTube URL
    if (!ytdl.validateURL(url)) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    // Get video info
    const info = await ytdl.getInfo(url);
    const { videoDetails } = info;

    return NextResponse.json({
      videoDetails: {
        title: videoDetails.title,
        author: videoDetails.author.name,
        duration: parseInt(videoDetails.lengthSeconds),
        thumbnail: videoDetails.thumbnails[0]?.url,
        description: videoDetails.description,
        viewCount: videoDetails.viewCount,
        uploadDate: videoDetails.uploadDate,
      },
      formats: info.formats
        .filter(format => format.hasVideo && format.hasAudio)
        .map(format => ({
          quality: format.qualityLabel,
          container: format.container,
          codecs: format.codecs,
          size: format.contentLength
            ? `${(parseInt(format.contentLength) / 1024 / 1024).toFixed(1)} MB`
            : "Unknown",
        })),
    });
  } catch (error) {
    console.error("YouTube info error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}