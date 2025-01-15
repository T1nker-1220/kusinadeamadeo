import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/callback',
  '/api/auth/google',
];

const ADMIN_ROUTES = [
  '/admin',
  '/api/admin',
];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const { data: { session }, error } = await supabase.auth.getSession();

  // Handle authentication errors
  if (error) {
    console.error('Auth error:', error);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const path = request.nextUrl.pathname;

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => path.startsWith(route))) {
    return res;
  }

  // Redirect to login if not authenticated
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Check admin routes
  if (ADMIN_ROUTES.some(route => path.startsWith(route))) {
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
