import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code)
      
      // Get the user session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // Check if user exists in customers table
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select()
          .eq('google_id', session.user.id)
          .single()

        if (!existingCustomer) {
          // Create new customer record
          await supabase.from('customers').insert({
            google_id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata.full_name,
            avatar_url: session.user.user_metadata.avatar_url,
          })
        } else {
          // Update last login
          await supabase
            .from('customers')
            .update({ last_login: new Date().toISOString() })
            .eq('google_id', session.user.id)
        }

        // Redirect based on role
        if (session.user.email === process.env.NEXT_PUBLIC_BUSINESS_EMAIL) {
          return NextResponse.redirect(new URL('/admin/dashboard', requestUrl.origin))
        }
      }
    }

    // Default redirect to home page
    return NextResponse.redirect(new URL('/', requestUrl.origin))
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
} 