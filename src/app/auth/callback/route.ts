import { PrismaClient } from '@prisma/client';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(new URL('/auth/login?error=missing_code', request.url));
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.redirect(new URL('/auth/login?error=auth_error', request.url));
    }

    if (!session?.user) {
      return NextResponse.redirect(new URL('/auth/login?error=no_user', request.url));
    }

    try {
      // First check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: session.user.id }
      });

      if (existingUser) {
        // User exists, redirect based on role
        const redirectPath = existingUser.role === 'ADMIN' ? '/admin' : '/dashboard';
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }

      // Create new user if doesn't exist
      const newUser = await prisma.user.create({
        data: {
          id: session.user.id,
          email: session.user.email!,
          fullName: session.user.user_metadata.full_name || session.user.email!.split('@')[0],
          phoneNumber: '', // Required field
          address: '', // Required field
          role: 'CUSTOMER', // Default role
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Redirect new users to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));

    } catch (dbError: any) {
      console.error('Error handling user:', dbError);
      return NextResponse.redirect(new URL('/auth/login?error=db_error', request.url));
    }

  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/auth/login?error=unknown', request.url));
  }
}
