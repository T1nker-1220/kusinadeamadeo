{{ ... }}

# Cursor IDE Master Rules need to follow.

# KDA Food Store Project Structure

## Core Directories

```plaintext
kusinadeamadeo/
├── app/                   # Next.js 15.1.1 App Directory
│   ├── (auth)/            # Authentication Routes
│   │   ├── login/         # Google OAuth Login
│   │   └── register/      # New User Registration
│   │
│   ├── admin/             # Protected Admin Routes
│   │   ├── dashboard/     # Admin Dashboard
│   │   ├── categories/    # Category Management
│   │   ├── orders/        # Order Management
│   │   ├── products/      # Product Management
│   │   └── settings/      # Admin Settings
│   │
│   ├── (store)/           # Public Store Routes
│   │   ├── menu/          # Menu Display
│   │   ├── about/         # About Us
│   │   ├── contact/       # Contact Informations
│   │   ├── cart/         # Shopping Cart
│   │   ├── checkout/     # Order Processing
│   │   └── orders/       # Order Tracking
│   │
│   └── layout.tsx          # Root Layout

├── components/              # Reusable Components
│   ├── auth/               # Authentication Components
│   │   ├── GoogleButton.tsx    # Google Sign-in
│   │   └── AuthGuard.tsx       # Route Protection
│   │
│   ├── cart/               # Cart Components
│   │   ├── CartItem.tsx        # Cart Item Display
│   │   ├── CartSummary.tsx     # Order Summary
│   │   └── CartActions.tsx     # Cart Operations
│   │
│   ├── checkout/           # Checkout Components
│   │   ├── AddressForm.tsx     # Delivery Info
│   │   ├── PaymentMethod.tsx   # Payment Selection
│   │   └── OrderSummary.tsx    # Final Review
│   │
│   ├── menu/               # Menu Components
│   │   ├── ProductCard.tsx     # Product Display
│   │   ├── CategoryNav.tsx     # Category Navigation
│   │   └── ProductDetails.tsx  # Detailed View
│   │
│   ├── orders/             # Order Components
│   │   ├── OrderList.tsx       # Order History
│   │   ├── OrderItem.tsx       # Order Details
│   │   └── OrderStatus.tsx     # Status Display
│   │
│   └── ui/                 # UI Components
│       ├── Button.tsx          # Custom Buttons
│       ├── Input.tsx           # Form Inputs
│       ├── Modal.tsx           # Modal Windows
│       └── Loading.tsx         # Loading States
│       
├── lib/                    # Core Libraries
│   ├── supabase/          # Supabase Integration
│   │   ├── client.ts      # Supabase Client
│   │   ├── auth.ts        # Auth Functions
│   │   └── db.ts          # Database Functions
│   │
│   ├── utils/             # Utility Functions
│   │   ├── formatting.ts  # Data Formatting
│   │   ├── validation.ts  # Input Validation
│   │   └── helpers.ts     # Helper Functions
│   │
│   └── hooks/             # Custom Hooks
       ├── useAuth.ts      # Auth State
       ├── useCart.ts      # Cart Operations
       └── useOrders.ts    # Order Management

├── public/                 # Static Assets
│   ├── images/            # Image Assets
│   │   ├── products/     # Product Images
│   │   ├── logo.png      # Site Logo
│   │   └── icons/        # UI Icons
│   │
│   └── locales/          # Translations
       ├── en.json        # English
       └── fil.json       # Filipino

├── styles/                # Styling
│   ├── globals.css       # Global Styles
│   └── components/       # Component Styles

└── config/               # Configuration
    ├── site.ts          # Site Config
    ├── menu.ts          # Menu Config
    └── constants.ts     # Constants
```

## Key Configuration Files

```plaintext
├── .env.local            # Environment Variables
├── next.config.js        # Next.js Config
├── tailwind.config.js    # Tailwind CSS Config
├── tsconfig.json         # TypeScript Config
└── package.json         # Dependencies
```

## Tech Stack

## Frontend Technologies

- Framework: Next.js 13+
- Language: TypeScript
- UI Framework: React
- Styling:
  - Tailwind CSS
  - CSS Modules
- State Management:
  - React Context API
  - Custom Hooks
- Form Handling:
  - React Hook Form
  - Zod validation

## Backend Technologies

- Database: Supabase (PostgreSQL)
- Authentication:
  - Supabase Auth
  - Google OAuth
  - Admin email: kusinadeamadeo@gmail.com
- Storage:
  - Supabase Storage
  - Bucket: product-images
- Email Service:
  - Resend API
  - Email templates
  - Order notifications

## Payment Integration

- GCash Express Send
  - Account: 09605088715
  - Name: John Nathaniel Marquez
- Cash on Pickup
  - Store location verification
  - Manual confirmation

## APIs and Services

- Supabase:
  - REST API
  - Real-time subscriptions
  - Row Level Security (RLS)
- Google OAuth API
- Resend Email API
- Facebook Messenger Integration

## Development Tools

- Version Control: Git
- Package Manager: npm/yarn
- Code Quality:
  - ESLint
  - Prettier
  - TypeScript strict mode
- Testing:
  - Jest
  - React Testing Library

## Build & Deployment

- Platform: Vercel
- Environment:
  - Development
  - Production
- CI/CD: Vercel Pipeline
- Analytics: Vercel Analytics

## Security Measures

- Google OAuth authentication
- Email-based role verification
- Input sanitization
- XSS protection
- CSRF prevention
- Secure environment variables

## Performance Optimization

- Image optimization
- Code splitting
- Lazy loading
- API caching
- CDN delivery

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript
- Responsive design
- Mobile-first approach

## Monitoring & Logging

- Error tracking
- Performance monitoring
- User analytics
- Order tracking system

## Additional Features

- Receipt ID generation system
- Real-time order updates
- Manual delivery coordination
- Bilingual support (English/Filipino)
- Timezone handling (Asia/Manila)

> **IMPORTANT: Development Guidelines**
>
> 1. Do not duplicate features that are already implemented (files, folders, components, or other features) to avoid conflicting functionalities.
> 2. Always check existing implementations before creating new ones.
> 3. Follow the established patterns and conventions throughout the project.
> 4. Maintain consistency with the existing codebase.
> 5. When in doubt, refer to existing implementations as examples.
> 6. Write clean, self-documenting code.
> 7. Optimize code for performance where possible.
> 8. Use descriptive variable names.
> 9. Break up long functions into smaller, more manageable pieces.
> 10. Document code with JSDoc if necessary.
> 11. Document components with Storybook if necessary.
> 12. Use existing functions and utilities before writing custom code.
> 13. Do not hard-code values; use constants and environment variables instead.
> 14. Include comments explaining the purpose of functions, components, and utilities.
> 15. Use the same naming conventions throughout the codebase.
> 16. Use the same coding style throughout the codebase.
> 17. Avoid using global state and singletons.
> 18. Use the smallest possible scope for variables and functions.
> 19. Document any workarounds or hacks used in the code.
> 20. Test code thoroughly before committing.
> 21. Tell me if the generated chat is required to use the claude 3.5 sonnet model.
> 22. Everytime creating a sql for supabase migrations you need to migrate it using terminal only, you need remote cli all of the supabase.
> 23. Everytime we proceed to the next part in current phase you need to update the phase (current) documentation.
> 24. Make sure if you are testing the implemented feature you need to update the others and avoid the possible problems and errors.
> 25. You can run the test now but make sure to maintain the functionality of the existing features I don't want you to ruin it okay so be careful.
> 26. You will not duplicate the same file functionality by creating a different types of file, example of
> 
> 
> 
> 
> 
> 
> 
> 
> 
> 

> **Terminal Usage**
>
> Whenever running the terminal, make sure to use the Windows user powershell as the default shell. To do this, run the following command:

## 1. Business Information

- Location: 107 i Purok 4 Dagatan, Amadeo, Cavite
- Contact Details:
  - Mobile: +63 960 508 8715
  - Landline: (046) 890-9060
  - Email: kusinadeamadeo@gmail.com
- Operating Hours (Asia/Manila):
  - Store: 5:00 AM to 11:00 PM (daily)
  - Order Processing: 8:00 AM to 10:00 PM
  - Pickup: 5:00 AM to 10:00 PM

## 2. Authentication System Rules

- Implement single Google OAuth sign-in
- Admin email: `kusinadeamadeo@gmail.com`
- Simple routing:
  - Admin → `/admin/dashboard`
  - Customers → `/store`
- Use Supabase's built-in session management
- No complex custom implementations

## 3. Order System Rules

- Receipt ID Format:
  - Pattern: `[A-Z]{2}[0-9]{2}`
  - Examples: AE20, BF15, XY99
  - Must be unique and auto-generated
- Required Customer Information:
  - Valid Philippine phone number (09XX or +639XX)
  - Complete delivery address
  - Google account email
  - Full name
- Pre-order Rules:
  - Minimum lead time: 2h
  - Maximum advance booking: 7d
  - Operating window: 8 AM - 10 PM (Manila Time)

## 4. Payment System Rules

- GCash Express Flow:
  - Account: 09605088715
  - Name: John Nathaniel Marquez
  - Requirements:
    - Screenshot of payment confirmation
    - Valid GCash reference number (13 characters)
    - Payment proof via Messenger
- Cash Payment:
  - In-store only
  - Manual admin confirmation

## 5. Menu System Rules

### Product Categories

1. Main Dishes
2. Side Dishes
3. Beverages
4. Desserts
5. Special Orders

### Product Information Requirements

- Name
- Description
- Base Price
- Available Variants
- Category
- Availability Status
- Image

### Display Rules

- Clear images
- Name and price
- Variant options
- Add to cart functionality
- Navigation:
  - Horizontal menu
  - Category filters
  - Search function

## 6. Cart System Rules

- Features:
  - Item list
  - Quantity adjusters
  - Remove options
  - Total calculation
- Management:
  - Edit quantities
  - Remove items
  - Update add-ons
  - View details

## 7. Email Notification Rules

- Use Resend API
- Customer notifications:
  - Order confirmation
  - Status updates
  - Delivery confirmation
  - Receipt ID
- Admin notifications:
  - New orders
  - Delivery info
  - Payment alerts
  - Tracking info

## 8. Design System Rules

### Path for Images

- Logo: `/public/images/logo.png`
- Product Images: `/public/images/products`
- Category Images: `/public/images/categories`
- Variant Images: `/public/images/variants`
- About Images: `/public/images/about`
- Images for other components: `/public/images/`

### Brand Identity

- Logo Requirements:
  - Minimum size: 32px height
  - Clear space: 1x logo height on all sides
  - Path: `/public/images/logo.png`

### Color System

```css
:root {
  /* Core Theme Colors */
  --brand-orange: #ff6b00;
  --brand-orange-light: #ff8534;
  --brand-orange-dark: #e65000;

  /* Surface Colors */
  --surface-primary: #121212;
  --surface-secondary: #1e1e1e;
  --surface-elevated: #2d2d2d;

  /* Text Colors */
  --text-primary: rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.87);
  --text-tertiary: rgba(255, 255, 255, 0.6);
}
```

### Typography System

- Font Families:
  - Display: 'Playfair Display'
  - Body: 'Inter'
  - Accent: 'Montserrat'
- Type Scale: Fluid typography with clamp()
- Line Heights:
  - Tight: 1.2
  - Normal: 1.5
  - Relaxed: 1.75

## 9. Development Guidelines

### Code Style

- TypeScript with Prettier and ESLint
- Max line length: 80 characters
- Indentation: 2 spaces
- Use single quotes
- Semicolons required

### Naming Conventions

- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case
- CSS Classes: kebab-case

### Git Workflow

- Branch Prefixes:
  - feature/
  - bugfix/
  - hotfix/
- Use conventional commits
- Required checks before merge

## 10. Testing Requirements

- Framework: Jest
- Coverage threshold: 80%
- Required test types:
  - Unit tests
  - Integration tests
  - E2E tests

## 11. Documentation Rules

- JSDoc required
- Type definitions required
- Code examples required
- Changelog maintenance
- Must-read files and Paths:
  - [./INSTRUCTION.md](../../../OneDrive/Documents/1ACode-WEBSITE/kusinadeamadeo/INSTRUCTION.md)
  - [./PLAN.md](../../../OneDrive/Documents/1ACode-WEBSITE/kusinadeamadeo/PLAN.md)
  - [./Informations(KDA).md](<../../../OneDrive/Documents/1ACode-WEBSITE/kusinadeamadeo/Informations(KDA).md>)
  - [./design-system.md](../../../OneDrive/Documents/1ACode-WEBSITE/kusinadeamadeo/design-system.md)
  - [./PHASE-1-COMPLETION.md](../../../OneDrive/Documents/1ACode-WEBSITE/kusinadeamadeo/PHASE-1-SETUP.md)
  - [./PHASE-2-UI-PRODUCTS.md](../../../OneDrive/Documents/1ACode-WEBSITE/kusinadeamadeo/PHASE-3-CART-ORDERS.md)
  - [./PHASE-3-ORDERING.md](../../../OneDrive/Documents/1ACode-WEBSITE/kusinadeamadeo/PHASE-3-CART-ORDERS.md)
  - [./PHASE-4-PAYMENT.md](../../../OneDrive/Documents/1ACode-WEBSITE/kusinadeamadeo/PHASE-4-ANALYTICS-OPTIMIZATION.md)
  - [./PHASE-5-MAINTENANCE-SCALING.md](../../../OneDrive/Documents/1ACode-WEBSITE/kusinadeamadeo/PHASE-1-SETUP.md)
  - [PHASE-6-DEPLOYMENT-PRODUCTION.md](../../../OneDrive/Documents/1ACode-WEBSITE/kusinadeamadeo/PHASE-6-DEPLOYMENT-PRODUCTION.md)
  - [./docs/PHASE-1-COMPLETION.md](../../../OneDrive/Documents/1ACode-WEBSITE/kusinadeamadeo/PHASE-1-SETUP.md)
  - [./docs/PHASE-2-DOCUMENTATION.md](../../../OneDrive/Documents/1ACode-WEBSITE/kusinadeamadeo/docs/PHASE-2-DOCUMENTATION.md)

### Design-System guidelines and best practices.

- The [./design-system.md](./design-system.md) is a comprehensive visual and interaction design guide for Kusina De Amadeo, defining brand identity, color system, typography, and UI component standards, with a focus on creating a cohesive, accessible, and performant design language that ensures consistent user experience across all application interfaces.
- Whenever you are creating a new components or other files or features you need to follow the design system.

### Instructions guidelines and best practices.

- The [./INSTRUCTION.md](./INSTRUCTION.md) serves as a comprehensive technical blueprint for implementing authentication, product management, and system architecture, providing detailed guidelines for Google OAuth integration, Supabase configuration, protected routing, performance optimization, and error handling strategies, with a focus on maintaining a simple, secure, and scalable web application architecture.

### Informations(KDA) guidelines and best practices.

- This [./Informations(KDA).md](<./Informations(KDA).md>) file contains all the informations related to Kusina de Amadeo (KDA) that is needed for the development of the website.
- If you need any informations from KDA, please check this file first before asking or searching anywhere else.

## 12. Security Measures

- Auth provider: Google OAuth
- Session duration: 24h
- API rules:
  - Rate limit: 100/minute
  - Timeout: 30s
  - Required headers:
    - Authorization
    - Content-Type
- Data protection:
  - Input sanitization
  - XSS prevention
  - CSRF protection
  - Encrypted customer data
  - Secure payment information
  - Protected admin access

## 13. Performance Standards

- Core Web Vitals targets:
  - LCP: 2.5s
  - FID: 100ms
  - CLS: 0.1
- Bundle size limits:
  - Initial load: 200kb
  - Image max size: 200kb
- Database rules:
  - Connection pool: 20-50
  - Daily backups
  - Point-in-time recovery enabled
- API response time target: < 500ms
- Page load time target: < 3s

## 14. Analytics Implementation

### Order Analytics

- Daily, weekly, and monthly tracking
- Popular items analysis
- Peak ordering time analysis
- Customer retention metrics
- Special order frequency tracking

### Customer Analytics

- User journey tracking
- Product popularity analysis
- Customer feedback system
- Return customer behavior analysis

## 15. Environment Variables

Required variables:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- DATABASE_URL
- NEXT_PUBLIC_GOOGLE_CLIENT_ID
- NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
- NEXT_PUBLIC_APP_URL
- NEXT_PUBLIC_APP_NAME
- NEXT_PUBLIC_BUSINESS_EMAIL
- NEXT_PUBLIC_CONTACT_EMAIL
- NEXT_PUBLIC_BUSINESS_PHONE
- NEXT_PUBLIC_BUSINESS_ADDRESS
- NEXT_PUBLIC_BUSINESS_MAPS_URL
- RESEND_API_KEY

## 16. Supabase Setup and Migration Rules

### Prerequisites

- PostgreSQL 17 installed locally
- Environment variables properly configured in `.env.local`
- Migration files in `supabase/migrations/` directory
- Seed files in `supabase/seed.sql`

### Database Credentials

Required credentials in `.env.local`:

```env
DATABASE_URL="postgresql://postgres.blglkqttwesxmtbczvxd:Angelicadino1220!?@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
NEXT_PUBLIC_SUPABASE_URL=https://blglkqttwesxmtbczvxd.supabase.co
SUPABASE_DATABASE_PASSWORD=Angelicadino1220!?
```

### Migration Process

1. Set Up Environment:

   ```bash
   cd your-project-directory
   ```

2. Run Migrations:

   ```bash
   $env:PGPASSWORD='Angelicadino1220!?'
   & 'C:\Program Files\PostgreSQL\17\bin\psql.exe' `
     -h aws-0-ap-southeast-1.pooler.supabase.com `
     -p 6543 `
     -U postgres.blglkqttwesxmtbczvxd `
     -d postgres `
     -f supabase/migrations/20241212143540_add_products_schema.sql
   ```

3. Run Seed Data:
   ```bash
   & 'C:\Program Files\PostgreSQL\17\bin\psql.exe' `
     -h aws-0-ap-southeast-1.pooler.supabase.com `
     -p 6543 `
     -U postgres.blglkqttwesxmtbczvxd `
     -d postgres `
     -f supabase/seed.sql
   ```

### Troubleshooting Guidelines

1. Access Denied Error:

   - Ensure using full username with project reference
   - Verify credentials in `.env.local`

2. Connection Issues:

   - Turn off VPN
   - Check internet connectivity
   - Verify port 6543 is accessible

3. Permission Issues:
   - Use service_role key
   - Check RLS policies
   - Verify user permissions

### Troubleshooting Best Practices

1. **Explain the Error**:
   - Provide clear and concise error messages
   - Avoid vague or generic error messages
   - Include relevant error codes and references
2. **No Error Creation**:
   - Follow instructions and requirements
   - Avoid creating potential errors
   - Verify implementation before committing

### Verification Steps

1. Check Supabase Dashboard Tables
2. Verify RLS Policies
3. Confirm data population
4. Test Storage Bucket permissions

### Security Rules

1. Environment Variables:

   - Never commit `.env.local` to version control
   - Keep credentials secure
   - Use environment variables for sensitive data

2. Database Access:

   - Use principle of least privilege
   - Implement proper RLS policies
   - Never expose service_role key
   - Regular security audits

3. Connection Requirements:
   - Use port 6543 for Supabase PostgreSQL
   - Include project ref in username
   - Secure password handling

### Maintenance Rules

1. Backup Requirements:

   - Regular database backups
   - Backup before migrations
   - Document backup procedures

2. Monitoring Requirements:
   - Check table creation success
   - Monitor RLS policy effectiveness
   - Track performance metrics
   - Log migration results

## What We Avoid

### 1. Code Practices
❌ Don't write duplicate code
❌ Don't skip error handling
❌ Don't use any type
❌ Don't hardcode values
❌ Don't mix concerns
❌ Don't ignore TypeScript errors
❌ Don't skip prop validation
❌ Don't use inline styles

### 2. Security
❌ Don't expose API keys
❌ Don't store sensitive data in localStorage
❌ Don't trust user input
❌ Don't skip input validation
❌ Don't use eval()
❌ Don't ignore security warnings
❌ Don't skip authentication
❌ Don't use weak passwords

### 3. Performance
❌ Don't skip image optimization
❌ Don't ignore bundle size
❌ Don't skip lazy loading
❌ Don't block the main thread
❌ Don't ignore memory leaks
❌ Don't skip error boundaries
❌ Don't ignore performance metrics
❌ Don't skip caching

### 4. User Experience
❌ Don't skip loading states
❌ Don't ignore mobile users
❌ Don't skip error messages
❌ Don't use confusing UI
❌ Don't ignore accessibility
❌ Don't skip form validation
❌ Don't use small touch targets
❌ Don't ignore user feedback


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

{{ ... }}
