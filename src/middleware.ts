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
    await supabase.auth.getSession()

    const {
      data: { session },
    } = await supabase.auth.getSession()

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
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // If not admin trying to access admin routes
    if (isAdminRoute && (!session || session.user.email !== process.env.NEXT_PUBLIC_BUSINESS_EMAIL)) {
      return NextResponse.redirect(new URL("/", request.url))
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