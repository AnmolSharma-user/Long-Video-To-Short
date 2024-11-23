"use client";

import { useState } from "react";
import { InteractiveButton } from "@/components/ui/interactive-button";
import UploadModal from "@/components/UploadModal";

interface DashboardClientProps {
  userName: string;
  credits: number;
}

export default function DashboardClient({ userName, credits }: DashboardClientProps) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"file" | "youtube">("file");

  const handleUploadClick = (type: "file" | "youtube") => {
    setUploadType(type);
    setUploadModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userName}</h1>
            <p className="mt-1 text-sm text-gray-500">
              You have {credits} credits remaining
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Short Clips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InteractiveButton
                onClick={() => handleUploadClick("file")}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-indigo-500 transition-colors bg-transparent h-auto"
              >
                <svg
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">Upload Video File</p>
                <p className="mt-1 text-xs text-gray-500">MP4, MOV up to 500MB</p>
              </InteractiveButton>

              <InteractiveButton
                onClick={() => handleUploadClick("youtube")}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-indigo-500 transition-colors bg-transparent h-auto"
              >
                <svg
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">Paste YouTube URL</p>
                <p className="mt-1 text-xs text-gray-500">Any public YouTube video</p>
              </InteractiveButton>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h2>
            <div className="text-center text-gray-500 py-8">
              <p>No projects yet. Start by uploading a video or pasting a YouTube URL.</p>
            </div>
          </div>
        </div>
      </div>

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        type={uploadType}
      />
    </div>
  );
}