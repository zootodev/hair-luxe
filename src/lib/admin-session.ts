import { cookies } from "next/headers";
import { SESSION_COOKIE, getExpectedToken, tokenMatches } from "@/lib/admin-auth";

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const expected = await getExpectedToken();
  return tokenMatches(token, expected);
}