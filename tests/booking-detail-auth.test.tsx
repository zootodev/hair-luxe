import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Booking } from "@/lib/types";

const mocks = vi.hoisted(() => ({
  isAdmin: vi.fn(),
  getBookingById: vi.fn(),
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/admin-session", () => ({ isAdmin: mocks.isAdmin }));
vi.mock("@/lib/store", () => ({ getBookingById: mocks.getBookingById }));
vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
  notFound: mocks.notFound,
  useRouter: () => ({ push: vi.fn() }),
}));

import AdminBookingDetailPage from "@/app/admin/(protected)/bookings/[id]/page";

const booking: Booking = {
  id: "BK-2026-0001",
  name: "Ada",
  email: "ada@example.com",
  phone: "+2348123456789",
  service: "Hair revamping",
  date: "2026-11-20",
  time: "10:00 AM",
  dateCreated: "2026-11-01T10:00:00.000Z",
};

const params = Promise.resolve({ id: booking.id });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("admin booking detail page", () => {
  it("redirects signed-out visitors to the admin sign-in", async () => {
    mocks.isAdmin.mockResolvedValue(false);

    await expect(AdminBookingDetailPage({ params })).rejects.toThrow("NEXT_REDIRECT");

    expect(mocks.redirect).toHaveBeenCalledWith(
      `/admin/login?next=${encodeURIComponent(`/admin/bookings/${booking.id}`)}`
    );
    expect(mocks.getBookingById).not.toHaveBeenCalled();
  });

  it("renders the detail view for a signed-in admin", async () => {
    mocks.isAdmin.mockResolvedValue(true);
    mocks.getBookingById.mockResolvedValue(booking);

    await expect(AdminBookingDetailPage({ params })).resolves.toBeTruthy();
    expect(mocks.getBookingById).toHaveBeenCalledWith(booking.id);
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("returns not-found for an unknown booking", async () => {
    mocks.isAdmin.mockResolvedValue(true);
    mocks.getBookingById.mockResolvedValue(undefined);

    await expect(AdminBookingDetailPage({ params })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
