import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get user data with RLS in effect
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('*')
      .single()

    if (userError) {
      return NextResponse.json(
        { error: 'Error fetching user data', details: userError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Authentication working',
      session: {
        user: session.user,
        role: userData.role
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error', details: error },
      { status: 500 }
    )
  }
}
