"use client";

import emailjs from "@emailjs/browser";
import type { Order, Booking } from "@/lib/types";
import { BUSINESS, PUBLIC_KEY } from "@/lib/config";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "YOUR_EMAILJS_TEMPLATE_ID";

export function formatOrderItems(items: Order["items"]): string {
  return items
    .map((i) => `${i.name} (x${i.quantity}) - $${(i.price * i.quantity).toFixed(2)}`)
    .join("\n");
}

export interface SendResult {
  ok: boolean;
  status?: number;
  text?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(msg: ContactMessage): Promise<SendResult> {
  try {
    const templateParams = {
      customer_name: msg.name,
      customer_email: msg.email,
      customer_phone: msg.phone || "Not provided",
      subject: msg.subject || "General Inquiry",
      message: msg.message,
      business_name: BUSINESS.name,
    };
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      { publicKey: PUBLIC_KEY }
    );
    return { ok: result.status === 200, status: result.status };
  } catch (error) {
    const err = error as { status?: number; text?: string };
    console.error("Failed to send contact email ->", { status: err.status, text: err.text });
    return { ok: false, status: err.status, text: err.text };
  }
}

export async function sendOrderEmail(order: Order): Promise<SendResult> {
  try {
    const templateParams = {
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
    };

    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      { publicKey: PUBLIC_KEY }
    );
    return { ok: result.status === 200, status: result.status };
  } catch (error) {
    const err = error as { status?: number; text?: string };
    console.error("Failed to send order email ->", {
      status: err.status,
      text: err.text,
    });
    return { ok: false, status: err.status, text: err.text };
  }
}

export async function sendBookingEmail(booking: Booking): Promise<SendResult> {
  try {
    const templateParams = {
      order_id: booking.id,
      customer_name: booking.name,
      customer_phone: booking.phone,
      customer_email: booking.email,
      service_booked: booking.service,
      preferred_date: booking.date,
      preferred_time: booking.time,
      notes: booking.notes || "None",
      business_name: BUSINESS.name,
    };

    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      { publicKey: PUBLIC_KEY }
    );
    return { ok: result.status === 200, status: result.status };
  } catch (error) {
    const err = error as { status?: number; text?: string };
    console.error("Failed to send booking email ->", {
      status: err.status,
      text: err.text,
    });
    return { ok: false, status: err.status, text: err.text };
  }
}