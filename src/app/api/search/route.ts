import { NextRequest, NextResponse } from "next/server";
import { searchArticles } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q");
    if (!q || q.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Search query (q) is required" },
        { status: 400 }
      );
    }

    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : undefined;
    const section = searchParams.get("section") || undefined;

    const articles = await searchArticles(q, { limit, section });

    return NextResponse.json({ success: true, query: q, articles });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Search failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
