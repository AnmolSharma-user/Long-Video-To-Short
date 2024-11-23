import { Metadata } from "next";
import { config } from "@/lib/config";

const title = config.app.name;
const description = config.app.description;
const url = config.app.url;

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  keywords: [
    "video editing",
    "AI video editor",
    "short form content",
    "video shorts",
    "content creation",
    "video processing",
    "AI tools",
    "video automation",
    "social media content",
    "video clips",
  ],
  authors: [{ name: "VideoShorts.AI Team" }],
  creator: "VideoShorts.AI Team",
  publisher: "VideoShorts.AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url,
    siteName: title,
    title,
    description,
    images: [
      {
        url: `${url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "VideoShorts.AI - AI-Powered Video Processing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@videoshortsai",
    images: [`${url}/og-image.png`],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.svg",
        color: "#111827",
      },
    ],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: url,
  },
  applicationName: title,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "Technology",
  classification: "Video Processing, AI Tools, Content Creation",
};