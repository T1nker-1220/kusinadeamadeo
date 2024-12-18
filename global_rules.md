{{ ... }}

# Cursor IDE Master Rules need to follow.

# KDA Food Store Project Structure

## Core Directories

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
       ├── Button.tsx          # Custom Buttons
       ├── Input.tsx           # Form Inputs
       ├── Modal.tsx           # Modal Windows
       └── Loading.tsx         # Loading States

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

{{ ... }}
