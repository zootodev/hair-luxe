import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin-session";
import { getBookings, getOrders, storeConfigured } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // CSRF validation
  const csrfToken = request.headers.get("x-csrf-token");
  const cookieToken = request.cookies.get("csrf-token")?.value;
  if (!csrfToken || !cookieToken || csrfToken !== cookieToken) {
    return NextResponse.json({ error: "Invalid CSRF token." }, { status: 403 });
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