import { BUSINESS, PUBLIC_KEY } from "@/lib/config";
import { formatPrice } from "@/lib/data/products";
import { studioLocation } from "@/lib/format";
import { statusLabel } from "@/lib/order-status";
import type { Booking, Order } from "@/lib/types";

const SERVICE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID";
/**
 * Template for emails TO the business (new orders, new bookings, contact
 * messages). Falls back to the legacy single template so nothing breaks before
 * EMAILJS_OWNER_TEMPLATE_ID is configured.
 */
const OWNER_TEMPLATE_ID =
  process.env.EMAILJS_OWNER_TEMPLATE_ID?.trim() ||
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID?.trim() ||
  "YOUR_EMAILJS_TEMPLATE_ID";
/**
 * Template for emails TO the customer (order/booking confirmations, status
 * updates, admin replies). Deliberately does NOT fall back to the owner
 * template: the legacy template is addressed to the owner, which is exactly
 * the bug this fixes. When unset, customer sends are skipped and logged.
 */
const CUSTOMER_TEMPLATE_ID =
  process.env.EMAILJS_CUSTOMER_TEMPLATE_ID?.trim() || "";
// Private key from EmailJS (Account > API keys). Sent as `accessToken` so the
// REST API accepts requests from server environments (Node/serverless), which
// EmailJS otherwise rejects with HTTP 403.
const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY?.trim() || undefined;

export interface SendResult {
  ok: boolean;
  status?: number;
  text?: string;
}

/** Exactly these params are sent — both templates read the same names. */
export interface EmailTemplateParams {
  subject: string;
  heading: string;
  message_html: string;
  to_email: string;
  to_name: string;
  reply_to: string;
  business_name: string;
}

/** A rendered email: which audience (and template) it goes to, plus its params. */
export interface EmailDraft {
  audience: "owner" | "customer";
  params: EmailTemplateParams;
}

/* ------------------------------------------------------------------ */
/* HTML helpers. Every user-supplied value is escaped, and blank        */
/* values are omitted entirely so an email never shows an empty         */
/* "Label:" line.                                                       */
/* ------------------------------------------------------------------ */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** One "Label: value" paragraph; omitted entirely when the value is blank. */
function line(
  label: string,
  value: string | number | null | undefined
): string {
  const raw = value == null ? "" : String(value).trim();
  if (!raw) return "";
  return `<p><strong>${label}:</strong> ${escapeHtml(raw).replace(/\r?\n/g, "<br>")}</p>`;
}

/** A plain paragraph (no label); omitted entirely when blank. */
function paragraph(text: string | null | undefined): string {
  const raw = (text ?? "").trim();
  if (!raw) return "";
  return `<p>${escapeHtml(raw).replace(/\r?\n/g, "<br>")}</p>`;
}

/** Join paragraphs/lists, dropping omitted ones. */
function lines(...parts: (string | string[])[]): string {
  return parts
    .flat()
    .filter(Boolean)
    .join("\n");
}

function itemsBlock(items: Order["items"]): string {
  if (items.length === 0) return "";
  const itemsHtml = items
    .map(
      (i) =>
        `<li>${escapeHtml(i.name)} (x${i.quantity}) — ${formatPrice(i.price * i.quantity)}</li>`
    )
    .join("\n");
  return `<ul>\n${itemsHtml}\n</ul>`;
}

/** Order date rendered in West Africa Time (WAT, UTC+1). Empty when invalid. */
function orderDateWAT(iso: string): string {
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return "";
  return new Date(ms).toLocaleString("en-NG", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Africa/Lagos",
  });
}

/** Booking date (YYYY-MM-DD) rendered readably, e.g. "Mon, 20 Oct 2026". */
function bookingDate(iso: string): string {
  const ms = Date.parse(`${iso}T00:00:00`);
  if (!Number.isFinite(ms)) return "";
  return new Date(ms).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function customerFullName(order: Order): string {
  return `${order.customer.firstName ?? ""} ${order.customer.lastName ?? ""}`.trim();
}

/** Shared order summary for the owner and customer copies of a new order. */
function orderSummaryLines(order: Order): string[] {
  const isDelivery = order.customer.deliveryMethod === "delivery";
  const where = isDelivery
    ? [order.customer.address, order.customer.city].filter(Boolean).join(", ")
    : studioLocation(BUSINESS.address, BUSINESS.city);
  return [
    line("Order", order.id),
    line("Customer", customerFullName(order)),
    line("Phone", order.customer.phone),
    line("Email", order.customer.email),
    itemsBlock(order.items),
    line("Subtotal", formatPrice(order.subtotal)),
    line("Delivery fee", formatPrice(order.deliveryFee)),
    line("Total", formatPrice(order.total)),
    line(isDelivery ? "Delivery" : "Pickup", where),
    line("Notes", order.customer.notes),
    line("Order date", orderDateWAT(order.date)),
  ];
}

const STATUS_NOTES: Record<Order["status"], string> = {
  pending: "We received your payment and are confirming your order.",
  processing: "Your order is being prepared. We will let you know as soon as it ships.",
  completed: "Your order is complete and ready.",
  cancelled: "Your order was cancelled. Contact us if this was unexpected.",
};

/* ------------------------------------------------------------------ */
/* Builders — one per email type. Each returns the audience it targets  */
/* and the shared template params.                                      */
/* ------------------------------------------------------------------ */

/** New order → owner. reply_to = the customer, so a reply reaches them. */
export function buildNewOrderOwnerEmail(order: Order): EmailDraft {
  return {
    audience: "owner",
    params: {
      subject: `New order ${order.id}`,
      heading: `New order ${order.id}`,
      message_html: lines(orderSummaryLines(order)),
      to_email: BUSINESS.email,
      to_name: BUSINESS.name,
      reply_to: order.customer.email || BUSINESS.email,
      business_name: BUSINESS.name,
    },
  };
}

/** New order → customer: confirmation with the same summary plus bank details. */
export function buildNewOrderCustomerEmail(order: Order): EmailDraft {
  return {
    audience: "customer",
    params: {
      subject: `Order confirmation ${order.id}`,
      heading: "Thank you for your order!",
      message_html: lines(
        paragraph(`Hello ${customerFullName(order)},`),
        orderSummaryLines(order),
        line("Bank name", BUSINESS.bankDetails.bankName),
        line("Account name", BUSINESS.bankDetails.accountName),
        line("Account number", BUSINESS.bankDetails.accountNumber),
        paragraph(
          "We'll confirm your transfer as soon as your payment lands and email you when your order is confirmed."
        )
      ),
      to_email: order.customer.email,
      to_name: customerFullName(order),
      reply_to: BUSINESS.email,
      business_name: BUSINESS.name,
    },
  };
}

/** Order status change → customer: new status (title case), message and total. */
export function buildOrderStatusEmail(order: Order): EmailDraft {
  const status = statusLabel(order.status);
  return {
    audience: "customer",
    params: {
      subject: `Status update for order ${order.id}: ${status}`,
      heading: "Order status update",
      message_html: lines(
        paragraph(`Hello ${customerFullName(order)},`),
        line("Order", order.id),
        line("New status", status),
        line("Status message", STATUS_NOTES[order.status]),
        line("Total", formatPrice(order.total))
      ),
      to_email: order.customer.email,
      to_name: customerFullName(order),
      reply_to: BUSINESS.email,
      business_name: BUSINESS.name,
    },
  };
}

/** New booking → owner. reply_to = the customer, so a reply reaches them. */
export function buildNewBookingOwnerEmail(booking: Booking): EmailDraft {
  return {
    audience: "owner",
    params: {
      subject: `New booking ${booking.id} – ${booking.service}`,
      heading: `New booking ${booking.id}`,
      message_html: lines(
        line("Service", booking.service),
        line("Date", bookingDate(booking.date)),
        line("Time", booking.time),
        line("Name", booking.name),
        line("Phone", booking.phone),
        line("Email", booking.email),
        line("Notes", booking.notes)
      ),
      to_email: BUSINESS.email,
      to_name: BUSINESS.name,
      reply_to: booking.email || BUSINESS.email,
      business_name: BUSINESS.name,
    },
  };
}

/** New booking → customer: received confirmation, same details + studio phone. */
export function buildNewBookingCustomerEmail(booking: Booking): EmailDraft {
  return {
    audience: "customer",
    params: {
      subject: `Booking received ${booking.id} – ${booking.service}`,
      heading: "Booking received",
      message_html: lines(
        paragraph(`Hello ${booking.name},`),
        paragraph(
          "We've received your booking request and will confirm it shortly."
        ),
        line("Service", booking.service),
        line("Date", bookingDate(booking.date)),
        line("Time", booking.time),
        line("Name", booking.name),
        line("Phone", booking.phone),
        line("Email", booking.email),
        line("Notes", booking.notes),
        line("Studio phone", BUSINESS.phone)
      ),
      to_email: booking.email,
      to_name: booking.name,
      reply_to: BUSINESS.email,
      business_name: BUSINESS.name,
    },
  };
}

export interface ContactMessageInput {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

/** Contact form → owner. reply_to = the sender, so a reply reaches them. */
export function buildContactOwnerEmail(msg: ContactMessageInput): EmailDraft {
  const subject = (msg.subject || "").trim();
  return {
    audience: "owner",
    params: {
      subject: `New message: ${subject || "General inquiry"}`,
      heading: "New contact message",
      message_html: lines(
        line("Name", msg.name),
        line("Email", msg.email),
        line("Phone", msg.phone),
        line("Subject", subject),
        line("Message", msg.message)
      ),
      to_email: BUSINESS.email,
      to_name: BUSINESS.name,
      reply_to: msg.email || BUSINESS.email,
      business_name: BUSINESS.name,
    },
  };
}

export interface AdminMessageInput {
  to: string;
  subject: string;
  message: string;
  orderId?: string;
  customerName?: string;
}

/** Admin "Email customer" → customer: subject and message exactly as written. */
export function buildAdminCustomerEmail(msg: AdminMessageInput): EmailDraft {
  return {
    audience: "customer",
    params: {
      subject: msg.subject,
      heading: escapeHtml(msg.subject),
      message_html: paragraph(msg.message),
      to_email: msg.to,
      to_name: msg.customerName || "Customer",
      reply_to: BUSINESS.email,
      business_name: BUSINESS.name,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Sending                                                             */
/* ------------------------------------------------------------------ */

async function send(
  templateId: string,
  template_params: EmailTemplateParams
): Promise<SendResult> {
  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: templateId,
        user_id: PUBLIC_KEY,
        ...(PRIVATE_KEY ? { accessToken: PRIVATE_KEY } : {}),
        template_params,
      }),
      cache: "no-store",
    });
    const text = await res.text();
    if (res.status !== 200) {
      console.error(
        `[email] EmailJS send failed (status ${res.status}): ${text}`
      );
    }
    return { ok: res.status === 200, status: res.status, text };
  } catch (error) {
    console.error("Failed to send email server-side ->", error);
    return { ok: false };
  }
}

function sendDraft(draft: EmailDraft): Promise<SendResult> {
  if (draft.audience === "owner") {
    return send(OWNER_TEMPLATE_ID, draft.params);
  }
  if (!CUSTOMER_TEMPLATE_ID) {
    console.warn(
      `[email] EMAILJS_CUSTOMER_TEMPLATE_ID is not set - skipping customer email "${draft.params.subject}".`
    );
    return Promise.resolve({
      ok: false,
      status: 0,
      text: "EMAILJS_CUSTOMER_TEMPLATE_ID is not set.",
    });
  }
  return send(CUSTOMER_TEMPLATE_ID, draft.params);
}

/**
 * Send the owner and customer copies of an order/booking email in parallel.
 * The result reported to the UI reflects the OWNER copy; a failed customer
 * copy is logged with its status and response text but never fails the flow.
 */
async function sendBoth(
  owner: EmailDraft,
  customer: EmailDraft,
  label: string
): Promise<SendResult> {
  const [ownerResult, customerResult] = await Promise.allSettled([
    sendDraft(owner),
    sendDraft(customer),
  ]);

  if (customerResult.status === "rejected") {
    console.error(
      `[email] customer email failed for ${label}:`,
      customerResult.reason
    );
  } else if (!customerResult.value.ok) {
    console.error(
      `[email] customer email failed for ${label} (status ${
        customerResult.value.status ?? "unknown"
      }): ${customerResult.value.text ?? ""}`
    );
  }

  if (ownerResult.status === "rejected") {
    console.error(`[email] owner email failed for ${label}:`, ownerResult.reason);
    return { ok: false };
  }
  return ownerResult.value;
}

export function sendOrderEmail(order: Order): Promise<SendResult> {
  return sendBoth(
    buildNewOrderOwnerEmail(order),
    buildNewOrderCustomerEmail(order),
    `order ${order.id}`
  );
}

export function sendOrderStatusEmail(order: Order): Promise<SendResult> {
  return sendDraft(buildOrderStatusEmail(order));
}

export function sendBookingEmail(booking: Booking): Promise<SendResult> {
  return sendBoth(
    buildNewBookingOwnerEmail(booking),
    buildNewBookingCustomerEmail(booking),
    `booking ${booking.id}`
  );
}

export function sendContactEmail(msg: ContactMessageInput): Promise<SendResult> {
  return sendDraft(buildContactOwnerEmail(msg));
}

export function sendCustomerMessage(msg: AdminMessageInput): Promise<SendResult> {
  return sendDraft(buildAdminCustomerEmail(msg));
}
