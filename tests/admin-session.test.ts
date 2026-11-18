import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createSessionToken, verifySessionToken } from "@/lib/admin-auth";

/**
 * Regression test: the login route falls back to the demo password when
 * ADMIN_PASSWORD is unset, so session signing must use the same fallback.
 * Previously the HMAC key was empty and WebCrypto threw before a session
 * cookie could be issued.
 */
describe("admin session signing without env config", () => {
  const saved = {
    password: process.env.ADMIN_PASSWORD,
    secret: process.env.ADMIN_SESSION_SECRET,
  };

  beforeEach(() => {
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_SESSION_SECRET;
  });

  afterEach(() => {
    if (saved.password === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = saved.password;
    if (saved.secret === undefined) delete process.env.ADMIN_SESSION_SECRET;
    else process.env.ADMIN_SESSION_SECRET = saved.secret;
  });

  it("issues and verifies a session with the demo fallback", async () => {
    const token = await createSessionToken();
    expect(token).toMatch(/^[0-9a-z]+\.[A-Za-z0-9_-]+$/);
    await expect(verifySessionToken(token)).resolves.toBe(true);
  });

  it("rejects a tampered signature", async () => {
    const token = await createSessionToken();
    const [issuedAt] = token.split(".");
    await expect(verifySessionToken(`${issuedAt}.not-the-signature`)).resolves.toBe(false);
  });
});
