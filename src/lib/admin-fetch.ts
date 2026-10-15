/**
 * Helper for making CSRF-protected fetch requests to admin routes.
 * Reads the csrf-token cookie and adds it as the x-csrf-token header.
 */
export async function adminFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  const token = store.get("csrf-token")?.value;
  
  if (!token) {
    // If no token, proceed without CSRF header
    return fetch(input, init);
  }
  
  return fetch(input, {
    ...init,
    headers: {
      ...init.headers,
      "x-csrf-token": token,
    },
  });
}