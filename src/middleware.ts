import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Paths that don't require authentication
const publicPaths = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/pricing",
  "/api/auth/signin",
  "/api/auth/signup",
  "/api/auth/callback",
];

// Paths that should redirect to dashboard if user is authenticated
const authPaths = ["/login", "/signup", "/forgot-password", "/reset-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is for static files or API routes (except auth routes)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/icons/") ||
    pathname.startsWith("/fonts/") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".gif") ||
    pathname.endsWith(".webp") ||
    pathname.endsWith(".webmanifest")
  ) {
    return NextResponse.next();
  }

  // Get the token from the session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if the path is public
  const isPublicPath = publicPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Check if the path is an auth path (login, signup, etc.)
  const isAuthPath = authPaths.some((path) =>
    pathname.startsWith(path)
  );

  // If the path is public and user is not authenticated, allow access
  if (isPublicPath && !token) {
    return NextResponse.next();
  }

  // If the path is an auth path and user is authenticated,
  // redirect to dashboard
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the path is not public and user is not authenticated,
  // redirect to login
  if (!isPublicPath && !token) {
    const searchParams = new URLSearchParams({
      callbackUrl: pathname,
    });
    return NextResponse.redirect(
      new URL(`/login?${searchParams}`, request.url)
    );
  }

  // If none of the above conditions are met, allow access
  return NextResponse.next();
}

// Configure paths that should be matched by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};