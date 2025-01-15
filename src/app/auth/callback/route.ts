import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=no_code`);
  }

  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Exchange code for session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Exchange error:', exchangeError);
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=exchange_error`);
    }

    // Get the user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=session_error`);
    }

    if (!session?.user) {
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=no_session`);
    }

    // Check if user exists in our User table
    const { data: existingUser, error: userError } = await supabase
      .from('User')
      .select('id, role')
      .eq('id', session.user.id)
      .single();

    if (userError && userError.code !== 'PGRST116') { // Not found error
      console.error('Database error:', userError);
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=db_error`);
    }

    // If user doesn't exist, create a new user record
    if (!existingUser) {
      const { error: insertError } = await supabase
        .from('User')
        .insert({
          id: session.user.id,
          email: session.user.email,
          fullName: session.user.user_metadata.full_name || session.user.email?.split('@')[0],
          phoneNumber: '',  // Will be updated later by user
          address: '',      // Will be updated later by user
          role: 'CUSTOMER'  // Default role
        });

      if (insertError) {
        console.error('Error creating user:', insertError);
        return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=db_error`);
      }

      // Redirect new users to dashboard
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
    }

    // For existing users, redirect based on role
    const redirectPath = existingUser.role === 'ADMIN' ? '/admin' : '/dashboard';
    return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`);

  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_error`);
  }
}
