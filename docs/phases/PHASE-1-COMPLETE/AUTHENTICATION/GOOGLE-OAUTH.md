# Google OAuth Implementation

## Overview
Implementation of Google OAuth authentication for Kusina de Amadeo using Supabase Auth.

## Configuration

### 1. Supabase Auth Setup
```typescript
// lib/supabase/auth.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### 2. Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

## Implementation

### 1. Authentication Provider
```typescript
// components/providers/auth-provider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

### 2. Sign In Implementation
```typescript
// app/auth/sign-in/page.tsx
'use client'

import { supabase } from '@/lib/supabase/auth'

export default function SignIn() {
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error signing in:', error.message)
    }
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      className="btn-primary"
    >
      Sign in with Google
    </button>
  )
}
```

### 3. Auth Callback Handler
```typescript
// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
```

## Middleware Protection

### 1. Route Protection
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('role')
      .eq('id', session?.user.id)
      .single()

    if (userError || userData?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Protect authenticated routes
  if (!session && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/profile/:path*'],
}
```

## User Management

### 1. User Creation/Update
```typescript
// lib/supabase/user.ts
export async function upsertUser(user: User) {
  const { data, error } = await supabase
    .from('User')
    .upsert({
      id: user.id,
      email: user.email,
      role: 'CUSTOMER', // Default role
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error upserting user:', error.message)
    return null
  }

  return data
}
```

## Security Considerations

### 1. Session Management
- Secure session handling
- Proper token storage
- Session expiration
- Refresh token rotation

### 2. Role-Based Access
- Default customer role
- Admin role verification
- Protected route handling
- Role-based UI rendering

### 3. Error Handling
- Authentication errors
- Session errors
- Role verification errors
- Network errors

## Testing Guidelines

### 1. Authentication Flow
- Sign in process
- Callback handling
- Session management
- Error scenarios

### 2. Protected Routes
- Admin access
- Customer access
- Unauthenticated access
- Role verification

### 3. User Management
- User creation
- Role assignment
- Profile updates
- Error handling
