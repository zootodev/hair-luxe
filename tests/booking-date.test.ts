import { describe, expect, it } from "vitest";
import {
  formatBookingDate,
  formatBookingDateShort,
  isPastBookingDate,
  isValidIsoDate,
  lagosTodayIso,
} from "@/lib/booking-date";

describe("booking dates in Africa/Lagos", () => {
  // 23:30 UTC on 17 November is already 00:30 on 18 November in Lagos.
  const lateUtc = new Date("2026-11-17T23:30:00.000Z");

  it("uses today's Lagos calendar date, not the local/UTC date", () => {
    expect(lagosTodayIso(lateUtc)).toBe("2026-11-18");
  });

  it("blocks yesterday and earlier, but allows today", () => {
    expect(isPastBookingDate("2026-11-17", lateUtc)).toBe(true);
    expect(isPastBookingDate("2026-11-16", lateUtc)).toBe(true);
    expect(isPastBookingDate("2026-11-18", lateUtc)).toBe(false);
    expect(isPastBookingDate("2026-11-19", lateUtc)).toBe(false);
  });

  it("shows a dd/mm/yyyy date and a written date", () => {
    expect(formatBookingDateShort("2026-11-18")).toBe("18/11/2026");
    expect(formatBookingDate("2026-11-18")).toContain("18 November 2026");
  });

  it("rejects impossible calendar dates", () => {
    expect(isValidIsoDate("2026-02-31")).toBe(false);
    expect(isValidIsoDate("not-a-date")).toBe(false);
  });
});
