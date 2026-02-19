import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  if (!user && (pathname === '/dashboard' || pathname.startsWith('/dashboard/'))) {
    const redirect = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c.name, c.value));
    return redirect;
  }

  if (user && pathname === '/login') {
    const redirect = NextResponse.redirect(new URL('/dashboard', req.url));
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c.name, c.value));
    return redirect;
  }

  if (pathname === '/') {
    if (user) {
      const redirect = NextResponse.redirect(new URL('/dashboard', req.url));
      response.cookies.getAll().forEach((c) => redirect.cookies.set(c.name, c.value));
      return redirect;
    }
    const redirect = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c.name, c.value));
    return redirect;
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/', '/auth/reset-password'],
};
