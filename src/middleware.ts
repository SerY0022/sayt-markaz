/**
 * Next.js Middleware — Admin Route Guard
 *
 * Fast check for session cookie presence on protected /admin routes.
 * Redirects unauthenticated requests (missing session cookie) to /admin/login.
 *
 * Full cryptographic & database token validation is performed in /admin/layout.tsx
 * and /admin/login/page.tsx to avoid false redirects on stale cookies.
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SESSION_COOKIE_NAME = "admin_session"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!request.cookies.has(SESSION_COOKIE_NAME)) {
      const loginUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
