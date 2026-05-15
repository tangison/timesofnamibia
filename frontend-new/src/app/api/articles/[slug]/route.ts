import { NextRequest, NextResponse } from "next/server";
import { getArticleBySlug } from "@/lib/data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, article });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch article";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
