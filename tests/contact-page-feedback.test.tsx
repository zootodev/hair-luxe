// @vitest-environment jsdom
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

const mocks = vi.hoisted(() => ({
  useCart: vi.fn(),
  fetch: vi.fn(),
}));

vi.mock("@/lib/context/CartContext", () => ({
  useCart: mocks.useCart,
}));

import ContactPage from "@/app/contact/page";

const phone = "+234 800 000 0000";
const business = {
  name: "Hair Luxe",
  email: "hello@hairluxe.example",
  phone,
  phoneFormatted: phone,
  address: "1 Studio Road",
  city: "Lagos",
  hours: "Mon - Sat: 9am - 6pm",
  bankDetails: {
    bankName: "Test Bank",
    accountName: "Hair Luxe",
    accountNumber: "0123456789",
  },
};

function fakeResponse(status: number, data: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  };
}

function fillForm() {
  fireEvent.change(screen.getByLabelText("Name *"), { target: { value: "Ada Lovelace" } });
  fireEvent.change(screen.getByLabelText("Email *"), { target: { value: "ada@example.com" } });
  fireEvent.change(screen.getByLabelText("Subject *"), { target: { value: "Order enquiry" } });
  fireEvent.change(screen.getByLabelText("Message *"), {
    target: { value: "Please call me about my order" },
  });
}

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

beforeEach(() => {
  mocks.useCart.mockReturnValue({ business });
  vi.stubGlobal("fetch", mocks.fetch);
  mocks.fetch.mockReset();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("contact form feedback", () => {
  it("shows the success banner and clears the form after a successful send", async () => {
    mocks.fetch.mockResolvedValue(fakeResponse(200, { ok: true }));

    render(<ContactPage />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    const banner = await screen.findByRole("status");
    expect(banner.textContent).toContain("Message sent!");
    expect(banner.getAttribute("tabindex")).toBe("-1");
    expect(document.activeElement).toBe(banner);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();

    expect((screen.getByLabelText("Name *") as HTMLInputElement).value).toBe("");
    expect((screen.getByLabelText("Email *") as HTMLInputElement).value).toBe("");
    expect((screen.getByLabelText("Message *") as HTMLTextAreaElement).value).toBe("");
  });

  it("shows the server error and keeps the typed values after a failed send", async () => {
    const error = "We couldn't send your message right now. Please try again or call us.";
    mocks.fetch.mockResolvedValue(fakeResponse(502, { ok: false, error }));

    render(<ContactPage />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain(error);
    expect(screen.getByRole("status").getAttribute("aria-live")).toBe("polite");
    expect(document.activeElement).toBe(screen.getByRole("status"));

    expect((screen.getByLabelText("Name *") as HTMLInputElement).value).toBe("Ada Lovelace");
    expect((screen.getByLabelText("Email *") as HTMLInputElement).value).toBe("ada@example.com");
    expect((screen.getByLabelText("Subject *") as HTMLSelectElement).value).toBe("Order enquiry");
    expect((screen.getByLabelText("Message *") as HTMLTextAreaElement).value).toBe(
      "Please call me about my order"
    );
  });

  it("falls back to the call-us message when the server gives no error text", async () => {
    mocks.fetch.mockResolvedValue(fakeResponse(502, { ok: false }));

    render(<ContactPage />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain(`Please call us at ${phone}.`);
  });

  it("hides the success banner when a field is edited", async () => {
    mocks.fetch.mockResolvedValue(fakeResponse(200, { ok: true }));

    render(<ContactPage />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    await screen.findByRole("status");

    fireEvent.change(screen.getByLabelText("Name *"), { target: { value: "Grace Hopper" } });

    expect(screen.queryByRole("status")).toBeNull();
  });
});
