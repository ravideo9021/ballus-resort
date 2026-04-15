import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsletterSignups } from "@/lib/schema";
import { newsletterSchema } from "@/lib/validators";
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

    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const data = newsletterSchema.parse(body);

    await db
      .insert(newsletterSignups)
      .values({ email: data.email })
      .onConflictDoNothing();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 400 }
    );
  }
}
