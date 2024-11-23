import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Configure persistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting auth persistence:", error);
});

// Export instances
export { app, db, storage, auth };

// Export types
export type {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  Query,
  CollectionReference,
} from "firebase/firestore";

// Helper functions
export const createTimestamp = () => new Date();

export const formatTimestamp = (timestamp: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(timestamp);
};

// Collection names as constants to prevent typos
export const COLLECTIONS = {
  USERS: "users",
  PROJECTS: "projects",
  CLIPS: "clips",
  CREDITS: "credits_history",
  PAYMENTS: "payments",
} as const;

// Document field names as constants
export const FIELDS = {
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
  USER_ID: "userId",
  STATUS: "status",
  CREDITS: "credits",
} as const;

// Status constants
export const STATUS = {
  ACTIVE: "active",
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
} as const;

// Error messages
export const ERRORS = {
  INSUFFICIENT_CREDITS: "Insufficient credits",
  INVALID_FILE_TYPE: "Invalid file type",
  FILE_TOO_LARGE: "File size exceeds limit",
  PROCESSING_FAILED: "Processing failed",
  UNAUTHORIZED: "Unauthorized access",
  NOT_FOUND: "Resource not found",
} as const;

// Validation rules
export const LIMITS = {
  MAX_FILE_SIZE: 500 * 1024 * 1024, // 500MB
  MAX_CLIPS_PER_PROJECT: 10,
  MIN_CLIP_DURATION: 15, // seconds
  MAX_CLIP_DURATION: 60, // seconds
  MAX_PROJECTS_PER_USER: 50,
} as const;

// Firebase error codes mapping
export const FIREBASE_ERRORS = {
  "auth/email-already-in-use": "This email is already registered",
  "auth/invalid-email": "Invalid email address",
  "auth/operation-not-allowed": "Operation not allowed",
  "auth/weak-password": "Password is too weak",
  "auth/user-disabled": "This account has been disabled",
  "auth/user-not-found": "No account found with this email",
  "auth/wrong-password": "Invalid password",
  "auth/invalid-credential": "Invalid credentials",
  "auth/network-request-failed": "Network error. Please check your connection",
} as const;

// Video processing options
export const VIDEO_OPTIONS = {
  FORMATS: ["mp4", "mov", "avi", "webm"],
  MAX_DURATION: 3600, // 1 hour in seconds
  MIN_DURATION: 60, // 1 minute in seconds
  SUPPORTED_RESOLUTIONS: ["720p", "1080p", "1440p", "2160p"],
  DEFAULT_RESOLUTION: "1080p",
  DEFAULT_FPS: 30,
  MAX_FPS: 60,
} as const;