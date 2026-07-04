// ============================================================
// Times of Namibia - Search API (TANGISON)
// Rate limit: 30/min/IP. Cache: 60s s-maxage.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchArticles } from "@/lib/data";
import { rateLimit } from "@/lib/auth";

const QuerySchema = z.object({
  q: z.string().trim().min(1).max(200),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  section: z.string().trim().max(50).optional(),
});

export async function GET(request: NextRequest) {
  if (rateLimit(request, { windowMs: 60_000, max: 30 })) {
    return NextResponse.json(
      { success: false, error: "Rate limited" },
      { status: 429 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const parsed = QuerySchema.safeParse({
      q: searchParams.get("q") ?? "",
      limit: searchParams.get("limit") ?? undefined,
      section: searchParams.get("section") ?? undefined,
    });
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { success: false, error: firstError?.message ?? "Invalid query" },
        { status: 400 }
      );
    }
    const articles = await searchArticles(parsed.data.q, {
      limit: parsed.data.limit,
      section: parsed.data.section,
    });
    return NextResponse.json(
      { success: true, query: parsed.data.q, articles },
      {
        status: 200,
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Search failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
