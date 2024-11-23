import { spawn } from "child_process";
import { createReadStream, createWriteStream } from "fs";
import { mkdir, stat, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { v4 as uuidv4 } from "uuid";
import ffmpeg from "fluent-ffmpeg";
import { handleValidationError } from "./db-errors";

interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  format: string;
  bitrate: number;
  fps: number;
}

interface ProcessingOptions {
  startTime?: number;
  duration: number;
  enhance?: boolean;
  captions?: boolean;
  backgroundMusic?: string;
  outputFormat?: "mp4" | "mov" | "webm";
  quality?: "low" | "medium" | "high";
}

interface FfprobeStream {
  codec_type?: string;
  width?: number;
  height?: number;
  r_frame_rate?: string;
}

interface FfprobeFormat {
  duration?: number;
  format_name?: string;
  bit_rate?: string;
}

interface FfprobeData {
  streams: FfprobeStream[];
  format: FfprobeFormat;
}

const TEMP_DIR = join(tmpdir(), "video-shorts-ai");
const MAX_DURATION = parseInt(process.env.NEXT_PUBLIC_MAX_VIDEO_DURATION || "3600");
const SUPPORTED_FORMATS = ["mp4", "mov", "avi", "wmv", "webm"];

// Ensure temp directory exists
mkdir(TEMP_DIR, { recursive: true }).catch(console.error);

function calculateFps(frameRate: string | undefined): number {
  if (!frameRate) return 0;
  try {
    const [numerator, denominator] = frameRate.split('/').map(Number);
    if (!denominator) return numerator || 0;
    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) return 0;
    return Math.round((numerator / denominator) * 100) / 100; // Round to 2 decimal places
  } catch {
    return 0;
  }
}

export async function getVideoMetadata(filePath: string): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err: Error | null, metadata: FfprobeData) => {
      if (err) return reject(err);
      
      const videoStream = metadata.streams.find((s: FfprobeStream) => s.codec_type === "video");
      if (!videoStream) return reject(new Error("No video stream found"));

      const fps = calculateFps(videoStream.r_frame_rate);
      const format = metadata.format.format_name || "";
      const bitrate = metadata.format.bit_rate ? parseInt(metadata.format.bit_rate) : 0;

      resolve({
        duration: metadata.format.duration || 0,
        width: videoStream.width || 0,
        height: videoStream.height || 0,
        format,
        bitrate,
        fps,
      });
    });
  });
}

export async function validateVideo(filePath: string): Promise<VideoMetadata> {
  const metadata = await getVideoMetadata(filePath);
  const errors: Record<string, string> = {};

  if (metadata.duration > MAX_DURATION) {
    errors.duration = `Video duration exceeds maximum limit of ${MAX_DURATION} seconds`;
  }

  if (!SUPPORTED_FORMATS.some(format => metadata.format.toLowerCase().includes(format))) {
    errors.format = `Unsupported video format. Supported formats: ${SUPPORTED_FORMATS.join(", ")}`;
  }

  if (Object.keys(errors).length > 0) {
    handleValidationError("Invalid video file", errors);
  }

  return metadata;
}

export async function processVideo(
  inputPath: string,
  options: ProcessingOptions
): Promise<string> {
  const outputPath = join(TEMP_DIR, `${uuidv4()}.${options.outputFormat || "mp4"}`);
  const command = ffmpeg(inputPath);

  // Set start time and duration
  if (options.startTime) {
    command.setStartTime(options.startTime);
  }
  command.setDuration(options.duration);

  // Apply video enhancements if requested
  if (options.enhance) {
    command
      .videoFilters([
        "unsharp=5:5:1.0:5:5:0.0", // Sharpen
        "eq=contrast=1.1:brightness=0.05", // Adjust contrast and brightness
        "hqdn3d=1.5:1.5:6:6", // Denoise
      ]);
  }

  // Set quality presets
  switch (options.quality) {
    case "high":
      command
        .videoBitrate("2500k")
        .audioBitrate("192k")
        .outputOptions(["-preset", "slow"]);
      break;
    case "medium":
      command
        .videoBitrate("1500k")
        .audioBitrate("128k")
        .outputOptions(["-preset", "medium"]);
      break;
    case "low":
      command
        .videoBitrate("800k")
        .audioBitrate("96k")
        .outputOptions(["-preset", "fast"]);
      break;
    default:
      command
        .videoBitrate("1500k")
        .audioBitrate("128k")
        .outputOptions(["-preset", "medium"]);
  }

  // Add background music if provided
  if (options.backgroundMusic) {
    command
      .input(options.backgroundMusic)
      .complexFilter([
        // Mix original audio with background music
        "[1:a]volume=0.3[music]", // Reduce background music volume
        "[0:a][music]amix=inputs=2:duration=first[aout]",
      ])
      .outputOptions(["-map", "0:v", "-map", "[aout]"]);
  }

  // Generate captions if requested
  if (options.captions) {
    const subtitlesPath = join(TEMP_DIR, `${uuidv4()}.srt`);
    await generateCaptions(inputPath, subtitlesPath);
    command.addInput(subtitlesPath)
      .outputOptions(["-c:s", "mov_text"]);
  }

  // Set output format and codec
  command
    .outputFormat(options.outputFormat || "mp4")
    .outputOptions([
      "-movflags", "+faststart",
      "-c:v", "libx264",
      "-c:a", "aac",
    ]);

  return new Promise((resolve, reject) => {
    command
      .on("end", () => resolve(outputPath))
      .on("error", reject)
      .save(outputPath);
  });
}

async function generateCaptions(videoPath: string, outputPath: string): Promise<void> {
  // This is a placeholder for actual speech-to-text implementation
  // You would typically use a service like AWS Transcribe, Google Speech-to-Text, etc.
  return new Promise((resolve, reject) => {
    // Placeholder for actual caption generation
    const srtContent = `1
00:00:00,000 --> 00:00:02,000
[Music]

2
00:00:02,000 --> 00:00:04,000
Generated captions will appear here.`;

    const writeStream = createWriteStream(outputPath);
    writeStream.write(srtContent, 'utf8', (err) => {
      if (err) {
        writeStream.end();
        reject(err);
      } else {
        writeStream.end();
        resolve();
      }
    });
  });
}

export async function cleanupTempFiles(filePaths: string[]): Promise<void> {
  await Promise.all(
    filePaths.map(path =>
      unlink(path).catch(err => {
        console.error(`Failed to delete temp file ${path}:`, err);
      })
    )
  );
}

export function getVideoDimensions(width: number, height: number): { width: number; height: number } {
  const maxDimension = 1920;
  const aspectRatio = width / height;

  if (width > height) {
    return {
      width: Math.min(width, maxDimension),
      height: Math.round(Math.min(width, maxDimension) / aspectRatio),
    };
  } else {
    return {
      width: Math.round(Math.min(height, maxDimension) * aspectRatio),
      height: Math.min(height, maxDimension),
    };
  }
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function calculateFileSize(bitrate: number, duration: number): number {
  // Calculate file size in bytes (bitrate * duration / 8)
  return Math.round((bitrate * duration) / 8);
}

export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}