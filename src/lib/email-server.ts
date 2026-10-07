import { BUSINESS, PUBLIC_KEY } from "@/lib/config";
import type { Booking, Order } from "@/lib/types";

const SERVICE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID";
const TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "YOUR_EMAILJS_TEMPLATE_ID";

export interface SendResult {
  ok: boolean;
  status?: number;
  text?: string;
}

export function formatOrderItems(items: Order["items"]): string {
  return items
    .map((i) => `${i.name} (x${i.quantity}) - $${(i.price * i.quantity).toFixed(2)}`)
    .join("\n");
}

async function send(
  template_params: Record<string, string | number>
): Promise<SendResult> {
  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params,
      }),
      cache: "no-store",
    });
    const text = await res.text();
    return { ok: res.status === 200, status: res.status, text };
  } catch (error) {
    console.error("Failed to send email server-side ->", error);
    return { ok: false };
  }
}

export function sendOrderEmail(order: Order): Promise<SendResult> {
  return send({
    order_id: order.id,
    customer_name: `${order.customer.firstName} ${order.customer.lastName}`,
    customer_phone: order.customer.phone,
    customer_email: order.customer.email,
    customer_city: order.customer.city,
    customer_address: order.customer.address || "N/A",
    delivery_method: order.customer.deliveryMethod === "delivery" ? "Delivery" : "Pickup",
    delivery_zone: order.customer.deliveryZone || "N/A",
    items: formatOrderItems(order.items),
    subtotal: order.subtotal.toFixed(2),
    delivery_fee: order.deliveryFee.toFixed(2),
    total: order.total.toFixed(2),
    payment_method: "Interac e-Transfer",
    order_date: new Date(order.date).toLocaleString("en-CA", {
      dateStyle: "full",
      timeStyle: "short",
    }),
    notes: order.customer.notes || "None",
    business_name: BUSINESS.name,
    interac_email: BUSINESS.interacEmail,
  });
}

const STATUS_NOTES: Record<Order["status"], string> = {
  pending: "We received your payment and are confirming your order.",
  processing: "Your order is being prepared. We will let you know as soon as it ships.",
  completed: "Your order is complete and ready.",
  cancelled: "Your order was cancelled. Contact us if this was unexpected.",
};

export function sendOrderStatusEmail(order: Order): Promise<SendResult> {
  return send({
    order_id: order.id,
    customer_name: `${order.customer.firstName} ${order.customer.lastName}`,
    customer_email: order.customer.email || order.customer.phone,
    order_status: order.status.toUpperCase(),
    status_message: STATUS_NOTES[order.status],
    total: order.total.toFixed(2),
    interac_email: BUSINESS.interacEmail,
    business_name: BUSINESS.name,
  });
}

export function sendBookingEmail(booking: Booking): Promise<SendResult> {
  return send({
    order_id: booking.id,
    customer_name: booking.name,
    customer_phone: booking.phone,
    customer_email: booking.email,
    service_booked: booking.service,
    preferred_date: booking.date,
    preferred_time: booking.time,
    notes: booking.notes || "None",
    business_name: BUSINESS.name,
  });
}

export function sendContactEmail(msg: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<SendResult> {
  return send({
    customer_name: msg.name,
    customer_email: msg.email,
    customer_phone: msg.phone || "Not provided",
    subject: msg.subject || "General Inquiry",
    message: msg.message,
    business_name: BUSINESS.name,
  });
}