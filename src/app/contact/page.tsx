"use client";

import { useState } from "react";
import { useCart } from "@/lib/context/CartContext";

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function ContactPage() {
  const { business } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setSendError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "Required";
    if (!EMAIL_PATTERN.test(form.email.trim())) nextErrors.email = "Enter a valid email";
    if (!form.subject.trim()) nextErrors.subject = "Select a topic";
    if (!form.message.trim()) nextErrors.message = "Required";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSendError("");
      return;
    }
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
          website: form.website,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;
      if (res.ok && data?.ok !== false) {
        setSent(true);
        setForm({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
        setTimeout(() => setSent(false), 5000);
      } else {
        setSendError(
          res.status === 429
            ? "Too many messages sent. Please wait a moment and try again."
            : data?.error || `We could not send your message. Please call us at ${business.phone}.`
        );
      }
    } catch {
      setSendError(`Cannot reach the server. Please call us at ${business.phone}.`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand text-xs font-medium mb-3">
            Questions or bookings?
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Contact us</h1>
          <p className="text-muted max-w-2xl mx-auto">
            Questions about a service, an order or an appointment? Reach out - we respond
            within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[
              {
                title: "Visit the studio",
                value: business.address,
                icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
              },
              {
                title: "Call us",
                value: business.phone,
                icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                ),
              },
              {
                title: "Email us",
                value: business.email,
                icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                ),
              },
              {
                title: "Order payments",
                value: `Bank transfer to ${business.bankDetails.bankName}, account ${business.bankDetails.accountNumber}`,
                icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
              },
            ].map((c) => (
              <div
                key={c.title}
                className="flex items-start gap-4 rounded-md bg-surface border border-surface-light p-5 hover:border-brand/40 transition-colors"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-md bg-brand/10 text-brand shrink-0">
                  {c.icon}
                </span>
                <div>
                  <p className="font-semibold text-sm mb-0.5">{c.title}</p>
                  <p className="text-sm text-muted break-all">{c.value}</p>
                </div>
              </div>
            ))}

            <div className="rounded-md bg-surface border border-surface-light p-5">
              <p className="font-semibold text-sm mb-2">Opening hours</p>
              <p className="text-sm text-muted">{business.hours}</p>
              <p className="text-sm text-muted mt-1">Sunday: closed</p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-md bg-surface border border-surface-light p-6 sm:p-8"
            >
              <h2 className="font-display text-xl font-bold mb-1">Send us a message</h2>
              <p className="text-xs text-muted mb-6">
                <span className="text-brand" aria-hidden="true">
                  *
                </span>{" "}
                required
              </p>
              <div aria-hidden="true" className="hidden">
                <label>
                  Leave this field empty
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => updateField("website", e.target.value)}
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <label className="block">
                  <span className="text-xs text-muted mb-1.5 block">
                    Name *
                  </span>
                  <input
                    type="text"
                    required
                    aria-required="true"
                    aria-invalid={!!fieldErrors.name}
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={`w-full h-11 rounded-lg bg-surface-light border px-4 text-sm focus:outline-none ${
                      fieldErrors.name ? "border-danger" : "border-surface-light focus:border-brand"
                    }`}
                    placeholder="Jane Smith"
                  />
                  {fieldErrors.name && (
                    <p className="text-xs text-danger mt-1">{fieldErrors.name}</p>
                  )}
                </label>
                <label className="block">
                  <span className="text-xs text-muted mb-1.5 block">
                    Phone number
                  </span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-brand focus:outline-none"
                    placeholder="+234 800 000 0000"
                  />
                </label>
              </div>
              <label className="block mb-4">
                <span className="text-xs text-muted mb-1.5 block">
                  Email *
                </span>
                <input
                  type="email"
                  required
                  aria-required="true"
                  aria-invalid={!!fieldErrors.email}
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={`w-full h-11 rounded-lg bg-surface-light border px-4 text-sm focus:outline-none ${
                    fieldErrors.email ? "border-danger" : "border-surface-light focus:border-brand"
                  }`}
                  placeholder="jane@email.com"
                />
                {fieldErrors.email && (
                  <p className="text-xs text-danger mt-1">{fieldErrors.email}</p>
                )}
              </label>
              <label className="block mb-4">
                <span className="text-xs text-muted mb-1.5 block">
                  Subject *
                </span>
                <select
                  required
                  aria-required="true"
                  aria-invalid={!!fieldErrors.subject}
                  value={form.subject}
                  onChange={(e) => updateField("subject", e.target.value)}
                  className={`w-full h-11 rounded-lg bg-surface-light border px-4 text-sm focus:outline-none appearance-none ${
                    fieldErrors.subject ? "border-danger" : "border-surface-light focus:border-brand"
                  }`}
                >
                  <option value="" disabled>
                    Select a topic
                  </option>
                  <option>Order enquiry</option>
                  <option>Booking appointment</option>
                  <option>Product question</option>
                  <option>Payment / Bank transfer</option>
                  <option>Delivery / Pickup</option>
                  <option>Other</option>
                </select>
                {fieldErrors.subject && (
                  <p className="text-xs text-danger mt-1">{fieldErrors.subject}</p>
                )}
              </label>
              <label className="block mb-6">
                <span className="text-xs text-muted mb-1.5 block">
                  Message *
                </span>
                <textarea
                  required
                  aria-required="true"
                  aria-invalid={!!fieldErrors.message}
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  className={`w-full rounded-lg bg-surface-light border px-4 py-3 text-sm focus:outline-none min-h-[140px] resize-none ${
                    fieldErrors.message ? "border-danger" : "border-surface-light focus:border-brand"
                  }`}
                  placeholder="How can we help?"
                />
                {fieldErrors.message && (
                  <p className="text-xs text-danger mt-1">{fieldErrors.message}</p>
                )}
              </label>

              {sent && (
                <div className="rounded-md bg-success-soft border border-success/30 px-4 py-3 text-sm text-success mb-4">
                  Message sent! We&apos;ll get back to you within 24 hours.
                </div>
              )}
              {sendError && (
                <div className="rounded-md bg-danger-soft border border-danger/30 px-4 py-3 text-sm text-danger mb-4">
                  {sendError}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full h-12 rounded-md bg-brand text-background font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {sending ? "Sending..." : "Send message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}