import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })

    // Add pathname to headers for layout detection
    res.headers.set('x-pathname', request.nextUrl.pathname)

    // Refresh session if expired - required for Server Components
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('Session error in middleware:', sessionError)
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Check if this is an admin route
    const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
    const isAuthRoute = request.nextUrl.pathname === "/login" || 
                       request.nextUrl.pathname === "/register"
    const isProtectedRoute = request.nextUrl.pathname.startsWith("/orders") || 
                            request.nextUrl.pathname.startsWith("/cart") ||
                            request.nextUrl.pathname.startsWith("/checkout")

    // If user is signed in and tries to access auth routes, redirect to home
    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // If no session and trying to access protected routes
    if (!session && (isProtectedRoute || isAdminRoute)) {
      console.log('No session, redirecting to login')
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // If not admin trying to access admin routes
    if (isAdminRoute) {
      if (!session) {
        console.log('No session for admin route, redirecting to login')
        return NextResponse.redirect(new URL("/login", request.url))
      }
      
      console.log('Admin route check - User email:', session.user.email)
      console.log('Admin route check - Expected email:', process.env.NEXT_PUBLIC_BUSINESS_EMAIL)
      
      if (session.user.email !== process.env.NEXT_PUBLIC_BUSINESS_EMAIL) {
        console.log('Non-admin user attempting to access admin route')
        return NextResponse.redirect(new URL("/", request.url))
      }
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL("/", request.url))
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/register",
    "/orders/:path*",
    "/cart",
    "/checkout",
  ],
} 