import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/creator",
  "/business",
  "/settings",
  "/admin",
];

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hostname = request.headers.get("host") || "";

  // Subdomain rewriting for motize.dropterest.com (and local motize.localhost)
  if (
    (hostname.startsWith("motize.") || hostname.startsWith("motize-")) &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next")
  ) {
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/motize", request.url));
    }
    if (!pathname.startsWith("/motize")) {
      return NextResponse.rewrite(new URL(`/motize${pathname}`, request.url));
    }
  }

  // Check for Better Auth session cookie
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // If unauthenticated user tries to access protected route -> redirect to login
  if (isProtectedRoute && !sessionToken) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If authenticated user visits auth routes -> redirect to dashboard
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (.png, .jpg, .svg, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
