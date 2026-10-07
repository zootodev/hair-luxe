import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-session";
import { getOrderById, updateOrderStatus } from "@/lib/store";
import { sendOrderStatusEmail } from "@/lib/email-server";
import type { Order } from "@/lib/types";

export const runtime = "nodejs";

const VALID_STATUSES: Order["status"][] = ["pending", "processing", "completed", "cancelled"];

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  let body: { status?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const status = body.status;
  if (!status || !VALID_STATUSES.includes(status as Order["status"])) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const existing = await getOrderById(id);
  if (!existing) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  await updateOrderStatus(id, status as Order["status"]);
  const updatedOrder = (await getOrderById(id)) ?? existing;
  const email = await sendOrderStatusEmail(updatedOrder);

  return NextResponse.json(
    { ok: true, emailOk: email.ok },
    { headers: { "Cache-Control": "no-store" } }
  );
}