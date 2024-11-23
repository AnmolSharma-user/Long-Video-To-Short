import { z } from "zod";
import { VIDEO_LIMITS } from "@/lib/constants/jobs";

export const youtubeUrlSchema = z.string().url().refine(
  (url) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?([a-zA-Z0-9_-]{11})$/;
    return youtubeRegex.test(url);
  },
  {
    message: "Please enter a valid YouTube URL",
  }
);

export const uploadOptionsSchema = z.object({
  enhance: z.boolean().default(false),
  captions: z.boolean().default(false),
  backgroundMusic: z.boolean().default(false),
  outputFormat: z.enum(VIDEO_LIMITS.OUTPUT_FORMATS).default("mp4"),
  quality: z.enum(["low", "medium", "high"]).default("medium"),
});

export const fileUploadSchema = z.object({
  file: z.any().refine((file) => file instanceof File, "Please select a file").refine(
    (file: File) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      return extension && VIDEO_LIMITS.SUPPORTED_FORMATS.includes(extension);
    },
    {
      message: `Supported formats: ${VIDEO_LIMITS.SUPPORTED_FORMATS.join(", ")}`,
    }
  ).refine(
    (file: File) => file.size <= VIDEO_LIMITS.MAX_FILE_SIZE,
    {
      message: `Maximum file size is ${VIDEO_LIMITS.MAX_FILE_SIZE / (1024 * 1024)}MB`,
    }
  ),
  options: uploadOptionsSchema,
});

export const youtubeUploadSchema = z.object({
  url: youtubeUrlSchema,
  options: uploadOptionsSchema,
});

export type UploadOptions = z.infer<typeof uploadOptionsSchema>;
export type FileUploadSchema = z.infer<typeof fileUploadSchema>;
export type YoutubeUploadSchema = z.infer<typeof youtubeUploadSchema>;

// Helper function to validate YouTube URL
export function validateYoutubeUrl(url: string): boolean {
  try {
    youtubeUrlSchema.parse(url);
    return true;
  } catch {
    return false;
  }
}

// Helper function to validate file
export function validateFile(file: File): {
  valid: boolean;
  error?: string;
} {
  try {
    fileUploadSchema.shape.file.parse(file);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        error: error.errors[0]?.message,
      };
    }
    return {
      valid: false,
      error: "Invalid file",
    };
  }
}

// Helper function to get video ID from YouTube URL
export function getYoutubeVideoId(url: string): string | null {
  try {
    const match = url.match(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// Helper function to format file size
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

// Helper function to check if file type is supported
export function isSupportedFileType(file: File): boolean {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension ? VIDEO_LIMITS.SUPPORTED_FORMATS.includes(extension) : false;
}

// Helper function to check if file size is within limits
export function isFileSizeValid(file: File): boolean {
  return file.size <= VIDEO_LIMITS.MAX_FILE_SIZE;
}

// Helper function to get file extension
export function getFileExtension(filename: string): string | undefined {
  return filename.split(".").pop()?.toLowerCase();
}

// Helper function to generate a safe filename
export function generateSafeFilename(originalName: string): string {
  const timestamp = Date.now();
  const extension = getFileExtension(originalName) || "mp4";
  const safeName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/_{2,}/g, "_");
  return `${timestamp}-${safeName}.${extension}`;
}

// Helper function to estimate processing time based on options
export function estimateProcessingTime(
  durationInSeconds: number,
  options: UploadOptions
): number {
  let multiplier = 1;
  if (options.enhance) multiplier += 0.5;
  if (options.captions) multiplier += 0.3;
  if (options.backgroundMusic) multiplier += 0.2;
  if (options.quality === "high") multiplier += 0.5;

  return Math.ceil(durationInSeconds * multiplier);
}