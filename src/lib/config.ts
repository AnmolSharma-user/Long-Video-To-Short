import { z } from "zod";

const isDevelopment = process.env.NODE_ENV === "development";

// Base environment schema with all fields optional
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // NextAuth.js
  NEXTAUTH_URL: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),

  // Firebase
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),

  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Video Processing
  NEXT_PUBLIC_UPLOAD_MAX_SIZE: z.string().optional(),
  NEXT_PUBLIC_SUPPORTED_VIDEO_TYPES: z.string().optional(),
  NEXT_PUBLIC_MAX_VIDEO_DURATION: z.string().optional(),

  // Credits
  NEXT_PUBLIC_FREE_CREDITS: z.string().optional(),
  NEXT_PUBLIC_CREDIT_COST_PER_MINUTE: z.string().optional(),

  // API Rate Limiting
  RATE_LIMIT_MAX: z.string().optional(),
  RATE_LIMIT_WINDOW: z.string().optional(),

  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
});

// Development defaults
const devDefaults = {
  NEXT_PUBLIC_SUPABASE_URL: "https://gdslhzsvkbwjcbtbjhas.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "your-anon-key-here",
  NEXTAUTH_URL: "http://localhost:3000",
  NEXT_PUBLIC_UPLOAD_MAX_SIZE: "104857600",
  NEXT_PUBLIC_SUPPORTED_VIDEO_TYPES: "video/mp4,video/quicktime,video/x-msvideo",
  NEXT_PUBLIC_MAX_VIDEO_DURATION: "3600",
  NEXT_PUBLIC_FREE_CREDITS: "100",
  NEXT_PUBLIC_CREDIT_COST_PER_MINUTE: "2",
  RATE_LIMIT_MAX: "100",
  RATE_LIMIT_WINDOW: "60000",
  NODE_ENV: "development",
} as const;

// Parse environment with fallbacks
const env = isDevelopment
  ? { ...devDefaults, ...process.env }
  : process.env;

const parsedEnv = envSchema.parse(env);

// Application name and branding
const APP_NAME = "VideoShortsAI";
const APP_DESCRIPTION = "Transform long videos into engaging short clips with AI";
const APP_DOMAIN = isDevelopment ? "localhost:3000" : "videoshortsai.com";
const APP_URL = isDevelopment ? `http://${APP_DOMAIN}` : `https://${APP_DOMAIN}`;

// Export configuration object
export const config = {
  app: {
    name: APP_NAME,
    description: APP_DESCRIPTION,
    url: parsedEnv.NEXTAUTH_URL || devDefaults.NEXTAUTH_URL,
    environment: parsedEnv.NODE_ENV || devDefaults.NODE_ENV,
    domain: APP_DOMAIN,
  },
  seo: {
    defaultTitle: APP_NAME,
    titleTemplate: `%s | ${APP_NAME}`,
    defaultDescription: APP_DESCRIPTION,
    defaultKeywords: [
      "video editing",
      "AI",
      "short form content",
      "video clips",
      "content creation",
      "automation",
    ],
    openGraph: {
      type: "website",
      locale: "en_US",
      url: APP_URL,
      siteName: APP_NAME,
      images: [
        {
          url: `${APP_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: APP_NAME,
        },
      ],
    },
    twitter: {
      handle: "@videoshortsai",
      site: "@videoshortsai",
      cardType: "summary_large_image",
    },
  },
  supabase: {
    url: parsedEnv.NEXT_PUBLIC_SUPABASE_URL || devDefaults.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: parsedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY || devDefaults.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  video: {
    maxSize: parseInt(parsedEnv.NEXT_PUBLIC_UPLOAD_MAX_SIZE || devDefaults.NEXT_PUBLIC_UPLOAD_MAX_SIZE),
    supportedTypes: (parsedEnv.NEXT_PUBLIC_SUPPORTED_VIDEO_TYPES || devDefaults.NEXT_PUBLIC_SUPPORTED_VIDEO_TYPES).split(","),
    maxDuration: parseInt(parsedEnv.NEXT_PUBLIC_MAX_VIDEO_DURATION || devDefaults.NEXT_PUBLIC_MAX_VIDEO_DURATION),
  },
  credits: {
    free: parseInt(parsedEnv.NEXT_PUBLIC_FREE_CREDITS || devDefaults.NEXT_PUBLIC_FREE_CREDITS),
    costPerMinute: parseInt(parsedEnv.NEXT_PUBLIC_CREDIT_COST_PER_MINUTE || devDefaults.NEXT_PUBLIC_CREDIT_COST_PER_MINUTE),
  },
  rateLimit: {
    max: parseInt(parsedEnv.RATE_LIMIT_MAX || devDefaults.RATE_LIMIT_MAX),
    window: parseInt(parsedEnv.RATE_LIMIT_WINDOW || devDefaults.RATE_LIMIT_WINDOW),
  },
  pricing: {
    currency: "usd",
    plans: [
      {
        id: "starter",
        name: "Starter",
        description: "Perfect for occasional video creators",
        price: 9.99,
        credits: 500,
        features: [
          "500 credits per month",
          "Up to 30-minute videos",
          "Basic AI enhancement",
          "Standard support",
        ],
      },
      {
        id: "pro",
        name: "Professional",
        description: "For serious content creators",
        price: 24.99,
        credits: 1500,
        features: [
          "1,500 credits per month",
          "Up to 60-minute videos",
          "Advanced AI enhancement",
          "Priority support",
          "Custom background music",
        ],
      },
      {
        id: "business",
        name: "Business",
        description: "For teams and businesses",
        price: 99.99,
        credits: 10000,
        features: [
          "10,000 credits per month",
          "Unlimited video length",
          "Premium AI enhancement",
          "24/7 Priority support",
          "Custom branding",
          "Team collaboration",
        ],
      },
    ],
  },
} as const;

// Export environment checks
export const IS_DEVELOPMENT = config.app.environment === "development";
export const IS_PRODUCTION = config.app.environment === "production";
export const IS_TEST = config.app.environment === "test";