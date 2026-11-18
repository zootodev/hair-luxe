import { safeEqual } from "@/lib/timing-safe";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE = "hair-luxe-admin-session";

export const DEMO_ADMIN_PASSWORD = "hairluxe-demo";

const SALT = "hair-luxe-admin-session-v1";

export interface AdminAuthConfig {
  password: string;
  secret: string;
}

export function isProductionDeployment(): boolean {
  return process.env.VERCEL_ENV === "production";
}

/**
 * Production must have both values configured explicitly. Local development
 * keeps the demo fallback so `next dev` and `next start` still work without a
 * .env file. A missing production secret never falls back to the demo secret,
 * so no session can be issued or verified.
 */
export function getAdminAuthConfig(): AdminAuthConfig | null {
  const configuredPassword = process.env.ADMIN_PASSWORD ?? "";
  const configuredSecret = process.env.ADMIN_SESSION_SECRET ?? "";
  const hasPassword = configuredPassword.trim() !== "";
  const hasSecret = configuredSecret.trim() !== "";

  if (isProductionDeployment()) {
    if (!hasPassword || !hasSecret) return null;
    return { password: configuredPassword, secret: configuredSecret };
  }

  const password = hasPassword ? configuredPassword : DEMO_ADMIN_PASSWORD;
  const secret = hasSecret ? configuredSecret : password;
  return { password, secret };
}

export async function hashAdminPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password + SALT);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function getExpectedToken(): Promise<string> {
  return hashAdminPassword(getAdminAuthConfig()?.password ?? "");
}

export function tokenMatches(token: string, expected: string): boolean {
  return safeEqual(token, expected);
}

export const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function base64url(value: Uint8Array | string): string {
  const buf = typeof value === "string" ? new TextEncoder().encode(value) : value;
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const rawSig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return base64url(new Uint8Array(rawSig));
}

export async function createSessionToken(): Promise<string> {
  const config = getAdminAuthConfig();
  if (!config) throw new Error("Admin login is not configured.");
  const issuedAt = Date.now().toString(36);
  const sig = await hmac(`admin-session:${issuedAt}`, config.secret);
  return `${issuedAt}.${sig}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  if (!token) return false;
  const config = getAdminAuthConfig();
  if (!config) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const issuedAtStr = parts[0];
  const sig = parts[1];
  const issuedAt = parseInt(issuedAtStr, 36);
  if (!Number.isFinite(issuedAt)) return false;
  if (Date.now() - issuedAt > SESSION_TTL_MS) return false;
  const expectedSig = await hmac(`admin-session:${issuedAtStr}`, config.secret);
  return safeEqual(sig, expectedSig);
}

export function generateCSRFToken(): string {
  // Generate a random CSRF token; stored in a cookie for form submissions
  return crypto.randomUUID();
}

export function verifyCsrf(request: NextRequest): boolean {
  // In Next.js server routes, access cookies from the request
  const csrfToken = request.headers.get("x-csrf-token");
  const cookieToken = request.cookies.get("csrf-token")?.value;
  if (!csrfToken || !cookieToken) return false;
  // Constant-time comparison using the already-imported safeEqual
  return safeEqual(csrfToken, cookieToken);
}
