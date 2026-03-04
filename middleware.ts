import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const url = req.nextUrl;

  if (isProtectedRoute(req)) {
    await auth().protect();
  }

  // Advisor Guard: only allow advisors into dashboard routes
  if (userId && url.pathname.startsWith('/dashboard')) {
    const publicMetadata = (sessionClaims?.publicMetadata || {}) as any;
    const role = publicMetadata?.role;

    if (role !== 'advisor') {
      const accessDeniedUrl = new URL('/access-denied', req.url);
      return NextResponse.redirect(accessDeniedUrl);
    }
  }

  // If already signed in and hitting /login, send to dashboard
  if (url.pathname === '/login' && userId) {
    const dashboardUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/', '/login', '/access-denied'],
};
