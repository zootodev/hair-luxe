"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { generateBookingId, saveBooking } from "@/lib/orders";
import { BUSINESS } from "@/lib/config";
import { formatIntlPhone, formatNigerianPhone, plainRange } from "@/lib/format";
import type { Booking, Service } from "@/lib/types";

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

interface BookingModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ service, isOpen, onClose }: BookingModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
    website: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const close = () => {
    onClose();
    setForm({ name: "", email: "", phone: "", date: "", time: "", notes: "", website: "" });
    setSuccess(null);
    setError("");
    setPhoneError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Always stored as a normalised string (+234XXXXXXXXXX).
    const phone = formatNigerianPhone(form.phone);
    if (!phone) {
      setPhoneError("Enter a valid Nigerian phone number, e.g. 08123456789");
      return;
    }
    setPhoneError("");

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const selected = new Date(form.date);
    if (selected < minDate) {
      setError("Please select a date at least 1 day from today.");
      return;
    }

    setSubmitting(true);
    setError("");

    const payload = {
      name: form.name,
      email: form.email,
      phone,
      service: service.name,
      date: form.date,
      time: form.time,
      notes: form.notes,
      website: form.website,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as {
        booking?: Booking;
        error?: string;
        emailOk?: boolean;
      } | null;

      if (res.ok && data?.booking) {
        setSubmitting(false);
        setSuccess(data.booking);
        setForm({ name: "", email: "", phone: "", date: "", time: "", notes: "", website: "" });
        if (!data.emailOk) {
          console.error("Booking saved, but the notification email could not be sent.");
        }
        return;
      }
      setSubmitting(false);
      setError(
        res.status === 429
          ? data?.error ?? "Too many booking attempts. Please try again shortly."
          : data?.error ?? "Your booking could not be saved. Please try again."
      );
      return;
    } catch {
      // Server unreachable - fall through to local-only save.
    }

    const booking: Booking = {
      id: generateBookingId(),
      name: form.name,
      email: form.email,
      phone,
      service: service.name,
      date: form.date,
      time: form.time,
      notes: form.notes,
      dateCreated: new Date().toISOString(),
    };

    try {
      saveBooking(booking);
    } catch {
      console.error("Failed to save booking locally");
    }
    setSubmitting(false);
    setSuccess(booking);
    setForm({ name: "", email: "", phone: "", date: "", time: "", notes: "", website: "" });
    console.warn("Booking saved locally only; server persistence is not available.");
  };

  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 1);

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title={success ? "Booking confirmed" : `Book ${service.name}`}
    >
      {success ? (
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-md bg-brand/15 text-brand mb-4">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">We&apos;ve received your booking</h3>
          <p className="text-muted text-sm mb-4">
            Reference: <span className="text-brand font-semibold">{success.id}</span>
          </p>
          <div className="rounded-md bg-surface-light/50 p-4 text-left text-sm space-y-2 mb-5">
            <p>
              <span className="text-muted">Service:</span>{" "}
              <span className="font-semibold">{success.service}</span>
            </p>
            <p>
              <span className="text-muted">Date:</span>{" "}
              <span className="font-semibold">
                {new Date(success.date + "T00:00:00").toLocaleDateString("en-NG", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </p>
            <p>
              <span className="text-muted">Time:</span>{" "}
              <span className="font-semibold">{success.time}</span>
            </p>
            <p>
              <span className="text-muted">Phone:</span>{" "}
              <span className="font-semibold">{formatIntlPhone(success.phone)}</span>
            </p>
            <p>
              <span className="text-muted">Email:</span>{" "}
              <span className="font-semibold break-all">{success.email}</span>
            </p>
          </div>
          <p className="text-xs text-muted mb-2">
            We&apos;ll contact you on{" "}
            <span className="text-brand">{formatIntlPhone(success.phone)}</span> or{" "}
            <span className="text-brand break-all">{success.email}</span> to confirm your
            appointment.
          </p>
          <p className="text-xs text-muted mb-6">
            Questions? Call us on <span className="text-brand">{BUSINESS.phone}</span>.
          </p>
          <button
            onClick={close}
            className="w-full h-11 rounded-md bg-brand text-background text-sm font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div aria-hidden="true" className="hidden">
            <label>
              Leave this field empty
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </label>
          </div>
          <div>
            <p className="text-base font-semibold mb-1">{service.name}</p>
            <p className="text-sm text-brand price tabular">
              {plainRange(service.priceRange)} &middot; {plainRange(service.duration)}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs text-muted mb-1.5 block">
                Full name *
              </span>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-brand focus:outline-none"
                placeholder="Jane Smith"
              />
            </label>
            <label className="block">
              <span className="text-xs text-muted mb-1.5 block">
                Phone number *
              </span>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => {
                  setPhoneError("");
                  setForm({ ...form, phone: e.target.value });
                }}
                aria-invalid={!!phoneError}
                className={`w-full h-11 rounded-lg bg-surface-light border px-4 text-sm focus:outline-none ${
                  phoneError ? "border-danger" : "border-surface-light focus:border-brand"
                }`}
                placeholder="+234 812 345 6789"
              />
              {phoneError && (
                <p className="text-xs text-danger mt-1">{phoneError}</p>
              )}
            </label>
          </div>
          <label className="block">
            <span className="text-xs text-muted mb-1.5 block">
              Email *
            </span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-brand focus:outline-none"
              placeholder="jane@email.com"
            />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs text-muted mb-1.5 block">
                Preferred date *
              </span>
              <input
                type="date"
                required
                min={minDate.toISOString().split("T")[0]}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-brand focus:outline-none [color-scheme:dark]"
              />
            </label>
            <label className="block">
              <span className="text-xs text-muted mb-1.5 block">
                Preferred time *
              </span>
              <select
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-brand focus:outline-none appearance-none"
              >
                <option value="" disabled>
                  Select time
                </option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-xs text-muted mb-1.5 block">
              Notes (optional)
            </span>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-lg bg-surface-light border border-surface-light px-4 py-3 text-sm focus:border-brand focus:outline-none min-h-[80px] resize-none"
              placeholder="Anything we should know?"
            />
          </label>
          {error && (
            <p className="text-sm text-danger bg-danger-soft border border-danger/30 rounded-lg px-4 py-3">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-md bg-brand text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Booking..." : "Confirm booking"}
          </button>
        </form>
      )}
    </Modal>
  );
}