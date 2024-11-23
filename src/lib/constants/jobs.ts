import type { ProcessingStage } from "@/lib/utils/progress";

export const JOB_STAGES: Record<ProcessingStage, {
  label: string;
  description: string;
  estimatedTime: number; // in seconds
}> = {
  initializing: {
    label: "Initializing",
    description: "Setting up video processing environment",
    estimatedTime: 5,
  },
  downloading: {
    label: "Downloading",
    description: "Downloading video content",
    estimatedTime: 30,
  },
  analyzing: {
    label: "Analyzing",
    description: "Analyzing video content for best segments",
    estimatedTime: 60,
  },
  processing: {
    label: "Processing",
    description: "Creating short video clips",
    estimatedTime: 120,
  },
  enhancing: {
    label: "Enhancing",
    description: "Applying AI video enhancements",
    estimatedTime: 90,
  },
  generating_captions: {
    label: "Generating Captions",
    description: "Creating AI-powered captions",
    estimatedTime: 45,
  },
  adding_music: {
    label: "Adding Music",
    description: "Adding and mixing background music",
    estimatedTime: 30,
  },
  finalizing: {
    label: "Finalizing",
    description: "Finalizing video output",
    estimatedTime: 15,
  },
  completed: {
    label: "Completed",
    description: "Video processing completed successfully",
    estimatedTime: 0,
  },
  failed: {
    label: "Failed",
    description: "Video processing failed",
    estimatedTime: 0,
  },
};

export const CREDIT_COSTS = {
  BASE_PROCESSING: 2, // Credits per minute of video
  ENHANCEMENTS: {
    AI_ENHANCE: 1, // Additional credits per minute for AI enhancement
    CAPTIONS: 1, // Additional credits per minute for captions
    BACKGROUND_MUSIC: 0.5, // Additional credits per minute for background music
  },
};

export const VIDEO_LIMITS = {
  MAX_DURATION: 3600, // Maximum video duration in seconds (1 hour)
  MAX_FILE_SIZE: 1024 * 1024 * 500, // Maximum file size in bytes (500MB)
  MIN_DURATION: 10, // Minimum video duration in seconds
  SUPPORTED_FORMATS: ["mp4", "mov", "avi", "webm"],
  OUTPUT_FORMATS: ["mp4", "mov", "webm"] as const,
  QUALITY_PRESETS: {
    low: {
      videoBitrate: "800k",
      audioBitrate: "96k",
      preset: "fast",
    },
    medium: {
      videoBitrate: "1500k",
      audioBitrate: "128k",
      preset: "medium",
    },
    high: {
      videoBitrate: "2500k",
      audioBitrate: "192k",
      preset: "slow",
    },
  },
};

export const CLIP_DURATIONS = {
  SHORT: 60, // 1 minute
  MEDIUM: 180, // 3 minutes
  LONG: 300, // 5 minutes
  CUSTOM_MAX: 600, // 10 minutes
};

export const PROCESSING_SETTINGS = {
  MAX_CONCURRENT_JOBS: 2,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 5000, // 5 seconds
  CLEANUP_DELAY: 3600000, // 1 hour in milliseconds
  TEMP_FILE_TTL: 86400000, // 24 hours in milliseconds
  PROGRESS_UPDATE_INTERVAL: 1000, // 1 second
};

export const ERROR_MESSAGES = {
  INSUFFICIENT_CREDITS: "Insufficient credits. Please purchase more credits to continue.",
  INVALID_FORMAT: "Invalid video format. Supported formats are: mp4, mov, avi, webm",
  FILE_TOO_LARGE: "File size exceeds the maximum limit of 500MB",
  DURATION_TOO_LONG: "Video duration exceeds the maximum limit of 1 hour",
  DURATION_TOO_SHORT: "Video duration is too short. Minimum duration is 10 seconds",
  PROCESSING_FAILED: "Video processing failed. Please try again",
  DOWNLOAD_FAILED: "Failed to download video. Please check the URL and try again",
  INVALID_URL: "Invalid video URL. Please provide a valid URL",
  UNAUTHORIZED: "Unauthorized. Please sign in to continue",
  SERVER_ERROR: "An unexpected error occurred. Please try again later",
} as const;

export const SUBSCRIPTION_CREDITS = {
  FREE: 100, // Credits for free tier
  BASIC: 500, // Credits for basic tier
  PRO: 2000, // Credits for pro tier
  ENTERPRISE: 5000, // Credits for enterprise tier
} as const;

export const CREDIT_PACKAGES = [
  {
    id: "credits-100",
    name: "Starter Pack",
    credits: 100,
    price: 100, // in cents (₹1)
    description: "Perfect for trying out the service",
  },
  {
    id: "credits-500",
    name: "Creator Pack",
    credits: 500,
    price: 450, // in cents (₹4.50)
    description: "Best value for regular creators",
  },
  {
    id: "credits-2000",
    name: "Professional Pack",
    credits: 2000,
    price: 1600, // in cents (₹16)
    description: "Ideal for professional content creators",
  },
  {
    id: "credits-5000",
    name: "Enterprise Pack",
    credits: 5000,
    price: 3500, // in cents (₹35)
    description: "For high-volume content production",
  },
] as const;