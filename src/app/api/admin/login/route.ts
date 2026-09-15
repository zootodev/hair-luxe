import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, hashAdminPassword } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  let body: { password?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const password = body.password;
  if (!password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedPassword) {
    return NextResponse.json(
      { error: "Admin password is not configured on the server" },
      { status: 500 }
    );
  }

  const [submittedHash, expectedHash] = await Promise.all([
    hashAdminPassword(password),
    hashAdminPassword(expectedPassword),
  ]);

  if (submittedHash !== expectedHash) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, submittedHash, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}