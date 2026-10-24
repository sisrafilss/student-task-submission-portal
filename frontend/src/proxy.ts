import { NextRequest, NextResponse } from 'next/server';
import {
  decodeAuthToken,
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
} from './lib/auth-utils';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Extract access token from incoming request cookies
  const accessToken = request.cookies.get('accessToken')?.value;

  let decodedUser = null;

  if (accessToken) {
    decodedUser = decodeAuthToken(accessToken);

    // If token exists but is invalid or expired, clear cookie and redirect to login
    if (!decodedUser) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'session_expired');
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }
  }

  const userRole = decodedUser?.role || null;
  const needsPasswordChange = decodedUser?.needsPasswordChange ?? false;
  const isAuth = isAuthRoute(pathname);

  // Intercept users requiring password change
  if (accessToken && userRole && needsPasswordChange) {
    if (pathname === '/change-password') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/change-password', request.url));
  }

  // If user does NOT need password change, prevent visiting /change-password
  if (accessToken && userRole && !needsPasswordChange && pathname === '/change-password') {
    return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
  }

  // Rule 1: Authenticated user attempting to access auth route (/login, /register). Redirect to their dashboard.
  if (accessToken && userRole && isAuth) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(userRole), request.url)
    );
  }

  const routeOwner = getRouteOwner(pathname);

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
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
