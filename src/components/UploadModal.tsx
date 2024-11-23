import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useSession } from "next-auth/react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { JobProgressBar } from "@/components/ui/job-progress-bar";
import { JobStatusBadge } from "@/components/ui/job-status-badge";
import { VIDEO_LIMITS, ERROR_MESSAGES } from "@/lib/constants/jobs";
import type { ProgressUpdate } from "@/lib/utils/progress";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete?: (jobId: string) => void;
}

export function UploadModal({ open, onClose, onUploadComplete }: UploadModalProps) {
  const { data: session } = useSession();
  const [uploadType, setUploadType] = useState<"file" | "youtube">("file");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [uploadOptions, setUploadOptions] = useState({
    enhance: false,
    captions: false,
    backgroundMusic: false,
    outputFormat: "mp4" as const,
    quality: "medium" as const,
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: ERROR_MESSAGES.UNAUTHORIZED,
        variant: "destructive",
      });
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file size
    if (file.size > VIDEO_LIMITS.MAX_FILE_SIZE) {
      toast({
        title: "Error",
        description: ERROR_MESSAGES.FILE_TOO_LARGE,
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !VIDEO_LIMITS.SUPPORTED_FORMATS.includes(fileExtension)) {
      toast({
        title: "Error",
        description: ERROR_MESSAGES.INVALID_FORMAT,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("options", JSON.stringify(uploadOptions));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || ERROR_MESSAGES.SERVER_ERROR);
      }

      setCurrentJobId(data.jobId);
      toast({
        title: "Upload successful",
        description: "Your video is now being processed",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [session?.user?.id, uploadOptions]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": VIDEO_LIMITS.SUPPORTED_FORMATS.map(format => `.${format}`),
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleYoutubeUpload = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: ERROR_MESSAGES.UNAUTHORIZED,
        variant: "destructive",
      });
      return;
    }

    if (!youtubeUrl.trim()) {
      toast({
        title: "Error",
        description: ERROR_MESSAGES.INVALID_URL,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const response = await fetch("/api/download-youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: youtubeUrl,
          options: uploadOptions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || ERROR_MESSAGES.SERVER_ERROR);
      }

      setCurrentJobId(data.jobId);
      toast({
        title: "Download started",
        description: "Your video is being downloaded and processed",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : ERROR_MESSAGES.DOWNLOAD_FAILED,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadComplete = (update: ProgressUpdate) => {
    onUploadComplete?.(update.jobId);
    onClose();
    toast({
      title: "Processing complete",
      description: "Your video has been processed successfully",
    });
  };

  const handleUploadError = (error: Error) => {
    toast({
      title: "Processing failed",
      description: error.message,
      variant: "destructive",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="relative w-full max-w-2xl rounded-lg bg-background p-6 shadow-lg">
          <div className="mb-6 flex justify-between">
            <h2 className="text-2xl font-semibold">Upload Video</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="mb-6 flex gap-4">
            <Button
              onClick={() => setUploadType("file")}
              variant={uploadType === "file" ? "default" : "outline"}
            >
              Upload File
            </Button>
            <Button
              onClick={() => setUploadType("youtube")}
              variant={uploadType === "youtube" ? "default" : "outline"}
            >
              YouTube URL
            </Button>
          </div>

          <div className="mb-6">
            {uploadType === "file" ? (
              <div
                {...getRootProps()}
                className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary"
                }`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the video file here</p>
                ) : (
                  <div>
                    <p className="mb-2">
                      Drag & drop a video file here, or click to select
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supported formats: {VIDEO_LIMITS.SUPPORTED_FORMATS.join(", ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Maximum file size: {VIDEO_LIMITS.MAX_FILE_SIZE / (1024 * 1024)}MB
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Paste YouTube URL here"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full rounded-md border px-4 py-2"
                />
                <Button
                  onClick={handleYoutubeUpload}
                  disabled={isUploading || !youtubeUrl.trim()}
                  className="w-full"
                >
                  Download & Process
                </Button>
              </div>
            )}
          </div>

          <div className="mb-6 space-y-4">
            <h3 className="text-lg font-medium">Processing Options</h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={uploadOptions.enhance}
                  onChange={(e) =>
                    setUploadOptions((prev) => ({
                      ...prev,
                      enhance: e.target.checked,
                    }))
                  }
                />
                AI Video Enhancement
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={uploadOptions.captions}
                  onChange={(e) =>
                    setUploadOptions((prev) => ({
                      ...prev,
                      captions: e.target.checked,
                    }))
                  }
                />
                Generate Captions
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={uploadOptions.backgroundMusic}
                  onChange={(e) =>
                    setUploadOptions((prev) => ({
                      ...prev,
                      backgroundMusic: e.target.checked,
                    }))
                  }
                />
                Add Background Music
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Output Format</label>
                <select
                  value={uploadOptions.outputFormat}
                  onChange={(e) =>
                    setUploadOptions((prev) => ({
                      ...prev,
                      outputFormat: e.target.value as typeof uploadOptions.outputFormat,
                    }))
                  }
                  className="mt-1 w-full rounded-md border px-3 py-2"
                >
                  {VIDEO_LIMITS.OUTPUT_FORMATS.map((format) => (
                    <option key={format} value={format}>
                      {format.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Quality</label>
                <select
                  value={uploadOptions.quality}
                  onChange={(e) =>
                    setUploadOptions((prev) => ({
                      ...prev,
                      quality: e.target.value as typeof uploadOptions.quality,
                    }))
                  }
                  className="mt-1 w-full rounded-md border px-3 py-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          {currentJobId && (
            <div className="space-y-4">
              <JobProgressBar
                jobId={currentJobId}
                onComplete={handleUploadComplete}
                onError={handleUploadError}
              />
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}