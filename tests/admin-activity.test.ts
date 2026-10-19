import { describe, expect, it } from "vitest";
import {
  countNewSinceLastSeen,
  countUpcomingBookings,
  localTodayIso,
  parseTimestamp,
} from "@/lib/admin-activity";

describe("parseTimestamp", () => {
  it("parses ISO timestamps to epoch ms", () => {
    expect(parseTimestamp("2026-10-19T10:00:00.000Z")).toBe(
      Date.parse("2026-10-19T10:00:00.000Z")
    );
  });

  it("returns null for missing or invalid values", () => {
    expect(parseTimestamp(undefined)).toBeNull();
    expect(parseTimestamp(null)).toBeNull();
    expect(parseTimestamp("")).toBeNull();
    expect(parseTimestamp("   ")).toBeNull();
    expect(parseTimestamp("not-a-date")).toBeNull();
  });
});

describe("countNewSinceLastSeen", () => {
  const lastSeen = Date.parse("2026-10-19T09:00:00.000Z");

  it("counts only records created after last seen", () => {
    const timestamps = [
      "2026-10-19T08:00:00.000Z", // before → not new
      "2026-10-19T09:00:00.000Z", // exactly last seen → not new
      "2026-10-19T09:30:00.000Z", // after → new
      "2026-10-19T10:00:00.000Z", // after → new
    ];
    expect(countNewSinceLastSeen(timestamps, lastSeen)).toBe(2);
  });

  it("ignores records with missing or invalid timestamps (old records)", () => {
    const timestamps = [
      undefined,
      null,
      "",
      "not-a-date",
      "2026-10-19T10:00:00.000Z", // the only valid "new" record
    ];
    expect(countNewSinceLastSeen(timestamps, lastSeen)).toBe(1);
  });

  it("returns zero for empty or never-seen states", () => {
    expect(countNewSinceLastSeen([], Date.now())).toBe(0); // no records
    expect(countNewSinceLastSeen(["2026-10-19T10:00:00.000Z"], null)).toBe(0); // never seen
    expect(countNewSinceLastSeen(["2026-10-19T10:00:00.000Z"], undefined)).toBe(0);
    expect(countNewSinceLastSeen(["2026-10-19T10:00:00.000Z"], 0)).toBe(0);
    expect(countNewSinceLastSeen(["2026-10-19T10:00:00.000Z"], Number.NaN)).toBe(0);
  });
});

describe("countUpcomingBookings", () => {
  const today = "2026-10-19";

  it("counts bookings dated today or later", () => {
    const bookings = [
      { date: "2026-10-18" }, // past
      { date: "2026-10-19" }, // today
      { date: "2026-12-31" }, // future
    ];
    expect(countUpcomingBookings(bookings, today)).toBe(2);
  });

  it("skips malformed or missing dates", () => {
    expect(
      countUpcomingBookings([{ date: "" }, {}, { date: "soon" }, { date: null }], today)
    ).toBe(0);
  });

  it("returns zero when there are no bookings", () => {
    expect(countUpcomingBookings([], today)).toBe(0);
  });
});

describe("localTodayIso", () => {
  it("formats the local calendar date as YYYY-MM-DD", () => {
    expect(localTodayIso(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(localTodayIso(new Date(2026, 11, 31))).toBe("2026-12-31");
  });
});
