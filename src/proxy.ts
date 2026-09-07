import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

// Optimistic guard only: it checks for the presence of the session cookie so
// signed-out visitors never render protected pages. Every protected page and
// server action re-validates the session server-side.
export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/board/:path*", "/settings/:path*"],
};
