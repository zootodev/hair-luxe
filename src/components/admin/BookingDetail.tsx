"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatIntlPhone, telHref } from "@/lib/format";
import { adminFetch } from "@/lib/admin-fetch";
import {
  BOOKING_STATUSES,
  BOOKING_STATUS_META,
  bookingStatus,
  bookingStatusLabel,
  isPastBooking,
} from "@/lib/booking-status";
import { localTodayIso } from "@/lib/admin-activity";
import type { Booking, BookingStatus } from "@/lib/types";
import Toast from "@/components/ui/Toast";

export default function BookingDetail({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [status, setStatus] = useState<BookingStatus>(bookingStatus(booking));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(
    null
  );
  const past = isPastBooking(booking, localTodayIso());

  const changeStatus = async (next: BookingStatus) => {
    const previous = status;
    setStatus(next);
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/bookings/${encodeURIComponent(booking.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        setStatus(previous);
        setToast({ message: err.error ?? "Failed to update status.", variant: "error" });
        if (res.status === 401) router.push("/admin/login");
        return;
      }
      setToast({
        message: `Status updated to ${BOOKING_STATUS_META[next].label}.`,
        variant: "success",
      });
    } catch {
      setStatus(previous);
      setToast({ message: "Network error. Please try again.", variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link
        href="/admin/bookings"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-brand mb-4"
      >
        &larr; Back to bookings
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-brand text-xs font-medium mb-1">Booking detail</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">{booking.service}</h1>
          <p className="text-xs text-muted mt-1">
            {booking.id} &middot; booked {new Date(booking.dateCreated).toLocaleString("en-CA")}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-3 py-1 rounded-md text-xs font-semibold border ${BOOKING_STATUS_META[status].badge}`}
          >
            {bookingStatusLabel({ status })}
          </span>
          {past && (
            <span className="px-3 py-1 rounded-md text-xs font-semibold border border-surface-light bg-surface-light text-muted">
              Past
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-md bg-surface border border-surface-light p-5">
          <h2 className="font-display text-lg text-brand mb-4">Customer</h2>
          <div className="space-y-3 text-sm">
            <p className="flex justify-between gap-3">
              <span className="text-muted">Name</span>
              <span className="font-medium text-right">{booking.name}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span className="text-muted">Email</span>
              <a
                href={`mailto:${booking.email}`}
                className="font-medium text-brand hover:underline break-all text-right"
              >
                {booking.email}
              </a>
            </p>
            <p className="flex justify-between gap-3">
              <span className="text-muted">Phone</span>
              <a
                href={`tel:${telHref(booking.phone)}`}
                className="font-medium text-brand hover:underline"
              >
                {formatIntlPhone(booking.phone)}
              </a>
            </p>
          </div>
        </section>

        <section className="rounded-md bg-surface border border-surface-light p-5">
          <h2 className="font-display text-lg text-brand mb-4">Appointment</h2>
          <div className="space-y-3 text-sm">
            <p className="flex justify-between gap-3">
              <span className="text-muted">Service</span>
              <span className="font-medium text-right">{booking.service}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span className="text-muted">Date</span>
              <span className="font-medium">
                {new Date(booking.date + "T00:00:00").toLocaleDateString("en-CA", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </p>
            <p className="flex justify-between gap-3">
              <span className="text-muted">Time</span>
              <span className="font-medium">{booking.time}</span>
            </p>
            {booking.notes && (
              <p className="flex justify-between gap-3">
                <span className="text-muted">Notes</span>
                <span className="font-medium text-right">{booking.notes}</span>
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-md bg-surface border border-surface-light p-5 mt-5">
        <h2 className="font-display text-lg text-brand mb-4">Status</h2>
        <div className="flex flex-wrap gap-2">
          {BOOKING_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => s !== status && changeStatus(s)}
              disabled={saving}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer ${
                s === status
                  ? "bg-brand text-background"
                  : "bg-surface-light text-muted hover:text-brand"
              }`}
            >
              {BOOKING_STATUS_META[s].label}
            </button>
          ))}
        </div>
      </section>

      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onDismiss={() => setToast(null)}
          duration={4000}
        />
      )}
    </div>
  );
}
