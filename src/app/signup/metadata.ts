import { Metadata } from "next";

const title = "Sign Up - VideoShorts.AI";
const description = "Create your account to start converting long videos into engaging short clips with AI. Get 100 free credits to try our service.";

export const metadata: Metadata = {
  title,
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
  ],
  authors: [{ name: "VideoShorts.AI Team" }],
  openGraph: {
    type: "website",
    title,
    description,
    siteName: "VideoShorts.AI",
    images: [
      {
        url: "/og-image.png",
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
    images: ["/og-image.png"],
    creator: "@videoshortsai",
  },
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: "https://videoshorts.ai/signup",
  },
  applicationName: "VideoShorts.AI",
  referrer: "origin-when-cross-origin",
  creator: "VideoShorts.AI Team",
  publisher: "VideoShorts.AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://videoshorts.ai"
  ),
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
  category: "Technology",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "VideoShorts.AI",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "msapplication-config": "/browserconfig.xml",
    "msapplication-TileColor": "#111827",
    "msapplication-tap-highlight": "no",
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
  appleWebApp: {
    capable: true,
    title: "VideoShorts.AI",
    statusBarStyle: "black-translucent",
  },
};

export default metadata;