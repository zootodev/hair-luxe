import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { addBooking, nextBookingId } from "@/lib/store";
import { sendBookingEmail } from "@/lib/email-server";
import type { Booking } from "@/lib/types";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

interface BookingBody {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  date?: string;
  time?: string;
  notes?: string;
  website?: string;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limited = rateLimit(`booking:${ip}`, 10, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "You are booking too quickly. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limited.retryAfterMs ?? 0) / 1000)) } }
    );
  }

  let body: BookingBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true, honeypot: true });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";

  if (!name || !/^[\d\s()+-]{7,}$/.test(phone)) {
    return NextResponse.json({ error: "Please provide your name and a valid phone number." }, { status: 400 });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (!body.service?.trim()) {
    return NextResponse.json({ error: "Please select a service." }, { status: 400 });
  }

  const date = body.date ?? "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const min = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const selected = new Date(date + "T00:00:00");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || selected.getTime() < min.getTime()) {
    return NextResponse.json(
      { error: "Please select a date at least 1 day from today." },
      { status: 400 }
    );
  }
  if (!TIME_SLOTS.includes(body.time ?? "")) {
    return NextResponse.json({ error: "Please select an available time." }, { status: 400 });
  }

  const booking: Booking = {
    id: await nextBookingId(),
    name,
    email,
    phone,
    service: body.service.trim(),
    date,
    time: body.time!,
    notes: body.notes?.trim() || undefined,
    dateCreated: new Date().toISOString(),
  };

  await addBooking(booking);
  const emailResult = await sendBookingEmail(booking);

  return NextResponse.json({ ok: true, booking, emailOk: emailResult.ok });
}