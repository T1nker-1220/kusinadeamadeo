import { prisma } from '@/lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Exchange code for session
    const { data: { session }, error: authError } = await supabase.auth.exchangeCodeForSession(code);

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_error`);
    }

    // Create or update user profile
    try {
      const { user } = session;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! }
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email!,
            fullName: user.user_metadata.full_name || '',
            phoneNumber: '',
            address: '',
            role: 'CUSTOMER'
          }
        });
      }

      return NextResponse.redirect(`${requestUrl.origin}/profile`);
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=db_error`);
    }
  }

  // No code present, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/auth/login`);
}
