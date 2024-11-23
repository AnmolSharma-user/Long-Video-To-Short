import React from "react";
import { cn } from "@/lib/utils/cn";
import type { ProcessingStage } from "@/lib/utils/progress";

interface JobStatusBadgeProps {
  stage: ProcessingStage;
  className?: string;
}

const statusConfig: Record<ProcessingStage, {
  label: string;
  className: string;
}> = {
  initializing: {
    label: "Initializing",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
  downloading: {
    label: "Downloading",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  analyzing: {
    label: "Analyzing",
    className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  },
  processing: {
    label: "Processing",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  enhancing: {
    label: "Enhancing",
    className: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  },
  generating_captions: {
    label: "Generating Captions",
    className: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
  },
  adding_music: {
    label: "Adding Music",
    className: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200",
  },
  finalizing: {
    label: "Finalizing",
    className: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
};

export function JobStatusBadge({ stage, className }: JobStatusBadgeProps) {
  const config = statusConfig[stage];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      <span className="relative flex h-2 w-2 mr-1.5">
        {stage !== "completed" && stage !== "failed" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-current" />
        )}
        <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
      </span>
      {config.label}
    </span>
  );
}

// Compact version of the status badge for use in tables or lists
export function CompactJobStatusBadge({ stage, className }: JobStatusBadgeProps) {
  const config = statusConfig[stage];

  return (
    <span
      className={cn(
        "inline-flex h-2 w-2 rounded-full",
        {
          "bg-gray-400": stage === "initializing",
          "bg-blue-400 animate-pulse": stage === "downloading",
          "bg-indigo-400 animate-pulse": stage === "analyzing",
          "bg-purple-400 animate-pulse": stage === "processing",
          "bg-pink-400 animate-pulse": stage === "enhancing",
          "bg-violet-400 animate-pulse": stage === "generating_captions",
          "bg-fuchsia-400 animate-pulse": stage === "adding_music",
          "bg-cyan-400 animate-pulse": stage === "finalizing",
          "bg-green-400": stage === "completed",
          "bg-red-400": stage === "failed",
        },
        className
      )}
      title={config.label}
    />
  );
}

// Large status badge with description
export function LargeJobStatusBadge({
  stage,
  description,
  className,
}: JobStatusBadgeProps & { description?: string }) {
  const config = statusConfig[stage];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "rounded-lg px-3 py-2",
          config.className
        )}
      >
        <div className="flex items-center">
          <span className="relative flex h-3 w-3 mr-2">
            {stage !== "completed" && stage !== "failed" && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-current" />
            )}
            <span className="relative inline-flex h-3 w-3 rounded-full bg-current" />
          </span>
          <span className="font-medium">{config.label}</span>
        </div>
        {description && (
          <p className="mt-1 text-sm opacity-80">{description}</p>
        )}
      </div>
    </div>
  );
}