import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-session";
import { deleteOrder } from "@/lib/store";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await context.params;
  const deleted = await deleteOrder(id);
  if (!deleted) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}