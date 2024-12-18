# Phase 2: UI Components & Product Management

## Step 1: Design System Implementation

### 1.1 Theme Setup
```typescript
// src/styles/theme.ts
export const theme = {
  colors: {
    // Core Theme Colors
    brand: {
      orange: '#FF6B00',
      orangeLight: '#FF8534',
      orangeDark: '#E65000',
    },
    surface: {
      primary: '#121212',
      secondary: '#1E1E1E',
      elevated: '#2D2D2D',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.95)',
      secondary: 'rgba(255, 255, 255, 0.87)',
      tertiary: 'rgba(255, 255, 255, 0.6)',
    },
    semantic: {
      success: '#4CAF50',
      warning: '#FFC107',
      error: '#FF5252',
    },
    overlay: {
      hover: 'rgba(255, 255, 255, 0.1)',
      active: 'rgba(255, 255, 255, 0.15)',
      disabled: 'rgba(255, 255, 255, 0.05)',
    },
  },
  typography: {
    fonts: {
      display: "'Playfair Display', Georgia, serif",
      body: "'Inter', system-ui, -apple-system, sans-serif",
      accent: "'Montserrat', var(--font-body)",
    },
    sizes: {
      xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
      sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
      base: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
      lg: 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
      xl: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
      '2xl': 'clamp(1.5rem, 1.3rem + 1vw, 2rem)',
      '3xl': 'clamp(2rem, 1.8rem + 1.25vw, 2.5rem)',
      '4xl': 'clamp(2.5rem, 2.3rem + 1.5vw, 3rem)',
    },
    lineHeight: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.75',
    },
    tracking: {
      tight: '-0.015em',
      normal: '0',
      wide: '0.015em',
    },
  },
}
```

### 1.2 Component Variants
```typescript
// src/lib/variants.ts
import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-brand-orange text-white hover:bg-brand-orangeLight',
        secondary: 'bg-surface-secondary text-text-primary hover:bg-surface-elevated',
        outline: 'border-2 border-brand-orange text-brand-orange hover:bg-overlay-hover',
      },
      size: {
        sm: 'h-8 px-3 py-1 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export const cardVariants = cva(
  'rounded-lg overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-surface-secondary',
        elevated: 'bg-surface-elevated',
        interactive: 'bg-surface-secondary hover:bg-surface-elevated transition-colors',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
)
```

## Step 2: Product Components

### 2.1 Product Card
```typescript
// src/components/products/ProductCard.tsx
interface ProductProps {
  id: string
  name: string
  description: string
  basePrice: number
  imageUrl: string
  category: string
  variants?: {
    size?: string[]
    addOns?: Array<{
      name: string
      price: number
    }>
  }
}

export const ProductCard = ({ product }: { product: ProductProps }) => {
  return (
    <div className={cn(cardVariants({ variant: 'interactive' }))}>
      <div className="relative aspect-square">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-text-primary">{product.name}</h3>
        <p className="text-sm text-text-secondary mt-1">{product.description}</p>
        <div className="mt-2">
          <span className="text-brand-orange font-bold">
            ₱{product.basePrice.toFixed(2)}
          </span>
        </div>
        {product.variants && (
          <div className="mt-2 text-sm text-text-tertiary">
            {product.variants.size && (
              <span>Available sizes • </span>
            )}
            {product.variants.addOns && (
              <span>Add-ons available</span>
            )}
          </div>
        )}
        <Button
          variant="primary"
          size="sm"
          className="w-full mt-4"
          onClick={() => {}}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
```

### 2.2 Product Grid
```typescript
// src/components/products/ProductGrid.tsx
export const ProductGrid = ({ 
  products,
  category
}: { 
  products: ProductProps[]
  category?: string 
}) => {
  const filteredProducts = category 
    ? products.filter(p => p.category === category)
    : products

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### 2.3 Category Navigation
```typescript
// src/components/products/CategoryNav.tsx
const categories = [
  { id: 'budget-meals', name: 'Budget Meals' },
  { id: 'silog-meals', name: 'Silog Meals' },
  { id: 'ala-carte', name: 'Ala Carte' },
  { id: 'beverages', name: 'Beverages' },
  { id: 'special-orders', name: 'Special Orders' },
]

export const CategoryNav = ({
  activeCategory,
  onSelect,
}: {
  activeCategory: string
  onSelect: (category: string) => void
}) => {
  return (
    <nav className="flex overflow-x-auto py-4 gap-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            'px-4 py-2 rounded-full whitespace-nowrap transition-colors',
            activeCategory === category.id
              ? 'bg-brand-orange text-white'
              : 'bg-surface-secondary text-text-secondary hover:bg-surface-elevated'
          )}
        >
          {category.name}
        </button>
      ))}
    </nav>
  )
}
```

## Step 3: Product Management

### 3.1 Product Types
```typescript
// src/types/product.ts
export interface Product {
  id: string
  name: string
  description: string
  basePrice: number
  category: string
  imageUrl: string
  available: boolean
  variants?: {
    size?: Array<{
      name: string
      priceAdjustment: number
    }>
    addOns?: Array<{
      name: string
      price: number
    }>
    flavorOptions?: string[]
  }
  createdAt: Date
  updatedAt: Date
}

export interface CreateProductInput {
  name: string
  description: string
  basePrice: number
  category: string
  imageUrl: string
  variants?: Product['variants']
}
```

### 3.2 Product Database Schema
```sql
-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  variants JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_category CHECK (
    category IN ('Budget Meals', 'Silog Meals', 'Ala Carte', 'Beverages', 'Special Orders')
  )
);

-- Create products_audit table for tracking changes
CREATE TABLE products_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changed_by TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.3 Product API Routes
```typescript
// src/app/api/products/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Verify admin access
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  if (session?.user.email !== process.env.NEXT_PUBLIC_BUSINESS_EMAIL) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const input = await req.json()
  
  const { data, error } = await supabase
    .from('products')
    .insert([input])
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}
```

## Step 4: Admin Product Management

### 4.1 Product Form
```typescript
// src/app/admin/products/components/ProductForm.tsx
export const ProductForm = ({
  initialData,
  onSubmit,
}: {
  initialData?: Product
  onSubmit: (data: CreateProductInput) => Promise<void>
}) => {
  const form = useForm<CreateProductInput>({
    defaultValues: initialData || {
      name: '',
      description: '',
      basePrice: 0,
      category: '',
      imageUrl: '',
    },
  })
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

### 4.2 Image Upload
```typescript
// src/lib/upload.ts
export const uploadProductImage = async (
  file: File
): Promise<string> => {
  const supabase = createClientComponentClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`
  
  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file)
  
  if (uploadError) {
    throw new Error('Error uploading image')
  }
  
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath)
  
  return data.publicUrl
}
```

## Step 5: Testing

### 5.1 Component Tests
```typescript
// src/components/products/__tests__/ProductCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ProductCard } from '../ProductCard'

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    basePrice: 99.99,
    imageUrl: '/test.jpg',
    category: 'Budget Meals',
  }

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('₱99.99')).toBeInTheDocument()
  })
})
```

### 5.2 API Tests
```typescript
// src/app/api/products/__tests__/route.test.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { GET, POST } from '../route'

jest.mock('@supabase/auth-helpers-nextjs')

describe('Products API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/products', () => {
    it('returns products successfully', async () => {
      const mockProducts = [/* mock data */]
      ;(createRouteHandlerClient as jest.Mock).mockImplementation(() => ({
        from: () => ({
          select: () => ({
            order: () => ({
              data: mockProducts,
              error: null,
            }),
          }),
        }),
      }))

      const response = await GET()
      const data = await response.json()

      expect(data).toEqual(mockProducts)
    })
  })
})

## 1. Product Schema Setup

### 1.1 Update Database Schema
```bash
# Create new migration for product updates
npx supabase migration new add_product_features

# Add the following to the new migration file:
```

```sql
-- Update products table with new fields
ALTER TABLE products
ADD COLUMN IF NOT EXISTS base_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS has_variants BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

-- Create variants table if not exists
CREATE TABLE IF NOT EXISTS variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'size', 'flavor', 'add-on'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER variants_updated_at
  BEFORE UPDATE ON variants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

```bash
# Apply the migration
npm run db:push

# Generate updated TypeScript types
npm run db:types
```

### 1.2 Type Definitions
```typescript
// src/types/products.ts
import { Database } from './supabase'

export type Product = Database['public']['Tables']['products']['Row']
export type Variant = Database['public']['Tables']['variants']['Row']

export interface ProductWithVariants extends Product {
  variants: Variant[]
}
