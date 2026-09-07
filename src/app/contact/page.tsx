"use client";

import { useState } from "react";
import { BUSINESS } from "@/lib/config";
import { sendContactEmail } from "@/lib/email/sendOrderEmail";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendError("");
    const result = await sendContactEmail({
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
    });
    setSending(false);
    if (result.ok) {
      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    } else {
      setSendError(
        result.status
          ? `Email failed (error ${result.status}). Please call us at ${BUSINESS.phone} instead.`
          : `Could not reach our server. Please call us at ${BUSINESS.phone}.`
      );
    }
  };

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">
            We&apos;re Here to Help
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted max-w-2xl mx-auto">
            Questions about a service, an order or an appointment? Reach out - we respond
            within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[
              {
                title: "Visit Our Studio",
                value: BUSINESS.address,
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
                title: "Call Us",
                value: BUSINESS.phone,
                icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                ),
              },
              {
                title: "Email Us",
                value: BUSINESS.email,
                icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                ),
              },
              {
                title: "Order Payments",
                value: `Interac e-Transfer to ${BUSINESS.interacEmail}`,
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
                className="flex items-start gap-4 rounded-2xl bg-surface border border-surface-light p-5 hover:border-gold/40 transition-colors"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold/10 text-gold shrink-0">
                  {c.icon}
                </span>
                <div>
                  <p className="font-semibold text-sm mb-0.5">{c.title}</p>
                  <p className="text-sm text-muted break-all">{c.value}</p>
                </div>
              </div>
            ))}

            <div className="rounded-2xl bg-surface border border-surface-light p-5">
              <p className="font-semibold text-sm mb-2">Opening Hours</p>
              <p className="text-sm text-muted">{BUSINESS.hours}</p>
              <p className="text-sm text-muted mt-1">Sunday: Closed</p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-surface border border-surface-light p-6 sm:p-8"
            >
              <h2 className="font-serif text-xl font-bold mb-6">Send Us a Message</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <label className="block">
                  <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
                    Your Name *
                  </span>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none"
                    placeholder="Jane Smith"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
                    Phone Number
                  </span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none"
                    placeholder="(647) 555-0123"
                  />
                </label>
              </div>
              <label className="block mb-4">
                <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
                  Email *
                </span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none"
                  placeholder="jane@email.com"
                />
              </label>
              <label className="block mb-4">
                <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
                  Subject
                </span>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none appearance-none"
                >
                  <option value="">Select a topic</option>
                  <option>Order Inquiry</option>
                  <option>Booking Appointment</option>
                  <option>Product Question</option>
                  <option>Payment / e-Transfer</option>
                  <option>Delivery / Pickup</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="block mb-6">
                <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
                  Message *
                </span>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-lg bg-surface-light border border-surface-light px-4 py-3 text-sm focus:border-gold focus:outline-none min-h-[140px] resize-none"
                  placeholder="How can we help?"
                />
              </label>

              {sent && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-400 mb-4">
                  Message sent! We&apos;ll get back to you within 24 hours.
                </div>
              )}
              {sendError && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400 mb-4">
                  {sendError}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full h-12 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}