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