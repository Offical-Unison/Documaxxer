export { auth as middleware } from "@/lib/auth/auth";

export const config = {
  // Protected routes — require authentication
  // Currently only the dashboard (future). Builder stays public for now.
  matcher: ["/dashboard/:path*"],
};
