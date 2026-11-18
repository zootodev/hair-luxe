import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin-auth";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

function loginUrl(request: NextRequest, pathname: string): URL {
  const url = new URL("/admin/login", request.url);
  if (pathname !== "/admin") url.searchParams.set("next", pathname + request.nextUrl.search);
  return url;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const isApi = pathname.startsWith("/api/admin");

  if (isLogin || pathname === "/api/admin/login") {
    // Valid session on /admin/login → redirect to /admin
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (token && (await verifySessionToken(token))) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token || !(await verifySessionToken(token))) {
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    // Every protected admin page (including /admin/bookings/[id]) → sign in.
    return NextResponse.redirect(loginUrl(request, pathname));
  }

  return NextResponse.next();
}
