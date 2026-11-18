import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import {
  createSessionToken,
  getAdminAuthConfig,
  SESSION_COOKIE,
} from "@/lib/admin-auth";
import { POST as login } from "@/app/api/admin/login/route";

const saved = {
  vercelEnv: process.env.VERCEL_ENV,
  password: process.env.ADMIN_PASSWORD,
  secret: process.env.ADMIN_SESSION_SECRET,
};

function restore(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

function loginRequest(password: string, ip: string) {
  return new NextRequest("http://localhost/api/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify({ password }),
  });
}

beforeEach(() => {
  process.env.VERCEL_ENV = "production";
  delete process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_SESSION_SECRET;
});

afterEach(() => {
  restore("VERCEL_ENV", saved.vercelEnv);
  restore("ADMIN_PASSWORD", saved.password);
  restore("ADMIN_SESSION_SECRET", saved.secret);
});

describe("production admin auth fails closed", () => {
  it("rejects login when ADMIN_PASSWORD is missing and issues no session", async () => {
    process.env.ADMIN_SESSION_SECRET = "configured-secret";

    expect(getAdminAuthConfig()).toBeNull();
    const response = await login(loginRequest("hairluxe-demo", "10.0.0.1"));

    expect(response.status).toBe(503);
    expect(response.headers.get("set-cookie")).toBeNull();
    await expect(createSessionToken()).rejects.toThrow(/not configured/i);
  });

  it("rejects login when ADMIN_SESSION_SECRET is missing and issues no session", async () => {
    process.env.ADMIN_PASSWORD = "real-admin-password";

    expect(getAdminAuthConfig()).toBeNull();
    const response = await login(
      loginRequest("real-admin-password", "10.0.0.2")
    );

    expect(response.status).toBe(503);
    expect(response.headers.get("set-cookie")).toBeNull();
    await expect(createSessionToken()).rejects.toThrow(/not configured/i);
  });

  it("refuses the demo password when production credentials are configured", async () => {
    process.env.ADMIN_PASSWORD = "real-admin-password";
    process.env.ADMIN_SESSION_SECRET = "real-session-secret";

    const demoResponse = await login(loginRequest("hairluxe-demo", "10.0.0.3"));
    expect(demoResponse.status).toBe(401);

    const realResponse = await login(
      loginRequest("real-admin-password", "10.0.0.4")
    );
    expect(realResponse.status).toBe(200);
    expect(realResponse.headers.get("set-cookie")).toContain(SESSION_COOKIE);
  });
});
