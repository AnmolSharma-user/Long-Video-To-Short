import React from "react";
import { useJobProgress } from "@/hooks/useJobProgress";
import type { ProgressUpdate } from "@/lib/utils/progress";

interface JobProgressBarProps {
  jobId: string;
  onComplete?: (update: ProgressUpdate) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export function JobProgressBar({
  jobId,
  onComplete,
  onError,
  className = "",
}: JobProgressBarProps) {
  const { progress, formattedProgress } = useJobProgress({
    jobId,
    onComplete,
    onError,
  });

  if (!progress) return null;

  return (
    <div className={`w-full space-y-2 ${className}`}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          {formattedProgress?.formattedMessage}
        </span>
        <span className="text-muted-foreground">
          {Math.round(progress.progress)}%
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute left-0 top-0 h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${Math.min(Math.max(progress.progress, 0), 100)}%` }}
        />
      </div>
      {progress.error && (
        <p className="mt-1 text-sm text-destructive">{progress.error}</p>
      )}
    </div>
  );
}

// Indeterminate progress bar for when we don't know the exact progress
export function IndeterminateProgressBar({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div className="absolute left-0 top-0 h-full w-1/3 animate-[progress-bar_1s_ease-in-out_infinite] rounded-full bg-primary" />
      </div>
    </div>
  );
}

// Mini progress bar for use in tables or lists
export function MiniProgressBar({
  progress,
  className = "",
}: {
  progress: number;
  className?: string;
}) {
  return (
    <div className={`h-1 w-full overflow-hidden rounded-full bg-secondary ${className}`}>
      <div
        className="h-full bg-primary transition-all duration-300 ease-in-out"
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      />
    </div>
  );
}

// Circular progress indicator
export function CircularProgress({
  progress,
  size = 24,
  strokeWidth = 2,
  className = "",
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      className={`transform -rotate-90 ${className}`}
      width={size}
      height={size}
    >
      {/* Background circle */}
      <circle
        className="text-secondary"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      {/* Progress circle */}
      <circle
        className="text-primary transition-all duration-300 ease-in-out"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  );
}