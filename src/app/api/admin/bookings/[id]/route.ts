import { NextResponse, NextRequest } from "next/server";
import { isAdmin, verifyCsrf } from "@/lib/admin-session";
import { deleteBooking } from "@/lib/store";

export const runtime = "nodejs";

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