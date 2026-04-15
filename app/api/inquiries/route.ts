import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/schema";
import { inquirySchema } from "@/lib/validators";
import { sendInquiryNotification, sendInquiryConfirmation } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot check
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const data = inquirySchema.parse(body);

    // Save to DB
    await db.insert(inquiries).values({
      type: data.type,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      preferredDates: data.preferredDates || null,
      guests: data.guests || null,
      venue: data.venue || null,
      message: data.message || null,
    });

    // Send emails (don't block response on email failures)
    Promise.all([
      sendInquiryNotification(data),
      sendInquiryConfirmation({ name: data.name, email: data.email }),
    ]).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 400 }
    );
  }
}
