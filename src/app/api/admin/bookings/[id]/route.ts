import { NextResponse, NextRequest } from "next/server";
import { isAdmin, verifyCsrf } from "@/lib/admin-session";
import { BOOKING_STATUSES } from "@/lib/booking-status";
import { deleteBooking, getBookingById, updateBookingStatus } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const booking = await getBookingById(id);
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  return NextResponse.json(
    { ok: true, booking },
    { headers: { "Cache-Control": "no-store, must-revalidate" } }
  );
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!verifyCsrf(request)) {
    return NextResponse.json({ error: "Invalid CSRF token." }, { status: 403 });
  }

  const { id } = await context.params;
  let body: { status?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const status = body.status;
  if (!status || !BOOKING_STATUSES.includes(status as (typeof BOOKING_STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  let updated: boolean;
  try {
    updated = await updateBookingStatus(id, status as (typeof BOOKING_STATUSES)[number]);
  } catch (error) {
    console.error("[api/admin/bookings] status update failed", error);
    return NextResponse.json(
      { error: "Failed to update booking status. Please try again." },
      { status: 500 }
    );
  }
  if (!updated) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, status });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!verifyCsrf(request)) {
    return NextResponse.json({ error: "Invalid CSRF token." }, { status: 403 });
  }

  const { id } = await context.params;
  let deleted: boolean;
  try {
    deleted = await deleteBooking(id);
  } catch (error) {
    console.error("[api/admin/bookings] delete failed", error);
    return NextResponse.json(
      { error: "Failed to delete booking. Please try again." },
      { status: 500 }
    );
  }
  if (!deleted) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
