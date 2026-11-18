import type { Booking, BookingStatus } from "@/lib/types";
import { localTodayIso } from "@/lib/admin-activity";

/**
 * Booking status helpers shared by the admin list, the detail view and tests.
 *
 * Old bookings were stored before the status field existed. They have no
 * status and are treated as "pending" everywhere.
 */

export const BOOKING_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "no-show",
];

export interface BookingStatusMeta {
  label: string;
  badge: string;
}

export const BOOKING_STATUS_META: Record<BookingStatus, BookingStatusMeta> = {
  pending: {
    label: "Pending",
    badge: "bg-warning-soft text-warning border-warning/30",
  },
  confirmed: {
    label: "Confirmed",
    badge: "bg-brand/10 text-brand border-brand/30",
  },
  completed: {
    label: "Completed",
    badge: "bg-success-soft text-success border-success/30",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-danger-soft text-danger border-danger/30",
  },
  "no-show": {
    label: "No-show",
    badge: "bg-surface-light text-muted border-surface-light",
  },
};

export const BOOKING_FILTERS = ["all", "past", ...BOOKING_STATUSES] as const;
export type BookingFilter = (typeof BOOKING_FILTERS)[number];

/** Status stored on a booking, defaulting old records to "pending". */
export function bookingStatus(booking: Pick<Booking, "status">): BookingStatus {
  const status = booking.status;
  return status && BOOKING_STATUSES.includes(status) ? status : "pending";
}

export function bookingStatusLabel(booking: Pick<Booking, "status">): string {
  return BOOKING_STATUS_META[bookingStatus(booking)].label;
}

/** A booking is "past" when its appointment date is before today. */
export function isPastBooking(
  booking: Pick<Booking, "date">,
  todayIso: string = localTodayIso()
): boolean {
  return (
    typeof booking.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(booking.date) &&
    booking.date < todayIso
  );
}

export function matchesBookingFilter(
  booking: Pick<Booking, "status" | "date">,
  filter: BookingFilter,
  todayIso: string = localTodayIso()
): boolean {
  if (filter === "all") return true;
  if (filter === "past") return isPastBooking(booking, todayIso);
  return bookingStatus(booking) === filter;
}

export function countPastBookings(
  bookings: readonly Pick<Booking, "date">[],
  todayIso: string = localTodayIso()
): number {
  return bookings.filter((b) => isPastBooking(b, todayIso)).length;
}
