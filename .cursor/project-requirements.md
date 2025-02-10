`Project Requirements rules *@docs/project-requirements.md* You will use tools codebase to know what are the details of the files of this *@docs/project-requirements.md* directory files to check the project requirements and the project standards that you need to follow. This will be the guide for you to make sure you are following the project standards. So make sure to read this when planning and implementing the project to avoid duplications, conflicts, and errors. Don't touch that folder and files, you will only read it. Don't over do it to the point that you are not following the project requirements. DON'T REMOVE THIS LINE 1!!!!`


# Kusina de Amadeo - Project Information & Documentation

## Project Overview

Kusina de Amadeo is a full-stack food ordering system for an authentic Filipino restaurant located in Amadeo, Cavite. The system is designed to provide a seamless ordering experience while maintaining the authenticity of traditional Filipino cuisine.

## Technical Stack

### Frontend Technologies
- **Framework**: Next.js 14+ (App Router)
- **Styling & UI Components**:
  - Shadcn/UI (customizable prebuilt components)
  - TailwindCSS
- **State Management**: Zustand
- **Form Validation**: Zod

### Backend & Database
- **Database**: Supabase with PostgreSQL
- **Authentication**: Google OAuth only
- **Type Safety**: Generated types & Zod schemas

### Deployment
- **Platform**: Vercel
- **Version Control**: GitHub
- **Package Manager**: PNPM

## Business Information

### Contact Details
- **Address**: 107 i Purok 4 Dagatan, Amadeo, Cavite
- **Mobile**: +63 939 719 689
- **Landline**: (046) 890-9060
- **Email**: kusinadeamadeo@gmail.com
- **Admin Email**: kusinadeamadeo@gmail.com

### Location Links
- **Google Maps**: [View Location](https://maps.app.goo.gl/jvsb9KDwfxy3dYGo7)
- **Facebook**: [Kusina de Amadeo](https://www.facebook.com/people/Kusina-de-Amadeo/100063686464435/)

### Operating Hours
- **Store Hours**: 5:00 AM to 11:00 PM (daily)
- **Order Processing**: 8:00 AM to 10:00 PM (Asia/Manila timezone)
- **Pickup Hours**: 5:00 AM to 10:00 PM (Asia/Manila timezone)

## System Requirements & Features

### Authentication System
1. **Single Sign-in Method**
   - Google OAuth exclusively
   - Profile integration with Google Avatar
   - Role-based access control (admin/customer)
   - Protected routes and RLS policies

2. **User Roles** (as per users table)
   - **Admin Access**:
     - Product & category management
     - Order processing & verification
     - Store settings configuration
     - Payment verification
   - **Customer Access**:
     - Order placement
     - Profile management
     - Order history viewing
     - Payment submission

### Order System Requirements

1. **Customer Information** (as per users table)
   - Email (from Google OAuth)
   - Full name
   - Phone number
   - Delivery address
   - City
   - Province
   - Postal code

2. **Payment Methods** (as per orders & payment_information tables)
   - **GCash**:
     - Reference number tracking
     - Payment screenshot upload
     - Verification system
   - **Cash**:
     - In-store payment
     - Receipt generation

3. **Order Validation** (as per database constraints)
   - Operating hours check
   - Order status tracking
   - Payment status verification
   - Receipt ID validation (2 letters + 2 numbers)

### Product Management (as per database schema)

1. **Categories**
   - Name and description
   - Image management
   - Add-ons configuration
   - Sort order

2. **Products**
   - Basic information (name, description, price)
   - Category assignment
   - Stock management
   - Add-ons configuration
   - Active status control

3. **Variants**
   - Name and price
   - Stock tracking
   - Image management
   - Active status

4. **Add-ons System**
   - Global add-ons configuration
   - Product-specific availability
   - Required add-ons for specific items
   - Pricing management

### Store Operations (as per store_settings table)
- Store hours management
- Order processing hours
- Pickup hours configuration
- Timezone handling (Asia/Manila)
- Store status control (open/closed)

## Roadmap Development Phases

### ✅ Phase 1: Project Setup & Foundation (Completed)
- Next.js 14 project setup
- TypeScript configuration
- UI component system setup
- Development tools configuration
- Database schema implementation
- Authentication system
- RLS policies and security

### 🚧 Phase 2: Core Features Development (In Progress)
- Product management system
- Category CRUD operations
- Image upload system (Critical issue)
- Product variants and add-ons
- Shopping cart implementation
- Order management system

### 📅 Phase 3: User Interface Development (Planned)
- Responsive layouts
- Customer interface
- Admin interface
- Enhanced UI features

### 📅 Phase 4: Backend Implementation (Planned)
- API development
- Payment integration
- Advanced security features
- Performance optimization

### 📅 Phase 5: Testing & Optimization (Planned)
- Testing implementation
- Performance optimization
- SEO & accessibility
- Error handling

### 📅 Phase 6: Deployment & Monitoring (Planned)
- Vercel deployment
- Analytics setup
- Monitoring implementation
- Production optimization

## Current Status
- Phase 1: ✅ Completed (January 2024)
- Phase 2: 🚧 In Progress (February 2024)
- Phase 3: 📅 Planned (March 2024)
- Remaining Phases: 📅 Scheduled for Q2 2024

## Design Guidelines

### Theme Configuration
- **Brand Color**: Orange
- **Theme Mode**: Dark only
- **Typography**: Custom fonts matching brand identity
- **Design System**: Shadcn/UI with custom theming
- **Approach**: Mobile-first design

## Technical Features

1. **Responsive Design**
   - Mobile-first approach
   - Tablet optimization
   - Desktop enhancement

2. **Performance Optimization**
   - Image optimization
   - Lazy loading
   - Code splitting
   - API response optimization

3. **Security Features**
   - Role-based access control
   - Secure payment handling
   - Data encryption
   - Input validation

4. **Receipt System**
   - Format: 2 letters + 2 numbers (e.g., AE20)
   - Auto-generated
   - Unique per transaction
   - Trackable

## Development Best Practices

1. **Code Quality**
   - TypeScript for type safety
   - ESLint & Prettier configuration
   - Component-based architecture
   - Clean code principles

2. **Security**
   - Environment variable management
   - API security best practices
   - Data validation
   - Error handling

3. **Performance**
   - Database optimization
   - Caching strategies
   - Bundle size optimization
   - API response optimization

4. **Testing**
   - Unit testing
   - Integration testing
   - E2E testing
   - Performance testing

## Maintenance & Support

1. **Regular Updates**
   - Security patches
   - Feature updates
   - Bug fixes
   - Performance improvements

2. **Monitoring**
   - Error tracking
   - Performance monitoring
   - User analytics
   - System health checks

3. **Backup & Recovery**
   - Database backups
   - Version control
   - Recovery procedures
   - Data integrity checks

## Technical Implementation

### Database Structure
1. **Core Tables**
   - users (3 rows)
   - categories (4 rows)
   - products (27 rows)
   - product_variants (17 rows)
   - global_addons (6 rows)
   - orders (0 rows)
   - order_items (0 rows)
   - order_item_addons (0 rows)
   - payment_information (0 rows)

2. **Supporting Tables**
   - product_variants (stores size, price variations)
   - product_variant_flavors (stores available flavors)
   - global_addons (stores universal add-on options)
   - product_available_addons (maps addons to products)
   - order_items (stores individual order line items)
   - order_item_addons (tracks addons per order item)

### Performance Features
1. **Optimized Indexes**
   - Product search optimization
   - Order filtering indexes
   - Payment tracking indexes
   - Composite indexes for common queries

2. **Security Implementation**
   - Row Level Security (RLS)
   - Input validation
   - Error boundaries
   - Access control

### Development Guidelines
- Follow database schema strictly
- Use provided indexes
- Implement RLS policies
- Handle errors properly
- Validate all inputs

## Maintenance & Support
1. **Database Maintenance**
   - Index optimization
   - Query performance monitoring
   - Data integrity checks
   - Backup procedures

2. **Security Updates**
   - RLS policy updates
   - Input validation maintenance
   - Error handling improvements
   - Access control updates
