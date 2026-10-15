/** 
 * Client-safe helper for making CSRF-protected fetch requests to admin routes. 
 * Reads the csrf-token from document.cookie and merges it as the x-csrf-token header. 
 * Works in both client and edge contexts. 
 * 
 * Usage in client components:
 *   const result = await adminFetch("/api/admin/orders", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(data),
 *   });
 *   if (!result.ok) { ... }
 */ 
export async function adminFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  // Read csrf-token from document.cookie (set httpOnly:false at login)
  const cookieToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrf-token="))
    ?.split("=")[1];

  // Merge headers, preserving existing Content-Type etc.
  const newHeaders = new Headers(init.headers);
  if (cookieToken) {
    newHeaders.set("x-csrf-token", cookieToken);
  }

  return fetch(input, {
    ...init,
    headers: newHeaders,
  });
}