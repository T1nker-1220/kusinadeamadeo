import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")

    if (code) {
      try {
        // Create Supabase client with proper cookie handling
        const cookieStore = cookies()
        const supabase = createRouteHandlerClient({ 
          cookies: () => cookieStore
        }, {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          options: {
            auth: {
              persistSession: true,
              storageKey: 'sb-blglkqttwesxmtbczvxd-auth-token',
              flowType: 'pkce',
            }
          }
        })
        
        // Exchange the code for a session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (exchangeError) {
          console.error('Code exchange error:', exchangeError)
          throw exchangeError
        }

        // Get the user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          throw sessionError
        }
        
        if (session) {
          console.log('User email:', session.user.email)
          console.log('Expected admin email:', process.env.NEXT_PUBLIC_BUSINESS_EMAIL)
          
          // Check for admin first
          if (session.user.email === process.env.NEXT_PUBLIC_BUSINESS_EMAIL) {
            console.log('Admin user detected, redirecting to dashboard')
            return NextResponse.redirect(new URL('/admin/dashboard', requestUrl.origin))
          }

          try {
            // Enable RLS policy for customers table
            const { error: policyError } = await supabase.rpc('enable_customer_access')
            
            if (policyError) {
              console.error('Policy error:', policyError)
              throw policyError
            }

            // Check if user exists in customers table
            const { data: existingCustomer, error: customerError } = await supabase
              .from('customers')
              .select()
              .eq('google_id', session.user.id)
              .single()

            if (customerError && customerError.code !== 'PGRST116') {
              console.error('Customer lookup error:', customerError)
              throw customerError
            }

            if (!existingCustomer) {
              // Create new customer record
              const { error: insertError } = await supabase
                .from('customers')
                .insert({
                  google_id: session.user.id,
                  email: session.user.email,
                  full_name: session.user.user_metadata?.full_name || session.user.email,
                  avatar_url: session.user.user_metadata?.avatar_url || null,
                  last_login: new Date().toISOString(),
                })
              
              if (insertError) {
                console.error('Customer insert error:', insertError)
                throw insertError
              }
            } else {
              // Update last login and avatar if needed
              const { error: updateError } = await supabase
                .from('customers')
                .update({
                  last_login: new Date().toISOString(),
                  avatar_url: session.user.user_metadata?.avatar_url || existingCustomer.avatar_url,
                  full_name: session.user.user_metadata?.full_name || existingCustomer.full_name,
                })
                .eq('google_id', session.user.id)
                
              if (updateError) {
                console.error('Last login update error:', updateError)
                throw updateError
              }
            }

            // Disable RLS policy after operations
            await supabase.rpc('disable_customer_access')
          } catch (dbError) {
            console.error('Database operation failed:', dbError)
            // Continue to home page even if DB operations fail
          }
        } else {
          console.error('No session found after exchange')
          throw new Error('No session found after exchange')
        }

        // Return successful response
        return NextResponse.redirect(new URL('/', requestUrl.origin))
      } catch (authError) {
        console.error('Authentication failed:', authError)
        return NextResponse.redirect(new URL('/auth/error', requestUrl.origin))
      }
    } else {
      console.error('No code provided in callback')
      return NextResponse.redirect(new URL('/auth/error', requestUrl.origin))
    }
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL('/auth/error', request.url))
  }
} 