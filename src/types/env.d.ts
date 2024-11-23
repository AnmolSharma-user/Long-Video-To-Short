declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;

    // NextAuth.js
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;

    // Firebase
    NEXT_PUBLIC_FIREBASE_API_KEY: string;
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
    NEXT_PUBLIC_FIREBASE_APP_ID: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_PRIVATE_KEY: string;

    // Stripe
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;

    // Video Processing
    NEXT_PUBLIC_UPLOAD_MAX_SIZE: string; // 100MB in bytes
    NEXT_PUBLIC_SUPPORTED_VIDEO_TYPES: string; // comma-separated list
    NEXT_PUBLIC_MAX_VIDEO_DURATION: string; // seconds

    // Credits
    NEXT_PUBLIC_FREE_CREDITS: string;
    NEXT_PUBLIC_CREDIT_COST_PER_MINUTE: string;

    // API Rate Limiting
    RATE_LIMIT_MAX: string;
    RATE_LIMIT_WINDOW: string; // milliseconds

    // Node Environment
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

// Utility types for environment variables
export type VideoProcessingConfig = {
  maxSize: number;
  supportedTypes: string[];
  maxDuration: number;
};

export type CreditsConfig = {
  freeCredits: number;
  costPerMinute: number;
};

export type RateLimitConfig = {
  max: number;
  window: number;
};

// Constants derived from environment variables
export const VIDEO_PROCESSING: VideoProcessingConfig = {
  maxSize: parseInt(process.env.NEXT_PUBLIC_UPLOAD_MAX_SIZE),
  supportedTypes: process.env.NEXT_PUBLIC_SUPPORTED_VIDEO_TYPES.split(','),
  maxDuration: parseInt(process.env.NEXT_PUBLIC_MAX_VIDEO_DURATION),
} as const;

export const CREDITS: CreditsConfig = {
  freeCredits: parseInt(process.env.NEXT_PUBLIC_FREE_CREDITS),
  costPerMinute: parseInt(process.env.NEXT_PUBLIC_CREDIT_COST_PER_MINUTE),
} as const;

export const RATE_LIMIT: RateLimitConfig = {
  max: parseInt(process.env.RATE_LIMIT_MAX),
  window: parseInt(process.env.RATE_LIMIT_WINDOW),
} as const;