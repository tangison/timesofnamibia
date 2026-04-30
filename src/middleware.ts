import { NextRequest, NextResponse } from "next/server";

// Maintenance mode: set NEXT_PUBLIC_MAINTENANCE_MODE=true in .env to enable
const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

// Paths that should always be accessible even in maintenance mode
const ALLOWED_PATHS = [
  "/api/",
  "/_next/",
  "/favicon",
  "/logo.svg",
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|favicon-32.png|favicon-48.png|favicon.svg|apple-touch-icon.png|logo.svg|robots.txt).*)"],
};
