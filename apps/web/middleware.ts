import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware — runs at the EDGE before every matched request.
 * This means auth checks happen before the page renders, not after.
 * No redirect flicker, no flash of protected content.
 *
 * Edge runtime = V8 isolate, not Node.js. Keep it lightweight:
 * no Prisma, no bcrypt — just read the cookie and redirect.
 */

const PROTECTED_PREFIXES = ["/dashboard", "/admin", "/partner", "/consultant"];
const AUTH_ROUTES = ["/login", "/signup"];

// Role → home path mapping
const ROLE_HOME: Record<string, string> = {
  BUSINESS_OWNER: "/dashboard",
  ADMIN: "/admin",
  PARTNER: "/partner",
  CONSULTANT: "/consultant",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("sme_token")?.value;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  // Not logged in → trying to access protected page → send to login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname); // remember where they were going
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in → trying to hit login/signup → send to their dashboard
  if (isAuthRoute && token) {
    try {
      // Decode JWT payload (no verification — that's the API's job)
      // We just need the role to redirect to the right dashboard
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64url").toString()
      );
      const home = ROLE_HOME[payload.role as string] ?? "/dashboard";
      return NextResponse.redirect(new URL(home, request.url));
    } catch {
      // Malformed token — clear it and let them through to login
      const res = NextResponse.next();
      res.cookies.delete("sme_token");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes EXCEPT Next.js internals and static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
