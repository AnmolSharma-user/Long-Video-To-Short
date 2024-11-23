import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Login | VideoShortsAI",
  description: "Login to your VideoShortsAI account to create engaging short-form content.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="/icons/icon.svg"
          alt={config.app.name}
        />
      </div>

      <div className="mt-8">
        <LoginForm />
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        By continuing, you agree to our{" "}
        <a href="/terms" className="text-primary hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </a>
      </div>
    </div>
  );
}