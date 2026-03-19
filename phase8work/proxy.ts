import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !session) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const publicMemberRoutes = new Set(["/member/login", "/member/claim"]);
  if (pathname.startsWith("/member") && !publicMemberRoutes.has(pathname) && !session) {
    const loginUrl = new URL("/member/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/member/:path*"],
};