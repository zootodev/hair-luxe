import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getOrderById, storeConfigured } from "@/lib/store";
import { phonesMatch } from "@/lib/format";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limited = rateLimit(`track:${ip}`, 30, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limited.retryAfterMs ?? 0) / 1000)) } }
    );
  }

  const { id } = await context.params;
  const phone = request.nextUrl.searchParams.get("phone")?.trim() ?? "";

  if (!storeConfigured()) {
    return NextResponse.json({ error: "Store not configured." }, { status: 503 });
  }
  if (!phone || phone.replace(/\D/g, "").length < 7) {
    return NextResponse.json({ error: "A phone number is required." }, { status: 400 });
  }

  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  // phonesMatch normalises both sides, so 08123456789, 2348123456789 and
  // +2348123456789 all find the same order (legacy digits still match too).
  if (!phonesMatch(order.customer.phone, phone)) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json(
    { ok: true, order },
    { headers: { "Cache-Control": "no-store, must-revalidate" } }
  );
}