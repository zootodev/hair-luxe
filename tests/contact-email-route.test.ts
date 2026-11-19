import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  sendContactEmail: vi.fn(),
}));

vi.mock("@/lib/email-server", () => ({
  sendContactEmail: mocks.sendContactEmail,
}));

import { POST } from "@/app/api/email/route";

const validBody = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "+2348012345678",
  subject: "Order enquiry",
  message: "Please call me about my order",
};

let requestNumber = 0;

function post(body: unknown) {
  // A fresh IP per request keeps these cases under the route's rate limit.
  requestNumber += 1;
  return new NextRequest("http://localhost/api/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": `203.0.113.${requestNumber}`,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.sendContactEmail.mockResolvedValue({ ok: true, status: 200 });
});

describe("POST /api/email", () => {
  it("returns 200 ok when the email is sent", async () => {
    const res = await POST(post(validBody));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(mocks.sendContactEmail).toHaveBeenCalledWith({
      name: validBody.name,
      email: validBody.email,
      phone: validBody.phone,
      subject: validBody.subject,
      message: validBody.message,
    });
  });

  it("returns 502 when the email send fails and logs only the status", async () => {
    mocks.sendContactEmail.mockResolvedValue({ ok: false, status: 503 });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      const res = await POST(post(validBody));

      expect(res.status).toBe(502);
      expect(await res.json()).toEqual({
        ok: false,
        error: "We couldn't send your message right now. Please try again or call us.",
      });

      const logged = errorSpy.mock.calls.flat().join(" ");
      expect(logged).toContain("503");
      expect(logged).not.toContain(validBody.name);
      expect(logged).not.toContain(validBody.email);
      expect(logged).not.toContain(validBody.phone);
      expect(logged).not.toContain(validBody.message);
    } finally {
      errorSpy.mockRestore();
    }
  });

  it("returns 400 when the name is missing", async () => {
    const res = await POST(post({ ...validBody, name: "" }));

    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("Please include your name and a message.");
    expect(mocks.sendContactEmail).not.toHaveBeenCalled();
  });

  it("returns 400 when the message is missing", async () => {
    const res = await POST(post({ ...validBody, message: "   " }));

    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("Please include your name and a message.");
    expect(mocks.sendContactEmail).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON", async () => {
    const res = await POST(post("{not json"));

    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("Invalid JSON body.");
    expect(mocks.sendContactEmail).not.toHaveBeenCalled();
  });

  it("still accepts honeypot submissions", async () => {
    const res = await POST(post({ website: "http://spam.example" }));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, honeypot: true });
    expect(mocks.sendContactEmail).not.toHaveBeenCalled();
  });
});
