import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { nextOrderId } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limited = rateLimit(`nextid:${ip}`, 30, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limited.retryAfterMs ?? 0) / 1000)) } }
    );
  }
  const id = await nextOrderId();
  return NextResponse.json(
    { id },
    { headers: { "Cache-Control": "no-store, must-revalidate" } }
  );
}