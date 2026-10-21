import { NextRequest, NextResponse } from 'next/server';
import {
  extractUserRoleFromToken,
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from './lib/auth-utils';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Extract access token from incoming request cookies
  const accessToken = request.cookies.get('accessToken')?.value;

  let userRole: UserRole | null = null;

  if (accessToken) {
    userRole = extractUserRoleFromToken(accessToken);

    // If token exists but is invalid or expired, clear cookie and redirect to login
    if (!userRole) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'session_expired');
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }
  }

  const routeOwner = getRouteOwner(pathname);
  const isAuth = isAuthRoute(pathname);

  // Rule 1: Authenticated user attempting to access auth route (/login, /register). Redirect to their dashboard.
  if (accessToken && userRole && isAuth) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(userRole), request.url)
    );
  }

  // Rule 2: Open public routes (e.g. landing page '/', public assets) -> Allow access
  if (routeOwner === null) {
    return NextResponse.next();
  }

  // Rule 3: Protected route without valid credentials -> Redirect to login with callback URL
  if (!accessToken || !userRole) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rule 4: Common protected routes accessible to all authenticated users (e.g. /profile, /settings)
  if (routeOwner === 'COMMON') {
    return NextResponse.next();
  }

  // Rule 5: Role-based protected routes (e.g. /student/*, /mentor/*, /admin/*)
  if (routeOwner === 'ADMIN' || routeOwner === 'MENTOR' || routeOwner === 'STUDENT') {
    if (routeOwner !== userRole) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole), request.url)
      );
    }
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

