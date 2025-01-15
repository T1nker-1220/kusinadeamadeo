import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import console from 'console';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });

    // Exchange code for session
    await supabase.auth.exchangeCodeForSession(code);

    try {
      // Get the user's session
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Check if user exists in our User table
        const { data: existingUser } = await supabase
          .from('User')
          .select('id')
          .eq('id', session.user.id)
          .single();

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
            return NextResponse.redirect(
              `${requestUrl.origin}/auth/login?error=db_error`
            );
          }
        }
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=auth_error`
      );
    }
  }

  // Redirect to home page
  return NextResponse.redirect(requestUrl.origin);
}
