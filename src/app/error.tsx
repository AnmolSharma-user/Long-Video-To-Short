"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { errorLogger } from "@/lib/utils/error-logger";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error
    errorLogger.log(error, {
      notify: true,
      context: {
        page: "root",
        digest: error.digest,
      },
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        
        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Error Icon */}
          <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              className="h-12 w-12 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="mb-4 text-3xl font-bold text-white">Something went wrong</h1>
          <p className="mb-8 text-lg text-gray-400">
            We encountered an error while loading the page.
            {error.message && (
              <span className="block mt-2 text-sm text-red-400">
                Error details: {error.message}
              </span>
            )}
          </p>

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
            <Button
              onClick={reset}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Try Again
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Link href="/">Go Back Home</Link>
            </Button>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-400">
              Need help?{" "}
              <Link href="/contact" className="text-purple-400 hover:text-purple-300">
                Contact Support
              </Link>{" "}
              or{" "}
              <Link href="/faq" className="text-purple-400 hover:text-purple-300">
                Visit FAQ
              </Link>
            </p>
          </div>

          {/* Error Code */}
          {error.digest && (
            <div className="mt-8">
              <p className="text-xs text-gray-500">
                Error Code: {error.digest}
              </p>
            </div>
          )}

          {/* Background Decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent blur-2xl" />
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-auto pb-8">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} VideoShorts.AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}