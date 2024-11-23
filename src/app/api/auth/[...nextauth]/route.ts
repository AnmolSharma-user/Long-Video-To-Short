import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { supabase } from "@/lib/supabase";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error) {
          throw new Error(error.message);
        }

        if (!user) {
          throw new Error("User not found");
        }

        // Get additional user data from the database
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
        }

        return {
          id: user.id,
          email: user.email!,
          name: userData?.full_name || user.email?.split("@")[0] || "User",
          credits: userData?.credits || 0,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        // Handle OAuth sign in
        if (account.provider === "google" || account.provider === "github") {
          if (!user.email) return token;

          const { data: existingUser, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("email", user.email)
            .single();

          if (userError && userError.code !== "PGRST116") {
            console.error("Error checking existing user:", userError);
          }

          if (!existingUser) {
            // Create new user in Supabase
            const { data: newUser, error: createError } = await supabase
              .from("users")
              .insert({
                id: user.id,
                email: user.email,
                full_name: user.name || user.email.split("@")[0],
                credits: 100, // Initial free credits
              })
              .select()
              .single();

            if (createError) {
              console.error("Error creating user:", createError);
            } else if (newUser) {
              token.credits = newUser.credits;
            }
          } else {
            token.credits = existingUser.credits;
          }
        }

        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        if (typeof user.credits === "number") {
          token.credits = user.credits;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.credits = token.credits as number;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };