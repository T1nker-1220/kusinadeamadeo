# State Management Architecture

## Store Directory Structure
```
src/
  store/
    slices/
      cart.ts         # Cart state management
      products.ts     # Product state & cache
      auth.ts         # Authentication state
      ui.ts          # UI state (modals, drawers, etc)
      orders.ts      # Order management state
    hooks/           # Custom store hooks
      useCart.ts
      useProducts.ts
      useAuth.ts
      useUI.ts
      useOrders.ts
    index.ts        # Store exports
```

## Implementation Examples

### 1. Cart Store
```typescript:src/store/slices/cart.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  quantity: number
  variants: string[]
  addons: string[]
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item]
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        })),
      clearCart: () => set({ items: [] })
    }),
    {
      name: 'cart-storage'
    }
  )
)
```

### 2. UI Store
```typescript:src/store/slices/ui.ts
import { create } from 'zustand'

interface UIStore {
  isMobileMenuOpen: boolean
  isCartOpen: boolean
  activeModal: string | null
  toggleMobileMenu: () => void
  toggleCart: () => void
  openModal: (modalId: string) => void
  closeModal: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  isCartOpen: false,
  activeModal: null,
  toggleMobileMenu: () =>
    set((state) => ({
      isMobileMenuOpen: !state.isMobileMenuOpen
    })),
  toggleCart: () =>
    set((state) => ({
      isCartOpen: !state.isCartOpen
    })),
  openModal: (modalId) =>
    set({ activeModal: modalId }),
  closeModal: () =>
    set({ activeModal: null })
}))
```

### 3. Products Store
```typescript:src/store/slices/products.ts
import { create } from 'zustand'

interface Product {
  id: string
  name: string
  price: number
  // ... other product fields
}

interface ProductsStore {
  products: Product[]
  categories: Category[]
  selectedCategory: string | null
  isLoading: boolean
  error: Error | null
  fetchProducts: () => Promise<void>
  setSelectedCategory: (categoryId: string) => void
}

export const useProductsStore = create<ProductsStore>((set) => ({
  products: [],
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
  fetchProducts: async () => {
    set({ isLoading: true })
    try {
      const products = await fetch('/api/products')
        .then(res => res.json())
      set({ products, isLoading: false })
    } catch (error) {
      set({ error, isLoading: false })
    }
  },
  setSelectedCategory: (categoryId) =>
    set({ selectedCategory: categoryId })
}))
```

### 4. Custom Hooks
```typescript:src/store/hooks/useCart.ts
import { useCartStore } from '../slices/cart'

export const useCart = () => {
  const cart = useCartStore()

  const cartTotal = cart.items.reduce((total, item) => {
    // Calculate total with variants and addons
    return total + calculateItemTotal(item)
  }, 0)

  return {
    ...cart,
    cartTotal,
    isEmpty: cart.items.length === 0,
    itemCount: cart.items.length
  }
}
```

## Usage in Components

### Cart Component Example
```typescript:src/components/cart/cart.tsx
import { useCart } from '@/store/hooks/useCart'
import { useUI } from '@/store/hooks/useUI'

export const Cart = () => {
  const { items, removeItem, cartTotal } = useCart()
  const { isCartOpen, toggleCart } = useUI()

  return (
    <Motion
      initial={false}
      animate={isCartOpen ? "open" : "closed"}
    >
      {/* Cart UI */}
    </Motion>
  )
}
```

### Product List Example
```typescript:src/components/products/product-list.tsx
import { useProducts } from '@/store/hooks/useProducts'
import { useCart } from '@/store/hooks/useCart'

export const ProductList = () => {
  const { products, isLoading } = useProducts()
  const { addItem } = useCart()

  if (isLoading) return <ProductSkeleton />

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => addItem(product)}
        />
      ))}
    </div>
  )
}
```

## State Management Best Practices

1. **Atomic Updates**
   - Keep state updates small and focused
   - Use selectors for derived state
   - Avoid large state objects

2. **Performance**
   - Use shallow equality checks
   - Implement proper memoization
   - Split stores logically

3. **Persistence**
   - Use persist middleware for cart
   - Handle hydration properly
   - Clear sensitive data appropriately

4. **Type Safety**
   - Define strict interfaces
   - Use discriminated unions for complex states
   - Leverage TypeScript's type inference
