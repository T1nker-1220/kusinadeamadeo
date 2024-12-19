# Phase 1: Complete Initial Setup & Authentication

## Overview
This document outlines the complete setup process and implementation details for Phase 1 of the Kusina De Amadeo web application.

## Table of Contents
1. [Project Setup](#step-1-project-setup)
2. [Database Schema](#step-2-database-schema-setup)
3. [Authentication Setup](#step-3-authentication-setup)
4. [Initial Files Setup](#step-4-initial-files-setup)
5. [Testing Setup](#step-5-testing-setup)
6. [Deployment Setup](#step-6-deployment-setup)
7. [Recent Changes & Fixes](#step-7-recent-changes--fixes)
8. [Best Practices & Guidelines](#step-8-best-practices--guidelines)
9. [Known Issues & Solutions](#step-9-known-issues--solutions)
10. [Maintenance & Updates](#step-10-maintenance--updates)

## Step 1: Project Setup

### 1.1 Create Next.js Project

```bash
# Create new project with all necessary configurations
npx create-next-app@latest ./ --typescript --tailwind --app --src-dir --import-alias "@/*" --use-npm

# Navigate to project directory
cd kusinadeamadeo

# Install essential dependencies
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js zod zustand next-themes class-variance-authority resend @types/node @types/react @types/react-dom
```

### 1.2 Project Structure Setup

```bash
# Create necessary directories
mkdir -p src/app/(auth)
mkdir -p src/app/(admin)
mkdir -p src/app/(store)
mkdir -p src/components/ui
mkdir -p src/lib/supabase
mkdir -p src/types
mkdir -p src/styles
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p public/images
```

### 1.3 Environment Setup

```bash
# Create environment file
touch .env.local

# Add environment variables
cat > .env.local << EOL
# Supabase Configuration
DATABASE_URL="your_database_url"
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_DATABASE_PASSWORD=your_database_password
NEXT_PUBLIC_PROJECT_ID=your_project_id

# OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_client_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Kusina de Amadeo"
NEXT_PUBLIC_BUSINESS_EMAIL=kusinadeamadeo@gmail.com
NEXT_PUBLIC_CONTACT_EMAIL=kusinadeamadeo@gmail.com
NEXT_PUBLIC_BUSINESS_PHONE="+63 960 508 8715"
NEXT_PUBLIC_BUSINESS_LANDLINE="(046) 890-9060"
NEXT_PUBLIC_BUSINESS_ADDRESS="107 i Purok 4 Dagatan, Amadeo, Cavite"
NEXT_PUBLIC_BUSINESS_MAPS_URL="https://maps.app.goo.gl/nYwvNFvRrAeyDLMG7"
NEXT_PUBLIC_BUSINESS_FACEBOOK_PAGE_URL="https://www.facebook.com/profile.php?id=100087753559758"

# Business Hours Configuration
NEXT_PUBLIC_STORE_HOURS_OPEN="05:00"
NEXT_PUBLIC_STORE_HOURS_CLOSE="23:00"
NEXT_PUBLIC_ORDER_HOURS_START="08:00"
NEXT_PUBLIC_ORDER_HOURS_END="22:00"
NEXT_PUBLIC_TIMEZONE="Asia/Manila"

# Order Constraints
NEXT_PUBLIC_MIN_PREORDER_HOURS=2
NEXT_PUBLIC_MAX_PREORDER_DAYS=7

# Payment Configuration
NEXT_PUBLIC_GCASH_NUMBER="09605088715"
NEXT_PUBLIC_GCASH_NAME="John Nathaniel Marquez"

# Image Configuration
NEXT_PUBLIC_MAX_IMAGE_SIZE=5242880 # 5MB in bytes
NEXT_PUBLIC_ALLOWED_IMAGE_TYPES=["image/jpeg", "image/png", "image/webp"]

# Resend Configuration
NEXT_PUBLIC_RESEND_EMAIL=kusinadeamadeo@gmail.com
RESEND_API_KEY=your_resend_api_key

# Vector Configuration
SUPABASE_VECTOR_HEALTH_CHECK_TIMEOUT=300
DOCKER_HOST=npipe:////.//pipe//docker_engine
DOCKER_BUILDKIT=1
COMPOSE_DOCKER_CLI_BUILD=1
EOL
```

## Step 2: Database Schema Setup

### 2.0 Supabase CLI Setup
```bash
# Install Supabase CLI globally
npm install -g supabase

# Initialize Supabase in your project
npx supabase init

# Login to Supabase CLI
npx supabase login

# Link your project
npx supabase link --project-ref your-project-ref

# Create migrations directory
mkdir -p supabase/migrations
```

### 2.1 Create Tables
```sql
-- migrations/20240112000000_initial_schema.sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_sign_in TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT valid_role CHECK (role IN ('admin', 'customer'))
);

-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id),
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create variants table
CREATE TABLE variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  price_adjustment DECIMAL(10,2) DEFAULT 0,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_type CHECK (type IN ('size', 'add_on', 'flavor'))
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  receipt_id TEXT UNIQUE NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  delivery_address TEXT,
  contact_number TEXT,
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  CONSTRAINT valid_payment_method CHECK (payment_method IN ('gcash', 'cash')),
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'paid', 'failed'))
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  variants JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Step 3: Authentication Setup

### 3.1 Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google OAuth API
4. Configure OAuth consent screen
5. Create OAuth 2.0 Client ID
6. Add authorized redirect URIs:
   - http://localhost:3000/auth/callback
   - https://your-production-domain.com/auth/callback

### 3.2 Setup Supabase Auth

1. Go to Supabase Dashboard > Authentication
2. Enable Google OAuth provider
3. Add Google OAuth credentials
4. Configure email templates

### 3.3 Authentication Components

```typescript
// src/app/auth/callback/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Create a new supabase client with the correct cookie store
    const supabase = createRouteHandlerClient({ 
      cookies
    })
    
    // Implementation details...
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL('/auth/error', request.url))
  }
}
```

### 3.4 Middleware Protection

```typescript
// src/middleware.ts
export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })

    // Implementation details...
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
```

## Step 4: Navigation System

### 4.1 Navigation Components

```typescript
// Navigation items configuration
const navItems = [
  {
    title: "Menu",
    href: "/menu",
  },
  {
    title: "Orders",
    href: "/orders",
    requiresAuth: true,
  },
]
```

### 4.2 Mobile Navigation

```typescript
// Mobile menu state management
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

// Close menu on route changes
useEffect(() => {
  setIsMobileMenuOpen(false)
}, [pathname])

// Prevent body scroll when menu is open
useEffect(() => {
  if (isMobileMenuOpen) {
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = "unset"
  }
}, [isMobileMenuOpen])
```

## Step 5: Image Configuration

### 5.1 Next.js Image Configuration

```javascript
// next.config.js
{
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blglkqttwesxmtbczvxd.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
    ],
  },
}
```

## Step 6: Recent Fixes & Changes

### 6.1 Authentication Fixes
- Fixed cookie handling in auth callback
- Improved session management
- Added proper error logging
- Fixed admin route protection
- Added user metadata handling

### 6.2 Navigation Improvements
- Implemented avatar-based mobile menu
- Added dropdown functionality
- Fixed menu item visibility
- Improved mobile responsiveness
- Added proper state management

### 6.3 Image Handling
- Fixed Google avatar loading
- Added image optimization
- Implemented proper fallbacks
- Added loading priority
- Fixed remote patterns

## Step 7: Best Practices & Guidelines

### 7.1 Code Organization
- Keep components small and focused
- Use TypeScript for type safety
- Follow the Single Responsibility Principle
- Implement proper error boundaries
- Use meaningful component and file names

### 7.2 Error Handling
```typescript
try {
  const { error } = await operation()
  if (error) throw error
} catch (error) {
  console.error('Context:', error)
  handleError(error)
}
```

### 7.3 State Management
```typescript
// Good
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<Error | null>(null)
const [data, setData] = useState<Data | null>(null)

// Bad
const [state, setState] = useState({
  isLoading: false,
  error: null,
  data: null,
})
```

## Step 8: Things to Avoid

### 8.1 Code Practices
❌ Don't write duplicate code
❌ Don't skip error handling
❌ Don't use any type
❌ Don't hardcode values
❌ Don't mix concerns

### 8.2 Security
❌ Don't expose API keys
❌ Don't store sensitive data in localStorage
❌ Don't trust user input
❌ Don't skip input validation
❌ Don't ignore security warnings

### 8.3 Performance
❌ Don't skip image optimization
❌ Don't ignore bundle size
❌ Don't skip lazy loading
❌ Don't block the main thread
❌ Don't ignore memory leaks

## Step 9: Testing Strategy

### 9.1 Unit Tests
```typescript
describe('Authentication', () => {
  it('should handle Google sign-in', async () => {
    // Test implementation
  })

  it('should protect admin routes', async () => {
    // Test implementation
  })
})
```

## Step 10: Maintenance & Updates

### 10.1 Regular Checks
- Monitor authentication logs
- Check navigation functionality
- Verify image loading
- Test mobile responsiveness
- Review error logs
- Update dependencies

### 10.2 Update Procedures
1. Test in development
2. Review changes
3. Update documentation
4. Deploy to staging
5. Verify functionality
6. Deploy to production
7. Monitor metrics

## Next Steps
Moving to Phase 2, we will focus on:
1. Product management system
2. Menu display components
3. Category management
4. Image handling
5. Admin dashboard features
