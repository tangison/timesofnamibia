// ============================================================
// Times of Namibia - Admin Auth Helper
// Shared gate for admin-only API routes.
// ============================================================

import { NextRequest, NextResponse } from "next/server";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function extractBearer(request: NextRequest): string | null {
  const auth = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(auth);
  return match ? match[1].trim() : null;
}

export function requireAdmin(request: NextRequest): NextResponse | null {
  if (!ADMIN_TOKEN) {
    return NextResponse.json(
      { success: false, error: "Admin auth not configured (ADMIN_TOKEN missing)" },
      { status: 503 }
    );
  }
  const token = extractBearer(request);
  if (!token || !constantTimeEqual(token, ADMIN_TOKEN)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  return null;
}

const RATE_BUCKETS = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  request: NextRequest,
  opts: { windowMs: number; max: number }
): boolean {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const now = Date.now();
  const bucket = RATE_BUCKETS.get(ip);
  if (!bucket || bucket.resetAt < now) {
    RATE_BUCKETS.set(ip, { count: 1, resetAt: now + opts.windowMs });
    return false;
  }
  bucket.count += 1;
  if (bucket.count > opts.max) {
    return true;
  }
  return false;
}
