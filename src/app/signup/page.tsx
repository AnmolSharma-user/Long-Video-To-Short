import { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign Up - VideoShorts.AI",
  description: "Create your account to start converting long videos into engaging short clips with AI.",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        
        {/* Logo and Branding */}
        <div className="relative z-10 mb-8 text-center">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Image
              src="/icons/icon.svg"
              alt="VideoShorts.AI Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold text-white">VideoShorts.AI</span>
          </Link>
          <p className="mt-2 text-sm text-gray-400">
            Convert long videos into engaging short clips with AI
          </p>
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-md">
          <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-75 blur" />
          <SignupForm />
        </div>

        {/* Features List */}
        <div className="relative z-10 mt-12 grid grid-cols-1 gap-8 text-center sm:grid-cols-3 sm:gap-12">
          <div className="space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
              <svg
                className="h-6 w-6 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white">Fast Processing</h3>
            <p className="text-sm text-gray-400">
              Convert videos quickly with our optimized AI engine
            </p>
          </div>
          <div className="space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/10">
              <svg
                className="h-6 w-6 text-pink-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white">Smart Editing</h3>
            <p className="text-sm text-gray-400">
              AI detects the best parts of your videos automatically
            </p>
          </div>
          <div className="space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10">
              <svg
                className="h-6 w-6 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white">Secure & Private</h3>
            <p className="text-sm text-gray-400">
              Your videos are processed securely and privately
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 mt-12 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} VideoShorts.AI. All rights reserved.{" "}
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>{" "}
            ·{" "}
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}