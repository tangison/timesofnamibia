import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, category, message } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name is required (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!category || typeof category !== "string") {
      return NextResponse.json(
        { error: "Department selection is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message is required (minimum 10 characters)." },
        { status: 400 }
      );
    }

    // Store as a WireSubmission (reusing existing model) or in SiteConfig
    // For now, store in the wire_submissions table with category = "contact"
    const submission = await db.wireSubmission.create({
      data: {
        title: `Contact: ${name} — ${category}`,
        category: "contact",
        priority: "routine",
        source: email.trim(),
        content: `Name: ${name.trim()}\nEmail: ${email.trim()}\nDepartment: ${category}\n\n${message.trim()}`,
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
