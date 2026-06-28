import { NextRequest, NextResponse } from "next/server";
import { getArticles } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const section = searchParams.get("section") || undefined;
    const category = searchParams.get("category") || undefined;
    const source = searchParams.get("source") || undefined;
    const featured = searchParams.get("featured") === "true" ? true : undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : undefined;
    const offset = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!, 10)
      : undefined;

    const articles = await getArticles({
      section,
      category,
      source,
      featured,
      limit,
      offset,
    });

    return NextResponse.json({ success: true, articles });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch articles";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
