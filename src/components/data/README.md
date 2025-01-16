# Data Components

This directory contains data-fetching and state management components for Kusina de Amadeo.

## Features

### Data Fetching
- React Query integration
- Optimistic updates
- Error boundary implementation
- Loading states management

### State Management
- Zustand store integration
- Cart state management
- User preferences
- Theme configuration

## Component Structure

```typescript
data/
  ├── providers/          # Data providers
  │   ├── query-provider.tsx
  │   └── store-provider.tsx
  │
  ├── hooks/             # Custom data hooks
  │   ├── use-cart.ts
  │   └── use-products.ts
  │
  └── stores/            # Zustand stores
      ├── cart-store.ts
      └── theme-store.ts
```

## Usage Guidelines

1. **Data Fetching**
```typescript
import { useProducts } from "@/components/data/hooks/use-products"
import { useCategories } from "@/components/data/hooks/use-categories"
```

2. **State Management**
```typescript
import { useCart } from "@/components/data/hooks/use-cart"
import { useTheme } from "@/components/data/hooks/use-theme"
```

## Best Practices
- Use React Query for server state
- Implement proper error handling
- Handle loading states
- Optimize data fetching
- Cache responses appropriately
- Implement retry logic
