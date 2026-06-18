// ============================================================
// Times of Namibia — Contact Form API (TANGISON)
// Validation: Zod schema with length caps. Rate limit: 5/hour/IP.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/auth";

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email().max(254),
  category: z.string().trim().min(1).max(50),
  message: z.string().trim().min(10).max(5_000),
});

const ALLOWED_CATEGORIES = new Set([
  "news", "advertising", "editorial", "technical", "careers", "partnership", "other",
]);

export async function POST(request: NextRequest) {
  if (rateLimit(request, { windowMs: 60 * 60_000, max: 5 })) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    const { name, email, category, message } = parsed.data;
    if (!ALLOWED_CATEGORIES.has(category.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid department selection." },
        { status: 400 }
      );
    }
    const submission = await db.wireSubmission.create({
      data: {
        title: `Contact: ${name} — ${category}`.slice(0, 200),
        category: "contact",
        priority: "routine",
        source: email.trim(),
        content: `Name: ${name}\nEmail: ${email}\nDepartment: ${category}\n\n${message}`.slice(0, 10_000),
        verified: false,
      },
    });
    return NextResponse.json({
      success: true,
      message: "Your enquiry has been received. We respond within 24 hours.",
      id: submission.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "An error occurred while submitting your enquiry. Please try again." },
      { status: 500 }
    );
  }
}
