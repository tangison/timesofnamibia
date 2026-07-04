// ============================================================
// Times of Namibia - RSS Ingestion API (TANGISON)
// Admin-only. Rate-limited 3/5min/IP.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { ingestFeed, ingestAllFeeds } from "@/lib/rss-ingestion";
import { requireAdmin, rateLimit } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  if (rateLimit(request, { windowMs: 5 * 60_000, max: 3 })) {
    return NextResponse.json(
      { success: false, error: "Rate limited: max 3 ingestion triggers per 5 minutes" },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    if (body.all === true) {
      const results = await ingestAllFeeds();
      return NextResponse.json({ success: true, results });
    }
    if (body.feedId && typeof body.feedId === "string") {
      const result = await ingestFeed(body.feedId);
      return NextResponse.json({ success: true, result });
    }
    return NextResponse.json(
      { success: false, error: "Provide { feedId } or { all: true }" },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Ingestion failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
