# Admin Components

This directory contains all administrative interface components for Kusina de Amadeo.

## Features

### Product Management
- Product form with image upload
- Product variant management
- Add-ons configuration
- Stock management interface
- Product listing with filtering

### Category Management
- Category creation and editing
- Image upload functionality
- Sort order management
- Category listing interface

### Order Management
- Order processing interface
- Payment verification
- Status management
- Order history view

## Component Structure

```typescript
admin/
  ├── products/           # Product management components
  │   ├── product-form.tsx
  │   ├── products-data-table.tsx
  │   └── columns.tsx
  │
  ├── categories/         # Category management
  │   ├── category-form.tsx
  │   └── category-list.tsx
  │
  └── orders/            # Order management
      ├── order-list.tsx
      └── order-details.tsx
```

## Usage Guidelines

1. **Product Management**
```typescript
import { ProductForm } from "@/components/admin/products/product-form"
import { ProductsDataTable } from "@/components/admin/products/products-data-table"
```

2. **Category Management**
```typescript
import { CategoryForm } from "@/components/admin/categories/category-form"
import { CategoryList } from "@/components/admin/categories/category-list"
```

## Security Notes
- All components require admin authentication
- Implements role-based access control
- Validates all operations server-side
- Follows secure data handling practices
