import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import type { Booking } from "@/lib/types";

const mocks = vi.hoisted(() => ({
  isAdmin: vi.fn(),
  verifyCsrf: vi.fn(),
  updateBookingStatus: vi.fn(),
}));

vi.mock("@/lib/admin-session", () => ({
  isAdmin: mocks.isAdmin,
  verifyCsrf: mocks.verifyCsrf,
}));

vi.mock("@/lib/store", () => ({
  deleteBooking: vi.fn(),
  getBookingById: vi.fn(),
  updateBookingStatus: mocks.updateBookingStatus,
}));

import { PATCH } from "@/app/api/admin/bookings/[id]/route";

const context = { params: Promise.resolve({ id: "BK-2026-0001" }) };

function patch(body: unknown) {
  return new NextRequest("http://localhost/api/admin/bookings/BK-2026-0001", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.verifyCsrf.mockReturnValue(true);
  mocks.updateBookingStatus.mockResolvedValue(true);
});

describe("PATCH /api/admin/bookings/[id]", () => {
  it("returns 401 when signed out", async () => {
    mocks.isAdmin.mockResolvedValue(false);

    const res = await PATCH(patch({ status: "confirmed" }), context);

    expect(res.status).toBe(401);
    expect(mocks.updateBookingStatus).not.toHaveBeenCalled();
  });

  it("saves a valid booking status for a signed-in admin", async () => {
    mocks.isAdmin.mockResolvedValue(true);

    const res = await PATCH(patch({ status: "confirmed" }), context);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ ok: true, status: "confirmed" });
    expect(mocks.updateBookingStatus).toHaveBeenCalledWith("BK-2026-0001", "confirmed");
  });

  it("rejects an unknown status", async () => {
    mocks.isAdmin.mockResolvedValue(true);

    const res = await PATCH(patch({ status: "archived" }), context);

    expect(res.status).toBe(400);
    expect(mocks.updateBookingStatus).not.toHaveBeenCalled();
  });

  it("returns 404 when the booking does not exist", async () => {
    mocks.isAdmin.mockResolvedValue(true);
    mocks.updateBookingStatus.mockResolvedValue(false);

    const res = await PATCH(patch({ status: "completed" }), context);

    expect(res.status).toBe(404);
  });
});

// Keep the Booking type import meaningful for the fixture shape used above.
const sample: Pick<Booking, "id" | "status"> = { id: "BK-2026-0001", status: "confirmed" };
void sample;
