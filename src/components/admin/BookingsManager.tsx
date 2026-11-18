"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatIntlPhone, telHref } from "@/lib/format";
import { adminFetch } from "@/lib/admin-fetch";
import {
  BOOKING_FILTERS,
  BOOKING_STATUSES,
  BOOKING_STATUS_META,
  bookingStatus,
  bookingStatusLabel,
  matchesBookingFilter,
  type BookingFilter,
} from "@/lib/booking-status";
import { localTodayIso } from "@/lib/admin-activity";
import type { Booking, BookingStatus } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";

export default function BookingsManager() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<BookingFilter>("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Booking | null>(null);
  const [emailTarget, setEmailTarget] = useState<{
    id: string;
    customerName: string;
    email: string;
  } | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(
    null
  );

  const today = useMemo(() => localTodayIso(), []);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { bookings: Booking[] };
      setBookings(data.bookings);
      setError("");
    } catch {
      setError("Could not load bookings.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  /* eslint-disable react-hooks/set-state-in-effect -- data fetch (all setState calls are post-await) */
  useEffect(() => {
    load();
  }, [load]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const filtered = useMemo(
    () => bookings.filter((b) => matchesBookingFilter(b, filter, today)),
    [bookings, filter, today]
  );

  const changeStatus = async (booking: Booking, status: BookingStatus) => {
    setSavingId(booking.id);
    try {
      const res = await adminFetch(`/api/admin/bookings/${encodeURIComponent(booking.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        setToast({ message: err.error ?? "Failed to update status.", variant: "error" });
        if (res.status === 401) router.push("/admin/login");
        return;
      }
      setBookings((prev) =>
        prev.map((b) => (b.id === booking.id ? { ...b, status } : b))
      );
      setToast({
        message: `Booking ${booking.id} set to ${BOOKING_STATUS_META[status].label}.`,
        variant: "success",
      });
    } catch {
      setToast({ message: "Network error. Please try again.", variant: "error" });
    } finally {
      setSavingId(null);
    }
  };

  const deleteBooking = async (booking: Booking) => {
    setPendingDelete(null);
    try {
      const res = await adminFetch(`/api/admin/bookings/${encodeURIComponent(booking.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        setToast({ message: err.error ?? "Failed to delete booking.", variant: "error" });
        if (res.status === 401) router.push("/admin/login");
        return;
      }
      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
      setToast({ message: `Booking ${booking.id} deleted.`, variant: "success" });
    } catch {
      setToast({ message: "Network error. Please try again.", variant: "error" });
    }
  };

  const sendCustomerEmail = async () => {
    if (!emailTarget) return;
    if (!emailSubject.trim() || !emailMessage.trim()) {
      setEmailError("Subject and message are required.");
      return;
    }
    setEmailSending(true);
    setEmailError("");
    const targetName = emailTarget.customerName;
    try {
      const res = await adminFetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: emailTarget.id,
          subject: emailSubject,
          message: emailMessage,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        setEmailError(err.error ?? "Failed to send email. Please try again.");
        return;
      }
      setEmailSubject("");
      setEmailMessage("");
      setEmailTarget(null);
      setToast({ message: `Email sent to ${targetName}.`, variant: "success" });
    } catch {
      setEmailError("Network error. Please try again.");
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-brand text-xs font-medium mb-1">Admin area</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Bookings</h1>
        <p className="text-xs text-muted mt-1">
          Change a booking&apos;s status or open its detail view. Old bookings without a status
          show as Pending.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-danger-soft border border-danger/30 p-4 mb-5 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5">
        {BOOKING_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              filter === f
                ? "bg-brand text-background"
                : "bg-surface border border-surface-light text-muted hover:text-brand"
            }`}
          >
            {f === "all"
              ? "All"
              : f === "past"
                ? "Past"
                : BOOKING_STATUS_META[f].label}
          </button>
        ))}
      </div>

      {loading && <p className="text-muted py-10 text-center">Loading bookings...</p>}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 rounded-md bg-surface border border-surface-light">
          <p className="text-muted">
            {bookings.length === 0 ? "No service bookings yet." : "No bookings match this filter."}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((booking) => {
            const status = bookingStatus(booking);
            const past = matchesBookingFilter(booking, "past", today);
            return (
              <div
                key={booking.id}
                className="rounded-md bg-surface border border-surface-light p-5 flex flex-col lg:flex-row lg:items-center gap-4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-brand/10 text-brand shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{booking.service}</p>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${BOOKING_STATUS_META[status].badge}`}
                      >
                        {bookingStatusLabel(booking)}
                      </span>
                      {past && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold border border-surface-light bg-surface-light text-muted">
                          Past
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-0.5 truncate">
                      {booking.name} &middot;{" "}
                      <a
                        href={`tel:${telHref(booking.phone)}`}
                        className="text-brand hover:underline"
                      >
                        {formatIntlPhone(booking.phone)}
                      </a>
                    </p>
                    <p className="text-xs text-muted mt-0.5 truncate">{booking.email}</p>
                  </div>
                </div>

                <div className="text-sm text-muted shrink-0">
                  {new Date(booking.date + "T00:00:00").toLocaleDateString("en-CA", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  at {booking.time}
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <select
                    aria-label={`Status for booking ${booking.id}`}
                    value={status}
                    disabled={savingId === booking.id}
                    onChange={(e) => changeStatus(booking, e.target.value as BookingStatus)}
                    className="h-9 rounded-md bg-background border border-surface-light px-2 text-xs focus:border-brand focus:outline-none disabled:opacity-50"
                  >
                    {BOOKING_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {BOOKING_STATUS_META[s].label}
                      </option>
                    ))}
                  </select>
                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="px-3 py-1.5 rounded-md text-xs font-semibold bg-surface-light text-muted hover:text-brand transition-colors"
                  >
                    View details
                  </Link>
                  <button
                    onClick={() => {
                      setEmailError("");
                      setEmailSubject(`Regarding your ${booking.service} booking`);
                      setEmailMessage("");
                      setEmailTarget({
                        id: booking.id,
                        customerName: booking.name,
                        email: booking.email,
                      });
                    }}
                    className="px-3 py-1.5 rounded-md text-xs font-medium text-brand hover:bg-brand/10 border border-brand/30 transition-colors cursor-pointer"
                  >
                    Email
                  </button>
                  <button
                    onClick={() => setPendingDelete(booking)}
                    className="px-3 py-1.5 rounded-md text-xs font-semibold text-danger hover:bg-danger-soft border border-danger/30 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {emailTarget && (
        <div className="fixed inset-0 z-[60] bg-scrim flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-md bg-surface border border-surface-light p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold">
                Email {emailTarget.customerName}
                <span className="block text-xs text-muted font-normal mt-0.5">
                  Booking {emailTarget.id}
                </span>
              </h3>
              <button
                onClick={() => setEmailTarget(null)}
                className="text-muted hover:text-brand p-1 cursor-pointer"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {emailError && (
              <div className="rounded-md bg-danger-soft border border-danger/30 p-3 mb-4 text-sm text-danger">
                {emailError}
              </div>
            )}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-background border border-surface-light px-3 h-9">
                <span className="text-xs text-muted">To:</span>
                <span className="text-sm font-medium break-all text-right">{emailTarget.email}</span>
              </div>
              <label className="block">
                <span className="block text-xs text-muted mb-1">Subject</span>
                <input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full h-9 rounded-lg bg-background border border-surface-light px-3 text-sm focus:border-brand focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="block text-xs text-muted mb-1">Message</span>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={5}
                  className="w-full rounded-lg bg-background border border-surface-light px-3 py-2 text-sm focus:border-brand focus:outline-none resize-y"
                />
              </label>
            </div>
            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setEmailTarget(null)}
                className="px-4 py-2 rounded-md text-sm font-semibold bg-surface-light text-muted hover:text-brand transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={sendCustomerEmail}
                disabled={emailSending}
                className="px-4 py-2 rounded-md text-sm font-semibold bg-brand text-background hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
              >
                {emailSending ? "Sending..." : "Send email"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Delete booking?"
      >
        {pendingDelete && (
          <>
            <p className="text-sm text-muted mb-6">
              Booking <span className="text-foreground font-semibold">{pendingDelete.id}</span>{" "}
              &mdash; {pendingDelete.service} for{" "}
              <span className="text-foreground font-semibold">{pendingDelete.name}</span> will be
              permanently removed. This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPendingDelete(null)}
                className="px-4 h-10 rounded-md text-sm font-semibold bg-surface-light text-muted hover:text-brand transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteBooking(pendingDelete)}
                className="px-4 h-10 rounded-md text-sm font-semibold text-background bg-danger transition-colors cursor-pointer"
              >
                Delete booking
              </button>
            </div>
          </>
        )}
      </Modal>

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
