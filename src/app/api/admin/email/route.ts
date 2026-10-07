import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-session";
import { getBookings, getOrders } from "@/lib/store";
import { sendCustomerMessage } from "@/lib/email-server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: {
    orderId?: string;
    bookingId?: string;
    subject?: string;
    message?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const subject = body.subject?.trim();
  const message = body.message?.trim();
  if (!subject || !message) {
    return NextResponse.json({ error: "Subject and message are required." }, { status: 400 });
  }

  let to = "";
  let customerName = "";

  if (body.bookingId) {
    const bookings = await getBookings();
    const booking = bookings.find((b) => b.id.toLowerCase() === body.bookingId?.toLowerCase());
    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }
    to = booking.email;
    customerName = booking.name;
  } else if (body.orderId) {
    const orders = await getOrders();
    const order = orders.find((o) => o.id.toLowerCase() === body.orderId?.toLowerCase());
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    to = order.customer.email;
    customerName = `${order.customer.firstName} ${order.customer.lastName}`;
  } else {
    return NextResponse.json(
      { error: "Provide orderId or bookingId." },
      { status: 400 }
    );
  }

  const result = await sendCustomerMessage({
    to,
    subject,
    message,
    orderId: body.orderId,
    customerName,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: "Email service failed to send." },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true });
}