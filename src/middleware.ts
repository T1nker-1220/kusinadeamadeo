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
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Handle authentication errors
    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const path = request.nextUrl.pathname;

    // Allow public routes
    if (PUBLIC_ROUTES.some(route => path.startsWith(route))) {
      return res;
    }

    // Redirect to login if not authenticated
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Check admin routes
    if (ADMIN_ROUTES.some(route => path.startsWith(route))) {
      try {
        const { data: userData, error: dbError } = await supabase
          .from('User')
          .select('role')
          .eq('id', user.id)
          .single();

        if (dbError) {
          console.error('User fetch error:', dbError);
          return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        if (userData?.role !== 'ADMIN') {
          return NextResponse.redirect(new URL('/', request.url));
        }
      } catch (error) {
        console.error('Admin check error:', error);
        return NextResponse.redirect(new URL('/auth/login', request.url));
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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
