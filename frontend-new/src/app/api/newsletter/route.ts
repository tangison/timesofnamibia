import { NextRequest, NextResponse } from "next/server";
import { subscribeNewsletter } from "@/lib/data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email || typeof body.email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const subscriber = await subscribeNewsletter(body.email, body.name);
    return NextResponse.json({ success: true, subscriber });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Subscription failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
