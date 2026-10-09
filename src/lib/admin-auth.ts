import { safeEqual } from "@/lib/timing-safe";

export const SESSION_COOKIE = "hair-luxe-admin-session";

const SALT = "hair-luxe-admin-session-v1";

export async function hashAdminPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password + SALT);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function getExpectedToken(): Promise<string> {
  return hashAdminPassword(process.env.ADMIN_PASSWORD ?? "");
}

export function tokenMatches(token: string, expected: string): boolean {
  return safeEqual(token, expected);
}

export const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "";
}

function base64url(value: Uint8Array | string): string {
  const buf = typeof value === "string" ? new TextEncoder().encode(value) : value;
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createSessionToken(): Promise<string> {
  const issuedAt = Date.now().toString(36);
  const sig = await hmac(`admin-session:${issuedAt}`);
  return `${issuedAt}.${sig}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const issuedAtStr = parts[0];
  const sig = parts[1];
  const issuedAt = parseInt(issuedAtStr, 36);
  if (!Number.isFinite(issuedAt)) return false;
  if (Date.now() - issuedAt > SESSION_TTL_MS) return false;
  const expectedSig = await hmac(`admin-session:${issuedAtStr}`);
  return safeEqual(sig, expectedSig);
}

export function generateCSRFToken(): string {
  // Generate a random CSRF token; stored in a cookie for form submissions
  const token = Math.random().toString(36).substring(2, 32);
  return token;
}

async function hmac(message: string): Promise<string> {
  const secret = getSecret();
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