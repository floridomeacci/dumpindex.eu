import { NextRequest, NextResponse } from "next/server";

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || "";
const WEBHOOK_URL = "https://n8nfjm.org/webhook/dumpscore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, city, dirtLevel, turnstileToken, _website } = body;

    // Honeypot check — bots fill hidden fields
    if (_website) {
      // Silently accept but don't actually submit
      return NextResponse.json({ success: true });
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (!city) {
      return NextResponse.json({ error: "City required" }, { status: 400 });
    }

    // Cloudflare Turnstile verification
    if (TURNSTILE_SECRET && turnstileToken) {
      const turnstileRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: TURNSTILE_SECRET,
            response: turnstileToken,
          }),
        }
      );
      const turnstileData = await turnstileRes.json();
      if (!turnstileData.success) {
        return NextResponse.json(
          { error: "CAPTCHA verification failed" },
          { status: 403 }
        );
      }
    }

    // Get client IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Forward to n8n webhook with IP
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, city, dirtLevel, ip }),
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}