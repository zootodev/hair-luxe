import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-session";
import { getBookings, getOrders, storeConfigured } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const [orders, bookings] = await Promise.all([getOrders(), getBookings()]);
  return NextResponse.json(
    {
      ok: true,
      orders,
      bookings,
      storeConfigured: storeConfigured(),
      storeKind: storeConfigured() ? "persistent" : "memory",
    },
    { headers: { "Cache-Control": "no-store, must-revalidate" } }
  );
}