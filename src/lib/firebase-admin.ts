import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

// Initialize Firebase Admin
const apps = getApps();

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};

const adminApp = apps.length > 0 ? apps[0] : initializeApp(firebaseAdminConfig);

// Initialize Admin services
const adminDb = getFirestore(adminApp);
const adminAuth = getAuth(adminApp);
const adminStorage = getStorage(adminApp);

// Admin helper functions
export async function verifyIdToken(token: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const userRecord = await adminAuth.getUserByEmail(email);
    return userRecord;
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw error;
  }
}

export async function createCustomToken(uid: string) {
  try {
    const customToken = await adminAuth.createCustomToken(uid);
    return customToken;
  } catch (error) {
    console.error("Error creating custom token:", error);
    throw error;
  }
}

export async function revokeRefreshTokens(uid: string) {
  try {
    await adminAuth.revokeRefreshTokens(uid);
  } catch (error) {
    console.error("Error revoking refresh tokens:", error);
    throw error;
  }
}

export async function deleteUser(uid: string) {
  try {
    await adminAuth.deleteUser(uid);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function updateUserClaims(uid: string, claims: object) {
  try {
    await adminAuth.setCustomUserClaims(uid, claims);
  } catch (error) {
    console.error("Error updating user claims:", error);
    throw error;
  }
}

export async function generateSignedUrl(filePath: string, expiresIn = 3600) {
  try {
    const [url] = await adminStorage
      .bucket()
      .file(filePath)
      .getSignedUrl({
        action: "read",
        expires: Date.now() + expiresIn * 1000,
      });
    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
}

export async function deleteFile(filePath: string) {
  try {
    await adminStorage.bucket().file(filePath).delete();
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

export async function moveFile(sourcePath: string, destinationPath: string) {
  try {
    await adminStorage.bucket().file(sourcePath).move(destinationPath);
  } catch (error) {
    console.error("Error moving file:", error);
    throw error;
  }
}

// Batch operations
export async function batchUpdateUsers(updates: { uid: string; data: any }[]) {
  const batch = adminDb.batch();
  
  updates.forEach(({ uid, data }) => {
    const userRef = adminDb.collection("users").doc(uid);
    batch.update(userRef, {
      ...data,
      updatedAt: new Date(),
    });
  });

  try {
    await batch.commit();
  } catch (error) {
    console.error("Error in batch update:", error);
    throw error;
  }
}

// Export admin instances
export { adminApp, adminDb, adminAuth, adminStorage };

// Export types
export type {
  UserRecord,
  DecodedIdToken,
  ListUsersResult,
} from "firebase-admin/auth";

export type {
  WriteResult,
  DocumentSnapshot,
  QuerySnapshot,
} from "firebase-admin/firestore";