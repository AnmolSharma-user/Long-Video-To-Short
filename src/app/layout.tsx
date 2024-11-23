import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import Providers from "@/components/providers/Providers";
import { ClientToaster } from "@/components/ui/client-toaster";
import { metadata as baseMetadata } from "./metadata";
import { viewport } from "./viewport";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export { viewport };
export const metadata: Metadata = {
  ...baseMetadata,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navigation />
            <main className="pt-16">{children}</main>
            <ClientToaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}