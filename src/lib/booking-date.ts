/**
 * Booking dates are calendar dates in Lagos (Africa/Lagos, UTC+1 all year).
 * Keeping the conversion here means the form and the API agree even when the
 * browser or server is in another timezone.
 */

export const LAGOS_TIME_ZONE = "Africa/Lagos";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Today's calendar date in Lagos as YYYY-MM-DD. */
export function lagosTodayIso(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: LAGOS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** True for a valid calendar date before today in Lagos. */
export function isPastBookingDate(value: string, now: Date = new Date()): boolean {
  if (!isValidIsoDate(value)) return false;
  return value < lagosTodayIso(now);
}

/** dd/mm/yyyy, as requested for the booking form. */
export function formatBookingDateShort(value: string): string {
  if (!isValidIsoDate(value)) return value;
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

/** Written date used on confirmation screens, e.g. "Wednesday, 18 November 2026". */
export function formatBookingDate(value: string): string {
  if (!isValidIsoDate(value)) return value;
  return new Intl.DateTimeFormat("en-NG", {
    timeZone: LAGOS_TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00+01:00`));
}
