import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./firebase";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import type { OAuthConfig } from "next-auth/providers/oauth";

interface GoogleProfile {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  sub: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        const userId = user.id;
        const usersRef = collection(db, "users");
        const userRef = doc(usersRef, userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          await setDoc(userRef, {
            id: userId,
            email: user.email,
            credits: 100, // Initial free credits
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        token.id = userId;
        token.credits = userDoc.exists() ? userDoc.data().credits : 100;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.credits = token.credits;
      }
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return !!(profile as GoogleProfile).email_verified;
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};