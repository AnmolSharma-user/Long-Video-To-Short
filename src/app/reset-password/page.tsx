import { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Reset Password | VideoShortsAI",
  description: "Create a new password for your VideoShortsAI account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="/icons/icon.svg"
          alt={config.app.name}
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create new password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please enter your new password below.
        </p>
      </div>

      <div className="mt-8">
        <ResetPasswordForm />
      </div>
    </div>
  );
}