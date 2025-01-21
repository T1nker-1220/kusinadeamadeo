# Kusina de Amadeo - Frontend Architecture Plan

## Design System Integration

### Base Configuration
```typescript:src/lib/theme-config.ts
const themeConfig = {
  // Brand colors as per KDA requirements
  colors: {
    primary: {
      DEFAULT: "hsl(var(--primary))", // Orange brand color
      foreground: "hsl(var(--primary-foreground))",
    },
    // Other color tokens...
  },
  // Dark mode only
  appearance: "dark",
  // Custom radius for brand identity
  radius: "0.5rem",
}
```

### Typography System
```typescript:src/styles/typography.ts
// Custom typography configuration
const typography = {
  fontFamily: {
    // System fonts for optimal performance
    sans: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'sans-serif'
    ],
  },
  // Font size scale
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    // ... other sizes
  },
   }
   ```

## Animation System Integration

### Motion Configuration
```typescript:src/lib/motion-config.ts
// Optimized Framer Motion configuration
import { MotionConfig } from "framer-motion"

export const motionConfig = {
  reducedMotion: "user", // Respect user preferences
  transition: {
    type: "spring",
    duration: 0.3,
    ease: "easeInOut"
     }
   }
   ```

### Reusable Animations
```typescript:src/lib/animations.ts
// Performance-optimized animation variants
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

export const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 }
  }

export const scaleIn = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 }
}
```

### Custom Motion Component
```typescript:src/components/ui/motion.tsx
// Optimized motion component for Next.js
"use client";

import { motion, MotionProps } from "framer-motion";
import React from "react";

interface CustomMotionProps<Tag extends keyof JSX.IntrinsicElements>
  extends MotionProps {
  type?: Tag;
  children: React.ReactNode;
  className?: string;
}

export const Motion = <Tag extends keyof JSX.IntrinsicElements>({
  type,
  children,
  className,
  ...props
}: CustomMotionProps<Tag>) => {
  const Component = type ? (motion as any)[type] : motion.div;
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
  };
```

## Component Architecture

### Layout Components
1. **Main Layout**
   ```typescript:src/components/layout/main-layout.tsx
   // Using shadcn/ui components for base layout
   import { MainNav } from "@/components/layout/main-nav"
   import { MobileNav } from "@/components/layout/mobile-nav"
   import { UserNav } from "@/components/layout/user-nav"
   ```

2. **Navigation**
   - Responsive navigation with mobile optimization
   - Role-based menu items
   - Dynamic route handling
   - Integrated with shadcn/ui theme

### Core UI Components

1. **Product Cards**
```typescript:src/components/ui/product-card.tsx
// Enhanced card component with image optimization
import { Card } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ImageUpload } from "@/components/ui/image-upload"
```

2. **Data Tables**
```typescript:src/components/ui/data-table.tsx
// Enhanced table component with sorting and filtering
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
```

3. **Forms**
```typescript:src/components/ui/form.tsx
// Enhanced form components with Zod validation
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
```

### Admin Components

1. **Product Management**
```typescript:src/components/admin/products/product-form.tsx
// Enhanced product form with image upload
import { ProductForm } from "@/components/admin/products/product-form"
import { ImageUpload } from "@/components/ui/image-upload"
```

2. **Category Management**
```typescript:src/components/admin/categories/category-form.tsx
// Category management with sorting
import { CategoryForm } from "@/components/admin/categories/category-form"
import { SortableList } from "@/components/ui/sortable-list"
```

### Customer Components

1. **Shopping Cart**
```typescript:src/components/cart/cart-item.tsx
// Enhanced cart with variants and add-ons
import { CartItem } from "@/components/cart/cart-item"
import { VariantSelector } from "@/components/cart/variant-selector"
```

2. **Order Management**
```typescript:src/components/orders/order-status.tsx
// Real-time order status updates
import { OrderStatus } from "@/components/orders/order-status"
import { PaymentForm } from "@/components/orders/payment-form"
```

### Animation Components

1. **Page Transitions**
```typescript:src/components/transitions/page-transition.tsx
"use client";

import { Motion } from "@/components/ui/motion";
import { fadeIn } from "@/lib/animations";

export const PageTransition = ({ children }) => (
  <Motion
    {...fadeIn}
    transition={{ duration: 0.3 }}
  >
    {children}
  </Motion>
);
```

2. **Menu Item Animation**
```typescript:src/components/ui/menu-item.tsx
"use client";

import { Motion } from "@/components/ui/motion";
import { scaleIn } from "@/lib/animations";

export const MenuItem = ({ children }) => (
  <Motion
    {...scaleIn}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {children}
  </Motion>
);
```

## Page Components

### Customer Pages

1. **Menu Page**
```typescript:src/app/(customer)/menu/page.tsx
// Product listing with grid layout
// Using enhanced card components
```

2. **Cart Page**
```typescript:src/app/(customer)/cart/page.tsx
// Cart management interface
// Using shadcn/ui data tables
```

### Admin Pages

1. **Dashboard**
```typescript:src/app/(admin)/dashboard/page.tsx
// Using 21st.dev's admin dashboard components
// Enhanced with shadcn/ui data visualization
```

2. **Product Management**
```typescript:src/app/(admin)/products/page.tsx
// CRUD interface using shadcn/ui tables
// Enhanced with 21st.dev's form components
```

## Component Integration Strategy

### 1. Base Components (shadcn/ui)
- Button
- Input
- Form
- Dialog
- Toast
- Table

### 2. Enhanced Components (21st.dev)
- Sidebar navigation
- Search input (non-AI version)
- Card layouts
- Admin dashboard components

### 3. Layout Components (Radix UI)
- Navigation menu
- Tabs
- Context menu
- Hover cards

### 4. Animation Components
- PageTransition
- MenuItem
- CartItem
- NotificationToast
- ModalTransition

### 5. Animation Guidelines
- Use spring animations for natural feel
- Keep durations between 0.2-0.4s
- Implement reduced motion alternatives
- Avoid heavy transform animations
- Use hardware-accelerated properties
- Implement exit animations

## Theme Integration

### 1. Color System
```typescript:src/styles/colors.ts
// Custom color palette
export const colors = {
  brand: {
    orange: {
      50: '#fff7ed',
      // ... custom orange shades
      900: '#7c2d12',
    },
    // ... other brand colors
  }
}
```

### 2. Dark Mode Configuration
```typescript:src/styles/theme.ts
// Dark-mode only configuration
export const darkTheme = {
  colors: {
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    // ... other dark mode colors
  }
}
```

## Implementation Guidelines

1. **Component Organization**
   ```
   src/
     components/
       ui/          # Base components
       blocks/      # Composite components
       forms/       # Form-specific components
       layout/      # Layout components
   ```

2. **Style Management**
   ```
   src/
     styles/
       globals.css   # Global styles
       theme.ts      # Theme configuration
       variants.ts   # Component variants
   ```

3. **Asset Management**
   ```
   src/
     assets/
       icons/       # SVG icons
       images/      # Static images
   ```

## Performance Optimizations

1. **Image Optimization**
   - Next.js Image component with proper sizing
   - Responsive image loading
   - WebP format usage

2. **Component Loading**
   - Dynamic imports for large components
   - Route-based code splitting
   - Preload critical components

3. **Style Optimization**
   - Purge unused styles
   - Critical CSS extraction
   - Efficient CSS-in-JS usage

4. **Animation Optimization**
   - Use `useReducedMotion` hook for accessibility
   - Implement `LazyMotion` for code splitting
   - Use `transform` instead of position properties
   - Avoid animating layout properties
   - Use `will-change` hints sparingly
   - Implement exit animations properly

## Accessibility Features

1. **Keyboard Navigation**
   - Focus management
   - Skip links
   - ARIA labels

2. **Screen Reader Support**
   - Semantic HTML
   - ARIA roles
   - Status announcements

## Development Workflow

1. **Component Development**
   - Start with shadcn/ui base
   - Enhance with 21st.dev features
   - Customize with brand theming

2. **Testing Strategy**
   - Component unit tests
   - Integration tests
   - Visual regression tests

3. **Documentation**
   - Component API documentation
   - Usage examples
   - Theme customization guide

4. **Animation Development**
   - Start with basic transitions
   - Test on low-end devices
   - Implement reduced motion
   - Profile performance
   - Optimize as needed

## Implementation Examples

### Product Card Animation
```typescript:src/components/ui/product-card.tsx
"use client";

import { Motion } from "@/components/ui/motion";

export const ProductCard = ({ product }) => (
  <Motion
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {/* Card content */}
  </Motion>
);
```

### Cart Animation
```typescript:src/components/cart/cart-item.tsx
"use client";

import { Motion } from "@/components/ui/motion";

export const CartItem = ({ item }) => (
  <Motion
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ type: "spring", duration: 0.3 }}
  >
    {/* Cart item content */}
  </Motion>
);
```

## Component Code Organization Standards

### Import Structure
All UI components should follow this import ordering pattern:
```typescript
// 1. React and Next.js imports
import * as React from "react"
import type { NextPage } from "next"

// 2. Third-party library imports
import * as RadixUI from "@radix-ui/react-*"
import { motion } from "framer-motion"

// 3. Internal components and utilities
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

### Export Structure
Component exports should be grouped and formatted consistently:
```typescript
export {
  ComponentName,
  ComponentNameAction,
  ComponentNameTrigger,
  // ... other related exports
}
```

### Code Spacing
- Maintain one empty line between import sections
- Keep one empty line between component definition and exports
- Use consistent spacing throughout the component file

### Best Practices
- Keep imports organized by category
- Use consistent naming conventions
- Maintain clear separation between sections
- Follow established component patterns
- Document any deviations from standards
