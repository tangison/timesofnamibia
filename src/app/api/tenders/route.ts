import { NextRequest, NextResponse } from "next/server";
import { getTenders } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status") || undefined;
    const department = searchParams.get("department") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : undefined;

    const tenders = await getTenders({ status, department, limit });

    return NextResponse.json({ success: true, tenders });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch tenders";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
