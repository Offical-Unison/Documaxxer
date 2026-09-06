import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isAuthenticated = !!request.auth?.user;

  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
  }

  if (!isAuthenticated && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
