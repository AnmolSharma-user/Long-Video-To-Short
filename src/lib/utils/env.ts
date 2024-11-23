import { z } from "zod";

const isDevelopment = process.env.NODE_ENV === "development";

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().default("https://gdslhzsvkbwjcbtbjhas.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default("your-anon-key-here"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default("your-service-role-key-here"),

  // NextAuth.js
  NEXTAUTH_URL: z.string().default("http://localhost:3000"),
  NEXTAUTH_SECRET: z.string().default("your-nextauth-secret-here"),

  // Firebase
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().default("your-api-key-here"),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().default("your-auth-domain-here"),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().default("your-project-id-here"),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().default("your-storage-bucket-here"),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().default("your-messaging-sender-id-here"),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().default("your-app-id-here"),
  FIREBASE_CLIENT_EMAIL: z.string().default("your-client-email-here"),
  FIREBASE_PRIVATE_KEY: z.string().default("your-private-key-here"),

  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().default("your-publishable-key-here"),
  STRIPE_SECRET_KEY: z.string().default("your-secret-key-here"),
  STRIPE_WEBHOOK_SECRET: z.string().default("your-webhook-secret-here"),

  // Video Processing
  NEXT_PUBLIC_UPLOAD_MAX_SIZE: z.string()
    .default("104857600")
    .transform((val: string) => parseInt(val, 10)),
  NEXT_PUBLIC_SUPPORTED_VIDEO_TYPES: z.string()
    .default("video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv"),
  NEXT_PUBLIC_MAX_VIDEO_DURATION: z.string()
    .default("3600")
    .transform((val: string) => parseInt(val, 10)),

  // Credits
  NEXT_PUBLIC_FREE_CREDITS: z.string()
    .default("100")
    .transform((val: string) => parseInt(val, 10)),
  NEXT_PUBLIC_CREDIT_COST_PER_MINUTE: z.string()
    .default("2")
    .transform((val: string) => parseInt(val, 10)),

  // API Rate Limiting
  RATE_LIMIT_MAX: z.string()
    .default("100")
    .transform((val: string) => parseInt(val, 10)),
  RATE_LIMIT_WINDOW: z.string()
    .default("60000")
    .transform((val: string) => parseInt(val, 10)),

  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

type EnvSchema = z.infer<typeof envSchema>;

export function validateEnv(): { success: true; data: EnvSchema } | { success: false; error: string } {
  try {
    const parsed = envSchema.parse(process.env);

    // In production, ensure all required values are properly set
    if (process.env.NODE_ENV === "production") {
      const productionSchema = envSchema.required();
      productionSchema.parse(process.env);
    }

    return {
      success: true,
      data: parsed,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err: z.ZodIssue) => err.path.join("."))
        .join(", ");
      
      if (isDevelopment) {
        console.warn(
          `⚠️ Using default values for environment variables: ${missingVars}`
        );
        return {
          success: true,
          data: envSchema.parse({}),
        };
      }

      console.error(
        `❌ Invalid or missing environment variables: ${missingVars}`
      );
      return {
        success: false,
        error: `Invalid or missing environment variables: ${missingVars}`,
      };
    }
    console.error("❌ Failed to validate environment variables:", error);
    return {
      success: false,
      error: "Failed to validate environment variables",
    };
  }
}

export function getValidatedEnv(): EnvSchema {
  const result = validateEnv();
  if (!result.success) {
    if (isDevelopment) {
      console.warn("⚠️ Using default environment values in development");
      return envSchema.parse({});
    }
    throw new Error(result.error);
  }
  return result.data;
}

// Validate environment variables
const env = getValidatedEnv();

// Export validated environment variables
export const {
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  NEXTAUTH_URL,
  NEXTAUTH_SECRET,
  NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
  NEXT_PUBLIC_UPLOAD_MAX_SIZE,
  NEXT_PUBLIC_SUPPORTED_VIDEO_TYPES,
  NEXT_PUBLIC_MAX_VIDEO_DURATION,
  NEXT_PUBLIC_FREE_CREDITS,
  NEXT_PUBLIC_CREDIT_COST_PER_MINUTE,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW,
  NODE_ENV,
} = env;

// Export derived constants
export const IS_PRODUCTION = NODE_ENV === "production";
export const IS_DEVELOPMENT = NODE_ENV === "development";
export const IS_TEST = NODE_ENV === "test";

export const SUPPORTED_VIDEO_TYPES = NEXT_PUBLIC_SUPPORTED_VIDEO_TYPES.split(",");

export const VIDEO_CONFIG = {
  maxSize: NEXT_PUBLIC_UPLOAD_MAX_SIZE,
  supportedTypes: SUPPORTED_VIDEO_TYPES,
  maxDuration: NEXT_PUBLIC_MAX_VIDEO_DURATION,
} as const;

export const CREDITS_CONFIG = {
  freeCredits: NEXT_PUBLIC_FREE_CREDITS,
  costPerMinute: NEXT_PUBLIC_CREDIT_COST_PER_MINUTE,
} as const;

export const RATE_LIMIT_CONFIG = {
  max: RATE_LIMIT_MAX,
  window: RATE_LIMIT_WINDOW,
} as const;