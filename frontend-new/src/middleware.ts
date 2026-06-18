import { NextRequest, NextResponse } from "next/server";

// Maintenance mode — NOT prefixed with NEXT_PUBLIC_ (security: don't leak state to client)
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true";

const ALLOWED_PATHS = [
  "/api/",
  "/_next/",
  "/favicon",
  "/logo.webp",
  "/logo-white.webp",
  "/logo.png",
  "/apple-touch-icon.png",
  "/robots.txt",
  "/sitemap.xml",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets and API routes
  if (ALLOWED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Maintenance mode
  if (MAINTENANCE_MODE && pathname !== "/maintenance") {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|favicon-32.png|favicon-48.ico|apple-touch-icon.png|logo.webp|logo-white.webp|logo.png|robots.txt).*)"],
};
