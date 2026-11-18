import { describe, expect, it } from "vitest";
import {
  bookingStatus,
  countPastBookings,
  isPastBooking,
  matchesBookingFilter,
} from "@/lib/booking-status";
import type { Booking } from "@/lib/types";

const TODAY = "2026-11-18";

function booking(overrides: Partial<Booking> = {}): Booking {
  return {
    id: "BK-2026-0001",
    name: "Ada",
    email: "ada@example.com",
    phone: "+2348123456789",
    service: "Hair revamping",
    date: "2026-11-20",
    time: "10:00 AM",
    dateCreated: "2026-11-01T10:00:00.000Z",
    ...overrides,
  };
}

describe("bookingStatus", () => {
  it("defaults old bookings with no status to pending", () => {
    expect(bookingStatus(booking())).toBe("pending");
    expect(bookingStatus(booking({ status: undefined }))).toBe("pending");
  });

  it("keeps a stored status", () => {
    expect(bookingStatus(booking({ status: "confirmed" }))).toBe("confirmed");
  });
});

describe("booking filter", () => {
  it("matches old (statusless) bookings under Pending, not other statuses", () => {
    const old = booking();
    expect(matchesBookingFilter(old, "pending", TODAY)).toBe(true);
    expect(matchesBookingFilter(old, "confirmed", TODAY)).toBe(false);
    expect(matchesBookingFilter(old, "all", TODAY)).toBe(true);
  });

  it("filters by each stored status", () => {
    const confirmed = booking({ status: "confirmed" });
    expect(matchesBookingFilter(confirmed, "confirmed", TODAY)).toBe(true);
    expect(matchesBookingFilter(confirmed, "pending", TODAY)).toBe(false);
    expect(matchesBookingFilter(booking({ status: "no-show" }), "no-show", TODAY)).toBe(true);
  });
});

describe("Past badge", () => {
  it("marks bookings dated before today as past", () => {
    expect(isPastBooking(booking({ date: "2026-11-17" }), TODAY)).toBe(true);
    expect(matchesBookingFilter(booking({ date: "2026-11-17" }), "past", TODAY)).toBe(true);
  });

  it("does not mark today, future or malformed dates as past", () => {
    expect(isPastBooking(booking({ date: TODAY }), TODAY)).toBe(false);
    expect(isPastBooking(booking({ date: "2026-12-01" }), TODAY)).toBe(false);
    expect(isPastBooking(booking({ date: "soon" }), TODAY)).toBe(false);
    expect(matchesBookingFilter(booking({ date: "soon" }), "past", TODAY)).toBe(false);
  });

  it("counts past bookings", () => {
    expect(
      countPastBookings(
        [
          booking({ date: "2026-11-01" }),
          booking({ date: TODAY }),
          booking({ date: "2026-11-30" }),
        ],
        TODAY
      )
    ).toBe(1);
  });
});
