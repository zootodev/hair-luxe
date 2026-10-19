import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildAdminCustomerEmail,
  buildContactOwnerEmail,
  buildNewBookingCustomerEmail,
  buildNewBookingOwnerEmail,
  buildNewOrderCustomerEmail,
  buildNewOrderOwnerEmail,
  buildOrderStatusEmail,
  type EmailDraft,
} from "@/lib/email-server";
import { BUSINESS } from "@/lib/config";
import type { Booking, Order } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Fixtures (with HTML-injecting user input)                            */
/* ------------------------------------------------------------------ */

const order: Order = {
  id: "HL-2026-0042",
  customer: {
    firstName: "Ada",
    lastName: "Obi <script>alert(1)</script>",
    email: "ada@example.com",
    phone: "0812 345 6789",
    city: "Lagos",
    address: "12 Marina Road & <b>Avenue</b>",
    deliveryMethod: "delivery",
    notes: "Leave at the gate <img src=x>",
  },
  items: [
    {
      productId: "w-1",
      name: "Luxury Wig & <em>Bundle</em>",
      price: 4500,
      quantity: 2,
      category: "Wigs",
      image: "",
    },
    {
      productId: "c-1",
      name: "Clip-ins",
      price: 1750,
      quantity: 1,
      category: "Hair Bundles",
      image: "",
    },
  ],
  subtotal: 10750,
  deliveryFee: 3000,
  total: 13750,
  status: "pending",
  paymentMethod: "bank-transfer",
  date: "2026-10-19T09:00:00.000Z",
};

const pickupOrder: Order = {
  ...order,
  id: "HL-2026-0043",
  customer: {
    ...order.customer,
    address: undefined,
    notes: undefined, // must be omitted from the email, not shown empty
    deliveryMethod: "pickup",
  },
};

const booking: Booking = {
  id: "BK-2026-0009",
  name: "Zara <script>alert(2)</script>",
  email: "zara@example.com",
  phone: "0701 234 5678",
  service: "Wig Making",
  date: "2026-10-20",
  time: "12:00 PM",
  notes: "First time client <i>(vip)</i>",
  dateCreated: "2026-10-19T10:00:00.000Z",
};

const bookingNoNotes: Booking = {
  ...booking,
  id: "BK-2026-0010",
  notes: undefined,
};

const contact = {
  name: "Jo <b>Doe</b>",
  email: "jo@example.com",
  phone: "0803 111 2222",
  subject: "Delivery question",
  message: "When do you ship to <i>Ibadan</i>?",
};

const adminMessage = {
  to: "ada@example.com",
  subject: "About your order",
  message: "We've shipped it — <u>track here</u>.",
  orderId: "HL-2026-0042",
  customerName: "Ada Obi",
};

const ALL_DRAFTS: Array<[string, EmailDraft]> = [
  ["new order -> owner", buildNewOrderOwnerEmail(order)],
  ["new order -> customer", buildNewOrderCustomerEmail(order)],
  ["order status -> customer", buildOrderStatusEmail({ ...order, status: "completed" })],
  ["new booking -> owner", buildNewBookingOwnerEmail(booking)],
  ["new booking -> customer", buildNewBookingCustomerEmail(booking)],
  ["contact -> owner", buildContactOwnerEmail(contact)],
  ["admin message -> customer", buildAdminCustomerEmail(adminMessage)],
];

const PARAM_KEYS = [
  "business_name",
  "heading",
  "message_html",
  "reply_to",
  "subject",
  "to_email",
  "to_name",
];

/** Matches a "Label:" paragraph left empty because its value was omitted. */
const EMPTY_LABEL = /<\/strong>\s*<\/p>/;

/* ------------------------------------------------------------------ */
/* Shared template contract                                            */
/* ------------------------------------------------------------------ */

describe("template params", () => {
  it.each(ALL_DRAFTS)("sends exactly the shared param set: %s", (_label, draft) => {
    expect(Object.keys(draft.params).sort()).toEqual(PARAM_KEYS);
    for (const key of PARAM_KEYS) {
      expect(typeof draft.params[key as keyof typeof draft.params]).toBe("string");
    }
  });

  it.each(ALL_DRAFTS)("includes the business name: %s", (_label, draft) => {
    expect(draft.params.business_name).toBe(BUSINESS.name);
  });
});

/* ------------------------------------------------------------------ */
/* Subjects                                                            */
/* ------------------------------------------------------------------ */

describe("subjects", () => {
  it("uses order-appropriate subjects for the order emails", () => {
    expect(buildNewOrderOwnerEmail(order).params.subject).toBe(
      "New order HL-2026-0042"
    );
    expect(buildNewOrderCustomerEmail(order).params.subject).toBe(
      "Order confirmation HL-2026-0042"
    );
  });

  it("uses the specified subjects for bookings and contact messages", () => {
    expect(buildNewBookingOwnerEmail(booking).params.subject).toBe(
      "New booking BK-2026-0009 – Wig Making"
    );
    expect(buildNewBookingCustomerEmail(booking).params.subject).toBe(
      "Booking received BK-2026-0009 – Wig Making"
    );
    expect(buildContactOwnerEmail(contact).params.subject).toBe(
      "New message: Delivery question"
    );
    expect(buildContactOwnerEmail({ ...contact, subject: "" }).params.subject).toBe(
      "New message: General inquiry"
    );
  });

  it("keeps the admin's subject and message exactly as written", () => {
    const draft = buildAdminCustomerEmail(adminMessage);
    expect(draft.params.subject).toBe("About your order");
    expect(draft.params.heading).toBe("About your order");
    expect(draft.params.message_html).toContain(
      "We&#39;ve shipped it — &lt;u&gt;track here&lt;/u&gt;."
    );
  });

  it("never says 'New Order' for non-order emails", () => {
    const nonOrderSubjects = [
      buildOrderStatusEmail({ ...order, status: "completed" }).params.subject,
      buildNewBookingOwnerEmail(booking).params.subject,
      buildNewBookingCustomerEmail(booking).params.subject,
      buildContactOwnerEmail(contact).params.subject,
      buildAdminCustomerEmail(adminMessage).params.subject,
    ];
    for (const subject of nonOrderSubjects) {
      expect(subject.toLowerCase()).not.toContain("new order");
    }
  });

  it("shows the new status in title case", () => {
    const draft = buildOrderStatusEmail({ ...order, status: "cancelled" });
    expect(draft.params.subject).toBe(
      "Status update for order HL-2026-0042: Cancelled"
    );
    expect(draft.params.message_html).toContain("<strong>New status:</strong> Cancelled");
  });
});

/* ------------------------------------------------------------------ */
/* Money                                                               */
/* ------------------------------------------------------------------ */

describe("money", () => {
  it("formats every money value with ₦ and never with $", () => {
    const html = buildNewOrderOwnerEmail(order).params.message_html;
    expect(html).toContain("₦9,000.00"); // line total: 4500 x 2
    expect(html).toContain("₦1,750.00"); // line total: clip-ins
    expect(html).toContain("₦10,750.00"); // subtotal
    expect(html).toContain("₦3,000.00"); // delivery fee
    expect(html).toContain("₦13,750.00"); // total
    expect(html).not.toContain("$");

    expect(buildNewOrderCustomerEmail(order).params.message_html).toContain(
      "₦13,750.00"
    );
    expect(
      buildOrderStatusEmail({ ...order, status: "completed" }).params.message_html
    ).toContain("₦13,750.00");
  });

  it.each(ALL_DRAFTS)("never uses a $ sign: %s", (_label, draft) => {
    expect(draft.params.message_html).not.toContain("$");
  });
});

/* ------------------------------------------------------------------ */
/* Omitted fields and HTML escaping                                    */
/* ------------------------------------------------------------------ */

describe("omitted fields", () => {
  it.each(ALL_DRAFTS)("has no empty Label: lines: %s", (_label, draft) => {
    expect(draft.params.message_html).not.toMatch(EMPTY_LABEL);
  });

  it("omits Notes when a booking has none", () => {
    const html = buildNewBookingOwnerEmail(bookingNoNotes).params.message_html;
    expect(html).not.toContain("Notes:");
    expect(html).toContain("Service:</strong> Wig Making");
  });

  it("omits Notes and shows the studio address for pickup orders", () => {
    const html = buildNewOrderOwnerEmail(pickupOrder).params.message_html;
    expect(html).not.toContain("Notes:");
    expect(html).toContain("<strong>Pickup:</strong>");
    expect(html).toContain(BUSINESS.address);
    expect(html).not.toContain("<strong>Delivery:</strong>");
  });

  it("omits empty contact fields and falls back on an empty subject", () => {
    const draft = buildContactOwnerEmail({
      name: "Jo",
      email: "jo@example.com",
      phone: "",
      subject: "",
      message: "Hello there",
    });
    expect(draft.params.message_html).not.toContain("Phone:");
    expect(draft.params.message_html).not.toContain("Subject:");
    expect(draft.params.message_html).toContain("<strong>Name:</strong> Jo");
  });
});

describe("HTML escaping", () => {
  it("escapes user input in order emails", () => {
    const html = buildNewOrderOwnerEmail(order).params.message_html;
    expect(html).toContain("Obi &lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).toContain("12 Marina Road &amp; &lt;b&gt;Avenue&lt;/b&gt;");
    expect(html).toContain("Luxury Wig &amp; &lt;em&gt;Bundle&lt;/em&gt;");
    expect(html).toContain("Leave at the gate &lt;img src=x&gt;");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
  });

  it("escapes user input in booking, contact and admin emails", () => {
    expect(buildNewBookingOwnerEmail(booking).params.message_html).toContain(
      "Zara &lt;script&gt;alert(2)&lt;/script&gt;"
    );
    expect(
      buildNewBookingCustomerEmail(booking).params.message_html
    ).toContain("First time client &lt;i&gt;(vip)&lt;/i&gt;");

    const contactHtml = buildContactOwnerEmail(contact).params.message_html;
    expect(contactHtml).toContain("Jo &lt;b&gt;Doe&lt;/b&gt;");
    expect(contactHtml).toContain("When do you ship to &lt;i&gt;Ibadan&lt;/i&gt;?");
    expect(contactHtml).not.toContain("<i>");

    const adminHtml = buildAdminCustomerEmail(adminMessage).params.message_html;
    expect(adminHtml).toContain("&lt;u&gt;track here&lt;/u&gt;");
    expect(adminHtml).not.toContain("<u>");
    expect(buildAdminCustomerEmail(adminMessage).params.heading).not.toContain("<");
  });
});

/* ------------------------------------------------------------------ */
/* Routing                                                             */
/* ------------------------------------------------------------------ */

describe("routing", () => {
  it("routes owner emails to the business and replies to the customer", () => {
    const owner = buildNewOrderOwnerEmail(order);
    expect(owner.audience).toBe("owner");
    expect(owner.params.to_email).toBe(BUSINESS.email);
    expect(owner.params.reply_to).toBe("ada@example.com");

    const bookingOwner = buildNewBookingOwnerEmail(booking);
    expect(bookingOwner.audience).toBe("owner");
    expect(bookingOwner.params.to_email).toBe(BUSINESS.email);
    expect(bookingOwner.params.reply_to).toBe("zara@example.com");

    const contactOwner = buildContactOwnerEmail(contact);
    expect(contactOwner.audience).toBe("owner");
    expect(contactOwner.params.reply_to).toBe("jo@example.com");
  });

  it("routes customer emails to the customer and replies to the business", () => {
    const confirm = buildNewOrderCustomerEmail(order);
    expect(confirm.audience).toBe("customer");
    expect(confirm.params.to_email).toBe("ada@example.com");
    expect(confirm.params.to_name).toBe("Ada Obi <script>alert(1)</script>");
    expect(confirm.params.reply_to).toBe(BUSINESS.email);

    const bookingConfirm = buildNewBookingCustomerEmail(booking);
    expect(bookingConfirm.audience).toBe("customer");
    expect(bookingConfirm.params.to_email).toBe("zara@example.com");

    const status = buildOrderStatusEmail(order);
    expect(status.audience).toBe("customer");
    expect(status.params.to_email).toBe("ada@example.com");

    const admin = buildAdminCustomerEmail(adminMessage);
    expect(admin.audience).toBe("customer");
    expect(admin.params.to_email).toBe("ada@example.com");
    expect(admin.params.to_name).toBe("Ada Obi");
  });

  it("includes the studio phone in the booking confirmation", () => {
    const html = buildNewBookingCustomerEmail(booking).params.message_html;
    expect(html).toContain(`<strong>Studio phone:</strong> ${BUSINESS.phone}`);
  });

  it("includes bank details and the transfer promise in the order confirmation", () => {
    const html = buildNewOrderCustomerEmail(order).params.message_html;
    expect(html).toContain(BUSINESS.bankDetails.bankName);
    expect(html).toContain(BUSINESS.bankDetails.accountNumber);
    expect(html).toContain("confirm your transfer");
  });

  it("shows the order date in WAT", () => {
    const html = buildNewOrderOwnerEmail(order).params.message_html;
    expect(html).toContain("Order date:");
    expect(html).toContain("2026"); // 09:00 UTC -> 10:00 WAT, same day
  });
});

/* ------------------------------------------------------------------ */
/* Sending (Promise.allSettled behaviour)                              */
/* ------------------------------------------------------------------ */

function stubFetch(
  decide: (templateId: string) => { status: number; text: string }
) {
  const mock = vi.fn(async (_url: unknown, init?: { body?: unknown }) => {
    const body = JSON.parse(String(init?.body)) as { template_id: string };
    const r = decide(body.template_id);
    return { status: r.status, text: async () => r.text };
  });
  vi.stubGlobal("fetch", mock);
  return mock;
}

describe("sending", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("sends owner + customer in parallel and reports owner success even when the customer copy fails", async () => {
    vi.resetModules();
    vi.stubEnv("EMAILJS_OWNER_TEMPLATE_ID", "tmpl-owner");
    vi.stubEnv("EMAILJS_CUSTOMER_TEMPLATE_ID", "tmpl-customer");
    const fetchMock = stubFetch((id) =>
      id === "tmpl-owner"
        ? { status: 200, text: "OK" }
        : { status: 400, text: "Template not found" }
    );
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const mod = await import("@/lib/email-server");
    const result = await mod.sendBookingEmail(booking);

    expect(fetchMock).toHaveBeenCalledTimes(2); // both copies sent in parallel
    expect(result.ok).toBe(true); // owner succeeded -> UI success
    const logged = errorSpy.mock.calls
      .map((c) => c.map(String).join(" "))
      .join("\n");
    expect(logged).toContain("customer email failed");
    expect(logged).toContain("booking BK-2026-0009");
    expect(logged).toContain("status 400");
    expect(logged).toContain("Template not found");
  });

  it("fails the reported result when the owner copy fails", async () => {
    vi.resetModules();
    vi.stubEnv("EMAILJS_OWNER_TEMPLATE_ID", "tmpl-owner");
    vi.stubEnv("EMAILJS_CUSTOMER_TEMPLATE_ID", "tmpl-customer");
    stubFetch((id) =>
      id === "tmpl-owner"
        ? { status: 401, text: "Unauthorized" }
        : { status: 200, text: "OK" }
    );
    vi.spyOn(console, "error").mockImplementation(() => {});

    const mod = await import("@/lib/email-server");
    const result = await mod.sendOrderEmail(order);
    expect(result.ok).toBe(false);
  });

  it("skips the customer copy (and logs why) when EMAILJS_CUSTOMER_TEMPLATE_ID is unset", async () => {
    vi.resetModules();
    vi.stubEnv("EMAILJS_OWNER_TEMPLATE_ID", "tmpl-owner");
    vi.stubEnv("EMAILJS_CUSTOMER_TEMPLATE_ID", "");
    const fetchMock = stubFetch(() => ({ status: 200, text: "OK" }));
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const mod = await import("@/lib/email-server");
    const result = await mod.sendOrderEmail(order);

    expect(result.ok).toBe(true); // owner copy still decides success
    expect(fetchMock).toHaveBeenCalledTimes(1); // owner only, customer skipped
    expect(
      warnSpy.mock.calls.map((c) => c.map(String).join(" ")).join("\n")
    ).toContain("EMAILJS_CUSTOMER_TEMPLATE_ID");
    expect(
      errorSpy.mock.calls.map((c) => c.map(String).join(" ")).join("\n")
    ).toContain("customer email failed");
  });

  it("falls back to the legacy template for the owner when EMAILJS_OWNER_TEMPLATE_ID is unset", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_EMAILJS_TEMPLATE_ID", "legacy-template");
    vi.stubEnv("EMAILJS_OWNER_TEMPLATE_ID", "");
    const fetchMock = stubFetch(() => ({ status: 200, text: "OK" }));
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    const mod = await import("@/lib/email-server");
    const result = await mod.sendContactEmail(contact);

    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(
      String(fetchMock.mock.calls[0][1]?.body)
    ) as { template_id: string; template_params: Record<string, string> };
    expect(body.template_id).toBe("legacy-template");
    expect(body.template_params.subject).toBe("New message: Delivery question");
    expect(body.template_params.to_email).toBe(BUSINESS.email);
  });
});
