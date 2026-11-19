import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { sendContactEmail } from "@/lib/email-server";

export const runtime = "nodejs";

interface ContactBody {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  website?: string;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limited = rateLimit(`contact:${ip}`, 10, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many messages. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limited.retryAfterMs ?? 0) / 1000)) } }
    );
  }

  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true, honeypot: true });
  }

  if (!body.name?.trim() || !body.message?.trim()) {
    return NextResponse.json({ error: "Please include your name and a message." }, { status: 400 });
  }

  const result = await sendContactEmail({
    name: body.name.trim(),
    email: body.email?.trim() ?? "",
    phone: body.phone?.trim() ?? "",
    subject: body.subject?.trim() ?? "",
    message: body.message.trim(),
  });

  if (!result.ok) {
    console.error(`[contact] Failed to send contact email (status ${result.status ?? "unknown"}).`);
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't send your message right now. Please try again or call us.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}