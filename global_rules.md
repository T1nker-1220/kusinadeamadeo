# KDA Food Store Project Rules and Guidelines

## Core Project Structure
```plaintext
kusinadeamadeo/
├── app/                      # Next.js 13+ App Directory
│   ├── (auth)/              # Authentication Routes
│   │   ├── login/          # Google OAuth Login
│   │   └── register/       # New User Registration
│   │
│   ├── (dashboard)/         # Protected Admin Routes
│   │   ├── orders/        # Order Management
│   │   ├── products/      # Product Management
│   │   └── settings/      # Admin Settings
│   │
│   ├── (store)/            # Public Store Routes
│   │   ├── menu/         # Menu Display
│   │   ├── cart/         # Shopping Cart
│   │   ├── checkout/     # Order Processing
│   │   └── orders/       # Order Tracking
│   │
│   └── layout.tsx          # Root Layout

├── components/              # Reusable Components
│   ├── auth/               # Authentication Components
│   ├── cart/               # Cart Components
│   ├── checkout/           # Checkout Components
│   ├── menu/               # Menu Components
│   ├── orders/             # Order Components
│   └── ui/                 # UI Components

├── lib/                    # Core Libraries
│   ├── supabase/          # Supabase Integration
│   ├── utils/             # Utility Functions
│   └── hooks/             # Custom Hooks

├── public/                 # Static Assets
│   └── images/            # Image Assets

├── styles/                # Styling
└── config/               # Configuration
```

## 1. Core Development Principles

### Code Quality Standards
1. TypeScript Usage:
   - Strict type checking enabled
   - No 'any' types unless absolutely necessary
   - Proper interface and type definitions
   - Generics for reusable components
   - Type guards where needed

2. Component Architecture:
   - Single Responsibility Principle
   - Proper component composition
   - Clear prop interfaces
   - Memoization when beneficial
   - Pure functional components preferred

3. State Management:
   - Server state with React Query
   - UI state with React Context/Zustand
   - Form state with React Hook Form
   - Proper loading/error states
   - Optimistic updates

### Performance Standards
1. Core Web Vitals:
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1
   - TTI < 3.8s
   - FCP < 1.8s

2. Resource Optimization:
   - Image optimization with next/image
   - Code splitting and lazy loading
   - Bundle size monitoring
   - Tree shaking enabled
   - Proper caching strategies

## 2. Product Management System

### Database Architecture
1. Core Tables:
   ```sql
   products
   product_variants
   product_addons
   product_available_addons
   products_audit
   ```

2. Data Integrity:
   - UUID for all primary keys
   - TIMESTAMPTZ for all timestamps
   - Proper foreign key constraints
   - Check constraints for enums
   - RLS policies for security

### Product Categories
1. Budget Meals (₱35-₱60):
   - Base items with optional add-ons
   - Fixed price combinations
   - Add-on limitations
   - Combo meal options

2. Silog Meals (₱85-₱100):
   - Standard components
   - Rice and egg included
   - Protein options
   - Add-on compatibility

3. Ala Carte (₱20-₱60):
   - Individual items
   - Optional components
   - Customization options
   - Portion sizes

4. Beverages (₱29-₱39):
   - Size options (16oz/22oz)
   - Flavor variations
   - Add-on compatibility
   - Temperature options

5. Special Orders:
   - Bulk ordering rules
   - Custom combinations
   - Advance notice required
   - Special pricing rules

### Add-on System
1. Standard Add-ons:
   ```typescript
   const STANDARD_ADDONS = {
     siomai: { price: 5, limit: 3 },
     shanghai: { price: 5, limit: 3 },
     skinless: { price: 10, limit: 2 },
     egg: { price: 15, limit: 2 },
     hotdog: { price: 15, limit: 2 },
     extraSauce: { price: 5, limit: 3 }
   }
   ```

2. Add-on Rules:
   - Maximum combinations
   - Category compatibility
   - Price calculations
   - Availability checks

## 3. UI/UX Standards

### Component Guidelines
1. Product Display:
   - Clear hierarchy
   - Consistent spacing
   - Proper image loading
   - Price visibility
   - Action accessibility

2. Form Components:
   - Clear validation
   - Instant feedback
   - Mobile-friendly inputs
   - Error recovery
   - Success confirmation

### Mobile Optimization
1. Touch Interactions:
   - Minimum touch target: 44x44px
   - Proper touch feedback
   - Gesture support
   - Bottom navigation
   - Pull-to-refresh

2. Responsive Design:
   - Mobile-first approach
   - Fluid typography
   - Breakpoint system
   - Layout shifts prevention
   - Touch-friendly controls

## 4. Security Implementation

### Authentication
1. Google OAuth:
   - Single sign-in flow
   - Role-based access
   - Session management
   - Secure token handling
   - Automatic refresh

2. Admin Access:
   - Email verification
   - Role verification
   - Action logging
   - Session timeouts
   - Security headers

### Data Protection
1. Database Security:
   - RLS policies
   - Input sanitization
   - Query optimization
   - Backup strategy
   - Audit logging

2. API Security:
   - Rate limiting
   - CORS policies
   - Request validation
   - Error handling
   - Logging strategy

## 5. Testing Requirements

### Test Coverage
1. Unit Tests:
   - Component rendering
   - Business logic
   - Utility functions
   - Hooks behavior
   - State management

2. Integration Tests:
   - User flows
   - API integration
   - State persistence
   - Error scenarios
   - Edge cases

### Quality Assurance
1. Code Quality:
   - Linting rules
   - Type checking
   - Code formatting
   - Documentation
   - Performance metrics

2. Manual Testing:
   - Cross-browser testing
   - Mobile device testing
   - Performance testing
   - Security testing
   - Accessibility testing

## 6. Documentation Standards

### Code Documentation
1. Component Documentation:
   - Purpose and usage
   - Props interface
   - Example usage
   - Edge cases
   - Performance considerations

2. API Documentation:
   - Endpoint descriptions
   - Request/response formats
   - Error handling
   - Authentication requirements
   - Rate limits

### Project Documentation
1. Setup Instructions:
   - Environment setup
   - Dependencies
   - Configuration
   - Development workflow
   - Deployment process

2. Maintenance Guides:
   - Database migrations
   - Backup procedures
   - Monitoring setup
   - Error handling
   - Performance optimization

## What We Avoid

### Code Quality
❌ Duplicate code or functionality
❌ Unclear type definitions
❌ Prop drilling beyond 2 levels
❌ Complex state management
❌ Unnecessary re-renders

### Security
❌ Exposed credentials
❌ Insecure data storage
❌ Missing input validation
❌ Weak authentication
❌ Unhandled errors

### Performance
❌ Unoptimized images
❌ Large bundle sizes
❌ Blocking operations
❌ Memory leaks
❌ Poor error boundaries

### User Experience
❌ Confusing navigation
❌ Poor accessibility
❌ Inconsistent UI
❌ Missing feedback
❌ Unresponsive design


# Authentication Implementation Instructions

## Basic Google OAuth Implementation

### Overview

Keep authentication as simple as possible while maintaining security. Use a single Google OAuth sign-in for both admin and customers.

### Key Requirements

1. Single sign-in button for all users
2. Admin access only for email: kusinadeamadeo@gmail.com
3. All other Google accounts are customer accounts
4. No complex database roles or verification systems

### Implementation Guidelines

#### 1. Authentication Flow

- Use single "Sign in with Google" button
- After sign-in, check email address
- If email matches admin email → admin access
- All other emails → customer access
- Redirect admin to admin dashboard
- Redirect customers to main store page

#### 2. Session Handling

- Use Supabase's built-in session management
- Don't create custom session handling
- Don't add complex token management

#### 3. Protected Routes

- Admin pages: Check if user email matches admin email
- If not admin email → redirect to home page
- Customer pages: Only check if user is logged in

#### 4. What to Avoid

- Don't create separate login pages for admin/customer
- Don't implement complex role systems
- Don't add additional verification layers
- Don't create custom session management
- Don't add complex database role structures

### Important Notes

- Keep the implementation basic but functional
- Focus on core functionality over complex features
- Use built-in Supabase features whenever possible
- Maintain security through simple email verification


# Order System Instructions

## Customer Information Requirements

### Delivery Address
- Collect complete delivery address
- No automated delivery scheduling
- Manual delivery handling by admin

### Order Processing
1. Customer provides:
   - Contact information
   - Delivery address
   - Order details
   - Payment proof

2. Admin handles:
   - Order confirmation
   - Manual delivery coordination
   - Order status updates

## Receipt ID Generation

### Format Specification
- Pattern: 2 letters followed by 2 numbers (e.g., AE20)
- Letters: Uppercase A-Z only
- Numbers: 0-9 only
- Total length: 4 characters
- Examples: AE20, BF15, XY99

### Generation Rules
- Auto-generate on successful order
- Must be unique for each order
- Random generation within format
- No special characters allowed

## Payment Flow

### GCash Express Send Flow
1. Customer selects GCash payment
2. System displays GCash account details
3. Customer makes payment via GCash Express Send
4. System redirects to Facebook Messenger
5. Customer sends proof via Messenger
6. Admin verifies payment manually
7. System generates receipt ID (e.g., AE20)
8. Order confirmed with receipt ID

### Cash Payment Flow
1. Customer selects cash payment
2. System displays store address and hours
3. Customer visits store for payment
4. Admin confirms payment in-person
5. System generates receipt ID (e.g., BF15)
6. Order processed with receipt ID

## Email Notifications (Resend API)

### Overview
Simple email notification system using Resend API for order updates.

### Key Requirements
1. Customer receives:
   - Order confirmation email with order details
   - Order status updates
   - Delivery address confirmation
   - Generated receipt ID (e.g., AE20)

2. Admin receives:
   - New order notification with customer details
   - Delivery address for manual processing
   - Payment confirmation alerts
   - Receipt ID for order tracking

### Implementation Guidelines

#### 1. Email Notifications
- Send order confirmation to customer
- Send new order alert to admin
- Include delivery address in notifications
- Keep email templates simple
- Include receipt ID in all notifications

#### 2. Real-time Notifications
- Show new orders in admin dashboard
- Display order status for customers
- Include delivery address in order details
- Keep notification content minimal
- Display receipt ID in order details

#### 3. What to Avoid
- Don't implement delivery scheduling
- Don't add delivery time calculations
- Don't create automated delivery systems
- Keep the system manual and simple

### Important Notes
- Focus on collecting accurate delivery information
- Maintain simple order status updates
- Let admin handle delivery manually
- Keep all systems basic but functional
- Receipt IDs are generated only after successful order
- IDs must be clearly displayed in all communications
- Keep format consistent: 2 letters + 2 numbers
- IDs should be easily readable and memorable


# Menu and Cart System

## Menu Page Design

### Product Display
1. Product Cards
   - Clear product images
   - Product name and price
   - Basic variant indicators
   - Add to cart button
   - Simple loading state

2. Category Navigation
   - Horizontal category menu
   - Simple category filters
   - Basic search function

3. Product Variants
   - Size selection (if applicable)
   - Flavor options (if applicable)
   - Basic add-ons
   - Price updates on selection

### Product Details
1. Basic Information
   - Product description
   - Available variants
   - Basic nutritional info
   - Preparation time

2. Customization Options
   - Simple size selection
   - Flavor choices
   - Basic add-ons list
   - Quantity selector

## Cart Page Design

### Cart Features
1. Cart Overview
   - Clear item list
   - Quantity adjusters
   - Remove item option
   - Total calculation

2. Item Management
   - Edit quantities
   - Remove items
   - Update add-ons
   - View item details

3. Cart Summary
   - Subtotal
   - Number of items
   - Basic order notes
   - Checkout button

### Mobile Optimization
1. Basic Features
   - Responsive design
   - Simple animations
   - Touch-friendly buttons
   - Easy navigation

2. Performance
   - Basic image optimization
   - Simple loading states
   - Cart data persistence

### Important Notes
- Keep interface clean and simple
- Focus on essential features
- Ensure mobile responsiveness
- Maintain good performance
- Test on common devices

## Mobile-First Development Instructions

### Required for All New Features

1. **Mobile Design Implementation**
   - Use the mobile-first design system components
   - Follow touch-friendly interaction patterns
   - Implement responsive layouts using mobile-container
   - Test on mobile devices before desktop

2. **Performance Requirements**
   - Optimize all images for mobile
   - Keep JavaScript bundles minimal
   - Implement lazy loading where appropriate
   - Use efficient animations from design system

3. **Component Usage**
   - Use mobile-card for product displays
   - Implement list-item for order lists
   - Apply mobile-input for form fields
   - Use bottom-sheet for complex forms

4. **Testing Checklist**
   - Verify touch targets are at least 44px
   - Test swipe gestures where implemented
   - Check bottom navigation accessibility
   - Validate form usability on mobile

### Implementation Steps

1. **New Feature Setup**
   - Start with mobile layout first
   - Use mobile-specific components
   - Implement touch interactions
   - Add desktop enhancements last

2. **Quality Assurance**
   - Test on multiple mobile devices
   - Verify performance metrics
   - Check gesture interactions
   - Validate responsive behavior

## Admin Interface Instructions

### Setup and Implementation

1. **Dashboard Implementation**
   - Use admin-layout component for base structure
   - Implement stats-card for metrics display
   - Add quick-actions for common tasks
   - Keep layout simple and functional

2. **Order Management**
   - Use order-card component for each order
   - Implement swipe actions for quick updates
   - Add status filters at the top
   - Keep critical actions easily accessible

3. **Menu Management**
   - Use admin-list-item for menu items
   - Implement quick edit actions
   - Keep image upload simple
   - Use mobile-optimized forms

4. **Mobile Navigation**
   - Implement admin-nav component
   - Keep navigation items to 4 max
   - Use clear icons for each section
   - Ensure touch-friendly targets

### Best Practices

1. **Performance**
   - Lazy load order history
   - Optimize image uploads
   - Cache frequently accessed data
   - Minimize network requests

2. **Usability**
   - Keep critical actions at thumb reach
   - Use clear status indicators
   - Provide immediate feedback
   - Maintain simple workflows

3. **Testing**
   - Test all actions on mobile
   - Verify quick actions work
   - Check notification system
   - Validate form submissions

## Supabase Storage Setup Instructions

### Initial Setup

1. **Create Storage Bucket**
   ```sql
   -- In Supabase Dashboard
   1. Go to Storage section
   2. Click "Create new bucket"
   3. Name it "product-images"
   4. Enable public access
   ```

2. **Install Dependencies**
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Environment Setup**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

### Basic Implementation

1. **Supabase Client Setup**
   ```typescript
   import { createClient } from '@supabase/supabase-js'

   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   )
   ```

2. **Upload Function**
   ```typescript
   const uploadImage = async (file: File, path: string) => {
     const { data, error } = await supabase.storage
       .from('product-images')
       .upload(`${path}/${file.name}`, file)
     
     if (error) throw error
     return data
   }
   ```

3. **Display Image**
   ```typescript
   const getImageUrl = (path: string) => {
     const { data } = supabase.storage
       .from('product-images')
       .getPublicUrl(path)
     
     return data.publicUrl
   }
   ```

### Usage Examples

1. **Product Image Upload**
   ```typescript
   // In your admin component
   const handleUpload = async (file: File) => {
     try {
       const path = 'menu-items'
       const { data } = await uploadImage(file, path)
       const imageUrl = getImageUrl(data.path)
       // Update product with new image URL
     } catch (error) {
       console.error('Upload failed:', error)
     }
   }
   ```

2. **Image Display**
   ```typescript
   // In your product component
   const ProductImage = ({ path }: { path: string }) => {
     const imageUrl = getImageUrl(path)
     return (
       <Image
         src={imageUrl}
         alt="Product"
         width={300}
         height={200}
         loading="lazy"
       />
     )
   }
   ```

### Security Rules

1. **Bucket Policies**
   ```sql
   -- Allow public read access
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING ( bucket_id = 'product-images' );

   -- Allow authenticated uploads
   CREATE POLICY "Authenticated Upload"
   ON storage.objects FOR INSERT
   TO authenticated
   USING ( bucket_id = 'product-images' );
   ```

2. **File Validation**
   ```typescript
   const validateFile = (file: File) => {
     const MAX_SIZE = 5 * 1024 * 1024 // 5MB
     const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
     
     if (!ALLOWED_TYPES.includes(file.type)) {
       throw new Error('Invalid file type')
     }
     
     if (file.size > MAX_SIZE) {
       throw new Error('File too large')
     }
   }
   ```

## Simplified Security Setup

### 1. Basic Authentication Setup
```typescript
// lib/auth.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Admin Google sign in
export const signInAsAdmin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/admin/dashboard`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    }
  })
  return { data, error }
}

// Simple admin check
export const isAdmin = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
}
```

### 2. Environment Setup
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_ADMIN_EMAIL=your_google_email@gmail.com
```

### 3. Admin Login Component
```typescript
// components/AdminLogin.tsx
export const AdminLogin = () => {
  return (
    <button
      onClick={() => signInAsAdmin()}
      className="btn-primary"
    >
      Admin Login with Google
    </button>
  )
}
```

### 4. Route Protection
```typescript
// middleware.ts
export async function middleware(req) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const supabase = createMiddlewareClient({ req, res })
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  return NextResponse.next()
}
```

### 5. Supabase Setup
```sql
-- Allow only specific Google account
CREATE POLICY "Admin access"
ON public.products
FOR ALL USING (
  auth.jwt() ->> 'email' = current_setting('app.admin_email')
);
```

## Project Setup Instructions

### 1. Initial Setup
```bash
# Create Next.js project with latest version
npx create-next-app@latest kdastore --typescript --tailwind --eslint

# Navigate to project
cd kdastore

# Install core dependencies
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js
npm install zod zustand next-themes class-variance-authority
```

### 2. Configuration Files

1. **next.config.js**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
```

2. **tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Your brand colors
      },
    },
  },
  plugins: [],
}
```

3. **tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 3. Project Structure Setup
```bash
# Create necessary directories
mkdir -p src/{app,components/{ui,features},lib,types,hooks,store,styles}

# Create initial files
touch src/lib/supabase.ts
touch src/types/index.ts
touch src/store/index.ts
touch src/styles/globals.css
```

### 4. Environment Setup
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Version Control
```bash
# Initialize git
git init

# Create .gitignore
echo "node_modules
.next
.env*.local
.vercel
*.log" > .gitignore

# Initial commit
git add .
git commit -m "Initial project setup"
```

## Customer Authentication Setup

### Customer Google Sign-in with Auto Profile Creation
```typescript
// lib/auth.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Customer Google sign in with auto profile
export const signInWithGoogleAndCreateProfile = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/menu`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    }
  })

  if (!error && data) {
    // Auto create/update profile
    await createOrUpdateProfile(data.user)
  }

  return { data, error }
}

// Auto create/update profile
const createOrUpdateProfile = async (user) => {
  const { data, error } = await supabase
    .from('customers')
    .upsert({
      google_id: user.id,
      email: user.email,
      name: user.user_metadata.full_name,
      avatar_url: user.user_metadata.avatar_url,
      last_login: new Date().toISOString(),
    }, {
      onConflict: 'google_id',
      returning: true,
    })

  return { data, error }
}
```

### Database Setup
```sql
-- Create customers table
CREATE TABLE customers (
  google_id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Create orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id TEXT REFERENCES customers(google_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  details JSONB,
  delivery_info JSONB,
  payment_status TEXT
);
```

### Customer Login Component
```typescript
// components/CustomerLogin.tsx
export const CustomerLogin = () => {
  return (
    <button
      onClick={() => signInWithGoogleAndCreateProfile()}
      className="btn-primary"
    >
      Continue with Google
    </button>
  )
}
```

### Automatic Redirect Middleware
```typescript
// middleware.ts
export async function middleware(req) {
  if (req.nextUrl.pathname === '/login') {
    const supabase = createMiddlewareClient({ req, res })
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      // Already logged in, redirect to menu
      return NextResponse.redirect(new URL('/menu', req.url))
    }
  }
  return NextResponse.next()
}
```

### Profile Data Hook
```typescript
// hooks/useProfile.ts
export const useProfile = () => {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data } = await supabase
            .from('customers')
            .select('*')
            .eq('google_id', session.user.id)
            .single()
          
          setProfile(data)
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return profile
}
```

## Essential Features Implementation

```typescript
// 1. Form Validation Component
import { z } from 'zod'
import { useState } from 'react'

export const OrderForm = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (data) => {
    try {
      setLoading(true)
      // Validate
      orderSchema.parse(data)
      // Submit order
      await submitOrder(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      {loading && <LoadingSpinner />}
      {/* Form fields */}
    </form>
  )
}

// 2. Optimized Image Component
import Image from 'next/image'

export const MenuImage = ({ src, alt }) => (
  <div className="relative h-48 w-full">
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 33vw"
      priority={false}
      loading="lazy"
    />
  </div>
)

// 3. Loading States
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin h-5 w-5 border-2 border-primary" />
  </div>
)

// 4. Basic Error Boundary
export class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please try again.</div>
    }
    return this.props.children
  }
}
```

### Usage Instructions

1. **Form Validation**
   - Import `zod` for validation
   - Use `OrderForm` component for orders
   - Handle errors with error messages

2. **Image Optimization**
   - Use `MenuImage` component
   - Provide src and alt props
   - Images lazy load by default

3. **Loading States**
   - Use `LoadingSpinner` during:
     * Menu loading
     * Order processing
     * Payment confirmation

4. **Error Handling**
   - Wrap main components in `ErrorBoundary`
   - Show user-friendly error messages
   - Log errors for debugging

# Database Maintenance Instructions

## Regular Maintenance Tasks

### Daily Tasks
1. Check database status: `npm run db:status`
2. Review connection pool usage
3. Monitor active queries and performance

### Weekly Tasks
1. Update TypeScript types: `npm run db:types`
2. Pull latest schema changes: `npm run db:pull`
3. Review slow queries and optimize if needed
4. Check table sizes and growth rates

### Monthly Tasks
1. Run database vacuum: `npm run db:vacuum`
2. Perform full backup: `npm run db:backup`
3. Review and clean up unused resources
4. Check and optimize indexes

## Monitoring Guidelines

### Connection Pool
- Monitor connection usage (20-50 limit)
- Alert if connections exceed 80% of pool
- Review and optimize long-running connections

### Performance Metrics
- Track query performance and cache hit ratio
- Monitor slow queries (>1s execution time)
- Review and optimize table sizes
- Check dead tuple accumulation

### Backup Verification
- Verify daily automatic backups
- Test backup restoration quarterly
- Maintain point-in-time recovery capability
- Document backup and restore procedures

## Implementation Instructions

1. **Authentication System**

### Google OAuth Implementation
- Use single sign-in button for all users
- Admin access: kusinadeamadeo@gmail.com
- All other accounts are customers
- Use Supabase Auth with Google provider

### Session Management
- Use Supabase's built-in session handling
- Store session in secure HTTP-only cookies
- Implement session refresh mechanism
- Handle session expiry gracefully

### Protected Routes
- Admin routes: /admin/*
- Customer routes: /orders/*, /account/*
- Public routes: /, /menu, /contact
- Implement middleware for route protection

## 2. Order System

### Customer Information Collection
1. Required Fields:
   - Full Name
   - Contact Number (Philippine format)
   - Complete Delivery Address
   - Email (from Google Auth)
   - Special Instructions (optional)

2. Validation Rules:
   - Phone: Valid Philippine format (09XX or +639XX)
   - Address: Must be within delivery area
   - Email: Must match Google account

### Order Processing Flow
1. Customer Actions:
   - Select items and variants
   - Add to cart
   - Review order
   - Choose payment method
   - Provide delivery information
   - Submit order

2. System Processing:
   - Validate order details
   - Check operating hours
   - Generate unique receipt ID
   - Create order record
   - Send confirmation email
   - Redirect to payment

3. Admin Actions:
   - Review new orders
   - Verify payment
   - Update order status
   - Manage delivery
   - Send status updates

## 3. Payment System

### GCash Integration
1. Customer Flow:
   - Select GCash payment
   - View account details:
     * Number: 09605088715
     * Name: John Nathaniel Marquez
   - Make payment via GCash app
   - Click "Submit Payment Proof"
   - Redirect to Messenger
   - Send screenshot with order ID

2. Admin Verification:
   - Review payment proof
   - Match amount and reference
   - Update payment status
   - Trigger order confirmation
   - Send receipt email

### Cash Payment
1. Store Details:
   - Location: 107 i Purok 4 Dagatan, Amadeo, Cavite
   - Hours: 5:00 AM to 11:00 PM
   - Contact: (046) 890-9060

2. Process:
   - Customer selects cash payment
   - System displays store details
   - Customer pays in-store
   - Admin marks as paid
   - System generates receipt

## 4. Receipt System

### ID Generation Rules
1. Format: LLNN
   - LL: Two uppercase letters (A-Z)
   - NN: Two numbers (0-9)
   - Examples: AE20, BF15, XY99

2. Implementation:
   - Generate on order creation
   - Verify uniqueness
   - Store with order record
   - Include in all communications

### Usage Guidelines
- Include in all order communications
- Display prominently in admin dashboard
- Use for order tracking
- Required for payment verification

## 5. Product Management

### Category Structure
1. Main Categories:
   - Budget Meals (₱35-₱60)
   - Silog Meals (₱85-₱100)
   - Ala Carte (₱20-₱60)
   - Beverages (₱29-₱39)
   - Special Orders (Bulk Orders)

2. Product Fields:
   - Name (required)
   - Description (required)
   - Base Price (if applicable)
   - Category (required)
   - Image URL (required)
   - Availability Status (required)
   - Variants (if applicable)
   - Add-ons (if applicable)

### Variant System
1. Types:
   - Size Options (e.g., Coke Float: 16oz/22oz)
   - Add-ons (e.g., Siomai, Shanghai, Skinless, Egg)
   - Flavor Options (e.g., Waffle: Chocolate/Cheese/Hotdog)
   - Special Requests (for bulk orders)

2. Pricing Rules:
   - Base Price Products:
     * Fixed price items (e.g., Hotsilog: ₱60)
     * Range price items (e.g., Chaofan: ₱45-₱50)
   
   - No Base Price Products (Variant-based):
     * Size-based pricing (e.g., Coke Float: 16oz ₱29, 22oz ₱39)
     * Flavor-based pricing (e.g., Waffle variants all ₱15)
     * Type-based pricing (e.g., Siomai variants all ₱5)

3. Add-on Pricing:
   - Siomai (+₱5)
   - Shanghai (+₱5)
   - Skinless (+₱10)
   - Egg (+₱15)
   - Hotdog (+₱15)
   - Extra Sauce (+₱5)

### Image Management
1. Directory Structure:
   - Main Product Images: `/public/images/products/`
   - Variant Images: `/public/images/variants/`
   - Category Images: `/public/images/categories/`

2. Naming Convention:
   - Products: `productname.jpg` (e.g., hotsilog.jpg)
   - Variants: `variantname.jpg` (e.g., siomai.jpg)
   - Categories: `category-name.jpg` (e.g., budget-meals.jpg)

### Special Handling

1. Budget Meals:
   - Base items with optional add-ons
   - Clear pricing for each add-on
   - Combination rules for add-ons

2. Beverages:
   - Size-based variants (16oz/22oz)
   - Flavor options with fixed prices
   - Clear size and flavor combinations

3. Special Orders:
   - Bulk order capabilities
   - Custom combinations
   - Special pricing rules
   - Add-on quantity tracking

### Product Display Rules

1. Menu Organization:
   - Group by category
   - Sort by popularity within category
   - Clear variant indicators
   - Visible add-on options

2. Price Display:
   - Show base price if applicable
   - Display variant prices clearly
   - List all add-on costs
   - Indicate bulk order pricing

3. Availability:
   - Real-time stock status
   - Time-based availability
   - Special order lead times
   - Seasonal item indicators

## 6. Operating Hours

### Business Hours
- Store Hours: 5:00 AM - 11:00 PM
- Order Processing: 8:00 AM - 10:00 PM
- Pickup Hours: 5:00 AM - 10:00 PM
- Timezone: Asia/Manila

### Order Rules
- Minimum Lead Time: 2 hours
- Maximum Advance: 7 days
- No orders outside processing hours
- Special hours for holidays

## 7. Email Notifications

### Required Notifications
1. Order Related:
   - Order confirmation
   - Payment received
   - Order status updates
   - Delivery information

2. Admin Alerts:
   - New order notification
   - Payment verification needed
   - Order status changes
   - Daily order summary

### Implementation
- Use Resend API
- Include receipt ID in all emails
- Professional templates
- Mobile-responsive design
