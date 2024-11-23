import { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Reset Password | VideoShortsAI",
  description: "Reset your VideoShortsAI account password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="/icons/icon.svg"
          alt={config.app.name}
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8">
        <ForgotPasswordForm />
      </div>

      <div className="mt-8 text-center">
        <a
          href="/login"
          className="text-sm font-medium text-primary hover:text-primary/90"
        >
          Back to login
        </a>
      </div>
    </div>
  );
}