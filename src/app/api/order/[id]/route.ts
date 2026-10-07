import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getOrderById, storeConfigured } from "@/lib/store";

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
  const phone = request.nextUrl.searchParams.get("phone")?.replace(/\D/g, "");

  if (!storeConfigured()) {
    return NextResponse.json({ error: "Store not configured." }, { status: 503 });
  }
  if (!phone || phone.length < 7) {
    return NextResponse.json({ error: "A phone number is required." }, { status: 400 });
  }

  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const orderPhone = order.customer.phone.replace(/\D/g, "");
  if (orderPhone !== phone) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, order });
}