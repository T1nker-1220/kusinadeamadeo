# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Database state viewer feature for admin dashboard
  - View complete database schema and objects
  - Interactive UI with tabs for tables, enums, functions, and triggers
  - Real-time database state fetching
  - Secure RLS policy implementation
- Database migration system for Supabase integration
- Image storage migration to Supabase Storage
- Schema optimization with new functions and indexes
- Comprehensive migration documentation
- Migration validation and rollback capabilities

### Changed
- Product and variant images now stored in Supabase Storage
- Enhanced database schema with new columns and constraints
- Improved error handling and validation
- Updated storage access patterns

### Fixed
- Image storage consistency issues
- Database schema optimization
- Performance improvements for queries
- Security enhancements with RLS policies

## [0.1.0] - 2024-03-19

### Added
- Initial release with basic functionality
- Product management system
- Category management
- Basic variant support
- Local image storage

## [1.1.1] - 2024-01-23

### Fixed
- Fixed category creation form reset issue that was causing "Cannot read properties of null (reading 'reset')" error
- Improved form handling in category management using React useRef
- Enhanced error handling for category creation API responses
- Implemented proper form state management for better reliability

### Technical Details
- Added useRef hook for stable form reference
- Updated form reset mechanism to prevent null reference errors
- Enhanced error message handling from API responses
- Improved state management during async operations

### Implementation Notes
```typescript
// Form reference implementation
const formRef = useRef<HTMLFormElement>(null);

// Form handling improvements
const handleCreateCategory = async (event: React.FormEvent<HTMLFormElement>) => {
  const form = event.currentTarget;
  // ... form handling logic
  form.reset(); // Stable form reset
};
```

### Developer Notes
- Form references should be maintained throughout async operations
- API error messages are now properly propagated to the UI
- Form state is preserved until successful submission
- Error boundaries prevent form state corruption

## [1.1.2] - 2024-01-24

### Fixed
- Fixed alert dialog component import issue with Radix UI
- Corrected package name from `@radix-ui/alert-dialog` to `@radix-ui/react-alert-dialog`
- Resolved category deletion functionality with proper confirmation dialog
- Enhanced error handling in category management

### Technical Details
```typescript
// Updated import statement
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

// Proper package installation
pnpm add @radix-ui/react-alert-dialog

// Implementation example
<AlertDialog>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Confirmation</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to proceed?
      </AlertDialogDescription>
    </AlertDialogHeader>
  </AlertDialogContent>
</AlertDialog>
```

### Implementation Notes
- Always use `react-` prefix for Radix UI component packages
- Ensure proper package installation before importing components
- Clean project cache if component resolution issues persist
- Follow Radix UI's component naming conventions

### Developer Notes
- Package naming convention is crucial for Radix UI components
- Cache cleaning may be necessary after package updates
- Component imports should match exact package names
- Alert dialog requires proper Portal setup for rendering

### Changed
- Optimized import ordering in alert-dialog component for better code organization
- Enhanced code formatting in UI components for improved readability
- Standardized React import statement positioning
- Improved component export structure clarity

### Technical Details
- Reordered imports following best practices:
  1. React imports first
  2. Third-party dependencies
  3. Internal components/utilities
- Standardized empty line usage for better code readability
- Maintained consistent export statement formatting

### Developer Notes
- Import ordering should follow the established pattern
- Maintain consistent spacing between imports and component code
- Keep exports grouped and formatted consistently
- Follow established code style guidelines for UI components

## [1.1.3] - 2024-03-20

### Fixed
- Dashboard data fetching with correct PascalCase table names
- Supabase integration issues in admin dashboard
- Metric card data display and calculations
- Error handling in dashboard stats hook

### Added
- Enhanced error handling for Supabase client initialization
- Detailed logging for dashboard data fetching
- Retry mechanism for failed queries
- Real-time subscription error handling

### Changed
- Updated table names to match Supabase schema:
  - `orders` → `Order`
  - `products` → `Product`
  - `users` → `User`
  - `categories` → `Category`
- Improved metric card descriptions
- Enhanced quick action descriptions
- Updated error messages to be more descriptive

### Technical Details
- Implemented proper error collection and aggregation
- Added debug logging for query execution
- Enhanced type safety for database entities
- Improved real-time subscription management

### Developer Notes
- Table names in Supabase use PascalCase
- Real-time subscriptions are set up for all dashboard entities
- Error handling includes retry mechanism with exponential backoff
- Debug logs are available in development mode

## [1.1.4] - 2024-01-28

### Added
- Comprehensive MVP Development Plan update
- Progress tracking for all major features
- Technical implementation status section
- Clear prioritization of upcoming features
- Detailed completion percentages

### Changed
- Updated feature completion metrics
- Reorganized development priorities
- Enhanced documentation structure
- Improved progress tracking system

### Technical Details
- Authentication System: 90% complete
- Product Management: 85% complete
- Order System: 75% complete
- Store Operations: 70% complete
- Variants System: 40% complete
- Add-ons System: 30% complete

### Developer Notes
- Focus on completing Variants System next
- Payment processing implementation priority
- Add-ons system development to follow
- User profile management updates needed
- Operating hours system pending implementation

## [1.1.5] - 2024-01-28

### Added
- Comprehensive variant management system
  - Stock tracking and management
  - Availability controls
  - Quick stock update controls
  - Image upload for variants
- New API endpoints
  - `/api/products/[id]/variants/stock` for stock management
  - Enhanced variant CRUD operations
  - Secure RLS policies for variants
- UI Components
  - Grid-based variant display
  - Quick action controls
  - Stock management interface
  - Status indicators
- Database Enhancements
  - New columns: `stock` and `isAvailable` for variants
  - Performance indexes for variant queries
  - Cascade delete relationships
  - RLS policies for variant security

### Changed
- Updated variant form with stock management
- Enhanced variant list display
- Improved RLS policy implementation
- Optimized database schema
- Updated API validation schemas

### Technical Details
```sql
-- New variant fields
ALTER TABLE "ProductVariant"
ADD COLUMN "stock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "isAvailable" BOOLEAN NOT NULL DEFAULT true;

-- Performance indexes
CREATE INDEX "product_variants_stock_idx" ON "ProductVariant"("stock");
CREATE INDEX "product_variants_isAvailable_idx" ON "ProductVariant"("isAvailable");
```

### Developer Notes
- RLS policies now use proper text casting for UUID comparisons
- Stock updates implement optimistic UI updates
- Form validation enhanced with Zod schemas
- Image upload integrated with Supabase storage
- API endpoints follow REST best practices

## [1.1.6] - 2024-01-29

### Added
- Enhanced image management system for variants
  - Improved image deletion workflow
  - Better error handling for image operations
  - Real-time image upload status feedback
  - Orphaned image cleanup functionality
- Form interaction improvements
  - Real-time form state management
  - Proper loading state indicators
  - Success/error notifications
  - Form validation enhancements
- New API endpoint for storage cleanup
  - `/api/storage/cleanup` for orphaned images
  - Admin-only access control
  - Comprehensive error handling
- Enhanced error prevention system
  - Form state recovery mechanisms
  - Image operation rollback support
  - Improved error logging

### Changed
- Updated variant form interactions
  - Enhanced image removal workflow
  - Improved form state management
  - Better loading state indicators
  - Clearer success/error feedback
- Optimized image handling
  - Improved deletion process
  - Better error recovery
  - Enhanced storage management
  - Orphaned image cleanup
- Enhanced API endpoints
  - Better error responses
  - Improved validation
  - Enhanced security checks
  - Proper status codes

### Technical Details
```typescript
// New storage cleanup endpoint
POST /api/storage/cleanup
- Admin-only access
- Handles orphaned image cleanup
- Returns detailed status

// Enhanced variant image endpoint
DELETE /api/products/[id]/variants/image
- Improved error handling
- Database consistency checks
- Storage cleanup integration
```

### Developer Notes
- Image deletion now properly updates form state
- Success notifications implemented for all operations
- Loading states properly handled in UI
- Error recovery mechanisms in place
- Storage cleanup can be triggered manually
- Form validation improved for better UX
- API endpoints now follow consistent patterns
- Error handling follows best practices

### Status Update
- Variant System: 85% complete
- Image Management: 95% complete
- Form Interactions: 90% complete
- Error Handling: 95% complete
