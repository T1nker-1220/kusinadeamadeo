# Authentication System Implementation - January 2024

## Overview
This document details the complete authentication system implementation for Kusina de Amadeo, using Google OAuth with Supabase and Next.js 14.

## Core Components

### 1. Authentication Provider
```typescript
// src/providers/auth-provider.tsx
"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";

export const AuthContext = createContext({
  user: null,
  isAdmin: false,
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // ... implementation details
}
```

### 2. Middleware Protection
```typescript
// src/middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const session = await supabase.auth.getSession();

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const { data: userData, error: userError } = await supabase
      .from("User")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userError || userData?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Protect authenticated routes
  if (
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/orders")
  ) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/orders/:path*"],
};
```

### 3. Authentication Flow
```typescript
// src/app/auth/callback/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
```

## Security Implementation

### 1. Role-Based Access Control (RBAC)
```typescript
// src/lib/auth.ts
export async function verifyAdmin(supabase: SupabaseClient) {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { data: userData, error: userError } = await supabase
    .from("User")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (userError || userData?.role !== "ADMIN") {
    throw new Error("Access denied");
  }

  return true;
}
```

### 2. Server-Side Protection
```typescript
// src/app/admin/page.tsx
export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies });

  try {
    await verifyAdmin(supabase);
  } catch (error) {
    redirect("/dashboard");
  }

  // Admin page content
}
```

### 3. Client-Side Protection
```typescript
// src/hooks/use-auth.ts
export function useAuth() {
  const { user, isAdmin } = useContext(AuthContext);

  const requireAuth = useCallback(() => {
    if (!user) {
      redirect("/auth/login");
    }
  }, [user]);

  const requireAdmin = useCallback(() => {
    if (!isAdmin) {
      redirect("/dashboard");
    }
  }, [isAdmin]);

  return { user, isAdmin, requireAuth, requireAdmin };
}
```

## RLS Policies

### 1. User Data Protection
```sql
-- Enable RLS
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Admin check function
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "User"
    WHERE "id"::text = auth.uid()::text
    AND "role" = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User policies
CREATE POLICY "Users can view own data" ON "User"
    FOR SELECT
    TO authenticated
    USING (
        id::text = auth.uid()::text
        OR
        auth.is_admin() = true
    );

CREATE POLICY "Users can update own data" ON "User"
    FOR UPDATE
    TO authenticated
    USING (id::text = auth.uid()::text);

CREATE POLICY "Admins have full access" ON "User"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);
```

### 2. Order Protection
```sql
CREATE POLICY "Users can view own orders" ON "Order"
    FOR SELECT
    TO authenticated
    USING (
        "userId"::text = auth.uid()::text
        OR
        auth.is_admin() = true
    );

CREATE POLICY "Users can create own orders" ON "Order"
    FOR INSERT
    TO authenticated
    WITH CHECK ("userId"::text = auth.uid()::text);
```

## Error Handling

### 1. Authentication Errors
```typescript
// src/lib/error-handlers.ts
export async function handleAuthError(error: Error) {
  console.error("Authentication error:", error);

  if (error.message === "Unauthorized") {
    redirect("/auth/login");
  }

  if (error.message === "Access denied") {
    redirect("/dashboard");
  }

  // Handle other errors
  return {
    error: "Authentication failed. Please try again.",
  };
}
```

### 2. Session Management
```typescript
// src/hooks/use-session.ts
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = useSupabaseClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return session;
}
```

## Security Best Practices

### 1. Session Management
- Secure cookie handling
- Session timeout configuration
- CSRF protection
- XSS prevention

### 2. Access Control
- Role-based routing
- Protected API routes
- Middleware verification
- Client-side guards

### 3. Data Protection
- RLS policies
- Input validation
- Output sanitization
- Error handling

## Monitoring & Maintenance

### 1. Security Monitoring
- Auth failure tracking
- Session monitoring
- Access pattern analysis
- Error logging

### 2. Regular Tasks
- Policy audits
- Permission reviews
- Security updates
- Performance monitoring

## Version Information
- Last Updated: January 16, 2024
- Status: Production Ready
- Auth Version: 1.0.0
- Next Review: Pre-Phase 2
