import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  try {
    // Refresh session if needed
    const { data: { session }, error } = await supabase.auth.getSession();

    // If no session and trying to access protected routes
    if (!session && (
      request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/admin')
    )) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // If has session, verify role for admin routes
    if (session && request.nextUrl.pathname.startsWith('/admin')) {
      const { data: userData, error: userError } = await supabase
        .from('User')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (userError || userData?.role !== 'ADMIN') {
        console.error('Access denied: User is not an admin');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/callback',
  ],
};
