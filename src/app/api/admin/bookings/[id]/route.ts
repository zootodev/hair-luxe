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
  const deleted = await deleteBooking(id);
  if (!deleted) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}