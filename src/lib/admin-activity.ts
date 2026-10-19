/**
 * Helpers for the admin dashboard tab counts, "new since last seen" badges
 * and the Upcoming Bookings stat. Kept pure so they can be unit tested.
 */

/** localStorage keys for the admin "last seen" timestamps. */
export const LAST_SEEN_KEYS = {
  orders: "hair-luxe-admin:lastSeenOrdersAt",
  bookings: "hair-luxe-admin:lastSeenBookingsAt",
} as const;

/** Local calendar date as YYYY-MM-DD (same format as Booking.date). */
export function localTodayIso(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Epoch ms for an ISO timestamp, or null when missing/invalid (old records). */
export function parseTimestamp(value: string | null | undefined): number | null {
  const raw = (value ?? "").trim();
  if (!raw) return null;
  const ms = Date.parse(raw);
  return Number.isFinite(ms) ? ms : null;
}

/**
 * Count records created strictly after `lastSeenMs` (epoch ms).
 *
 * - Null / 0 / invalid `lastSeenMs` (tab never opened) counts zero, so the
 *   first visit isn't flooded with badges.
 * - Records with a missing or unparseable timestamp are never counted — the
 *   safe fallback for old records saved before `dateCreated` existed.
 */
export function countNewSinceLastSeen(
  timestamps: readonly (string | null | undefined)[],
  lastSeenMs: number | null | undefined
): number {
  if (lastSeenMs == null || !Number.isFinite(lastSeenMs) || lastSeenMs <= 0) return 0;
  let count = 0;
  for (const raw of timestamps) {
    const ms = parseTimestamp(raw);
    if (ms !== null && ms > lastSeenMs) count += 1;
  }
  return count;
}

/**
 * Bookings dated today or later. `Booking.date` is a plain YYYY-MM-DD string,
 * so lexicographic order matches chronological order once validated.
 */
export function countUpcomingBookings(
  bookings: readonly { date?: string | null }[],
  todayIso: string = localTodayIso()
): number {
  return bookings.filter(
    (b) => typeof b.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(b.date) && b.date >= todayIso
  ).length;
}
