import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const site = request.headers.get("sec-fetch-site");

  const sameOrigin =
    site === "same-origin" ||
    site === "none" ||
    (origin && host ? new URL(origin).host === host : false);

  if (!sameOrigin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}