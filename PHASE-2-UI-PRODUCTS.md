# Phase 2: UI Components & Product Management

## Overview
This phase focuses on implementing the product management system, menu display components, and admin features according to the business requirements.

## Table of Contents
1. [Design System](#1-design-system)
2. [Product Management](#2-product-management)
3. [Menu System](#3-menu-system)
4. [Category Management](#4-category-management)
5. [Admin Features](#5-admin-features)
6. [Testing Strategy](#6-testing-strategy)

## 1. Design System

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
  },
  typography: {
    fonts: {
      display: "'Playfair Display', Georgia, serif",
      body: "'Inter', system-ui, -apple-system, sans-serif",
      accent: "'Montserrat', var(--font-body)",
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
```

## 2. Product Management

### 2.1 Database Schema
```sql
-- migrations/20240112000000_products_schema.sql

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Product Categories Enum
CREATE TYPE product_category AS ENUM (
  'Budget Meals',
  'Silog Meals',
  'Ala Carte',
  'Beverages',
  'Special Orders'
);

-- Product Size Options Enum
CREATE TYPE size_option AS ENUM (
  '16oz',
  '22oz'
);

-- Create products table with accurate structure
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  base_price DECIMAL(10,2),
  category product_category NOT NULL,
  image_url TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  has_variants BOOLEAN DEFAULT false,
  has_addons BOOLEAN DEFAULT false
);

-- Create variants table for products with variants
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  size size_option,
  flavor TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create add-ons table
CREATE TABLE product_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create junction table for products and their available add-ons
CREATE TABLE product_available_addons (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  addon_id UUID REFERENCES product_addons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (product_id, addon_id)
);

-- Create audit log for product changes
CREATE TABLE products_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changed_by TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert standard add-ons
INSERT INTO product_addons (name, price) VALUES
  ('Siomai', 5.00),
  ('Shanghai', 5.00),
  ('Skinless', 10.00),
  ('Egg', 15.00),
  ('Hotdog', 15.00),
  ('Extra Sauce', 5.00);

-- Create RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_addons ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access for products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Public read access for variants"
  ON product_variants FOR SELECT
  USING (true);

CREATE POLICY "Public read access for addons"
  ON product_addons FOR SELECT
  USING (true);

-- Admin only write access
CREATE POLICY "Admin write access for products"
  ON products FOR ALL
  USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

CREATE POLICY "Admin write access for variants"
  ON product_variants FOR ALL
  USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

CREATE POLICY "Admin write access for addons"
  ON product_addons FOR ALL
  USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');
```

### 2.2 Product Types
```typescript
// src/types/product.ts

export type ProductCategory = 
  | 'Budget Meals'
  | 'Silog Meals'
  | 'Ala Carte'
  | 'Beverages'
  | 'Special Orders';

export type SizeOption = '16oz' | '22oz';

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number | null;
  category: ProductCategory;
  imageUrl: string;
  available: boolean;
  hasVariants: boolean;
  hasAddons: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price: number;
  size?: SizeOption;
  flavor?: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductWithDetails extends Product {
  variants?: ProductVariant[];
  availableAddons?: ProductAddon[];
}
```

## 3. Menu System

### 3.1 Menu Categories
```typescript
// src/config/menu.ts

export const MENU_CATEGORIES = [
  {
    id: 'budget-meals',
    name: 'Budget Meals',
    description: 'Affordable meal options from ₱35-₱60',
    image: '/images/categories/budget-meals.jpg',
    priceRange: '₱35-₱60'
  },
  {
    id: 'silog-meals',
    name: 'Silog Meals',
    description: 'Filipino breakfast favorites',
    image: '/images/categories/silog-meals.jpg',
    priceRange: '₱85-₱100'
  },
  {
    id: 'ala-carte',
    name: 'Ala Carte',
    description: 'Individual dishes',
    image: '/images/categories/ala-carte.jpg',
    priceRange: '₱20-₱60'
  },
  {
    id: 'beverages',
    name: 'Beverages',
    description: 'Drinks and refreshments',
    image: '/images/categories/beverages.jpg',
    priceRange: '₱29-₱39'
  },
  {
    id: 'special-orders',
    name: 'Special Orders',
    description: 'Custom and bulk orders',
    image: '/images/categories/special-orders.jpg',
    priceRange: 'Varies'
  }
] as const;
```

### 3.2 Product Card Component
```typescript
// src/components/products/ProductCard.tsx

interface ProductCardProps {
  product: ProductWithDetails;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);

  const calculateTotalPrice = () => {
    let total = selectedVariant ? selectedVariant.price : (product.basePrice || 0);
    selectedAddons.forEach(addon => {
      total += addon.price;
    });
    return total;
  };

  return (
    <div className={cn(cardVariants({ variant: 'interactive' }))}>
      <div className="relative aspect-square">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover rounded-t-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          loading="lazy"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Currently Unavailable</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-text-primary">{product.name}</h3>
        <p className="text-sm text-text-secondary mt-1">{product.description}</p>

        {product.hasVariants && product.variants && (
          <div className="mt-3">
            <label className="text-sm font-medium">Select Variant:</label>
            <Select
              value={selectedVariant?.id}
              onValueChange={(value) => {
                setSelectedVariant(
                  product.variants?.find(v => v.id === value) || null
                );
              }}
            >
              {product.variants.map(variant => (
                <SelectItem key={variant.id} value={variant.id}>
                  {variant.size ? `${variant.size} - ` : ''}
                  {variant.flavor ? `${variant.flavor} - ` : ''}
                  ₱{variant.price.toFixed(2)}
                </SelectItem>
              ))}
            </Select>
          </div>
        )}

        {product.hasAddons && product.availableAddons && (
          <div className="mt-3">
            <label className="text-sm font-medium">Add-ons:</label>
            <div className="space-y-2">
              {product.availableAddons.map(addon => (
                <Checkbox
                  key={addon.id}
                  checked={selectedAddons.some(a => a.id === addon.id)}
                  onCheckedChange={(checked) => {
                    setSelectedAddons(
                      checked
                        ? [...selectedAddons, addon]
                        : selectedAddons.filter(a => a.id !== addon.id)
                    );
                  }}
                  label={`${addon.name} (+₱${addon.price.toFixed(2)})`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-3">
          <span className="text-brand-orange font-bold text-lg">
            ₱{calculateTotalPrice().toFixed(2)}
          </span>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="w-full mt-4"
          disabled={!product.available || (product.hasVariants && !selectedVariant)}
          onClick={() => {
            // Add to cart logic
          }}
        >
          {product.available ? 'Add to Cart' : 'Unavailable'}
        </Button>
      </div>
    </div>
  );
};
```

### 3.3 Product Service
```typescript
// src/lib/services/product.service.ts

export const productService = {
  async getProducts(category?: ProductCategory) {
    const query = supabase
      .from('products')
      .select(`
        *,
        variants:product_variants(*),
        availableAddons:product_available_addons(
          addon:product_addons(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (category) {
      query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data as ProductWithDetails[];
  },

  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        variants:product_variants(*),
        availableAddons:product_available_addons(
          addon:product_addons(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as ProductWithDetails;
  }
};
```

## 4. Admin Features

### 4.1 Product Form
```typescript
// src/components/admin/ProductForm.tsx

interface ProductFormProps {
  initialData?: ProductWithDetails;
  onSubmit: (data: CreateProductInput) => Promise<void>;
}

export const ProductForm = ({ initialData, onSubmit }: ProductFormProps) => {
  const form = useForm<CreateProductInput>({
    defaultValues: initialData || {
      name: '',
      description: '',
      basePrice: null,
      category: undefined,
      imageUrl: '',
      hasVariants: false,
      hasAddons: false,
      variants: [],
      addonIds: []
    }
  });

  const hasVariants = form.watch('hasVariants');
  const hasAddons = form.watch('hasAddons');

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            {...form.register('name', { required: 'Name is required' })}
          />
          {form.formState.errors.name && (
            <span className="text-red-500 text-sm">
              {form.formState.errors.name.message}
            </span>
          )}
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
            {...form.register('category', { required: 'Category is required' })}
          >
            {MENU_CATEGORIES.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...form.register('description', { required: 'Description is required' })}
          />
        </div>

        <div>
          <Label htmlFor="basePrice">Base Price (leave empty for variant-only products)</Label>
          <Input
            id="basePrice"
            type="number"
            step="0.01"
            {...form.register('basePrice', {
              setValueAs: (v) => v === '' ? null : parseFloat(v),
              min: { value: 0, message: 'Price must be positive' }
            })}
          />
        </div>

        <div>
          <Label>Product Options</Label>
          <div className="space-y-2">
            <Checkbox
              checked={hasVariants}
              onCheckedChange={(checked) => {
                form.setValue('hasVariants', !!checked);
                if (!checked) {
                  form.setValue('variants', []);
                }
              }}
              label="Has Variants (Size/Flavor)"
            />
            <Checkbox
              checked={hasAddons}
              onCheckedChange={(checked) => {
                form.setValue('hasAddons', !!checked);
                if (!checked) {
                  form.setValue('addonIds', []);
                }
              }}
              label="Allows Add-ons"
            />
          </div>
        </div>

        <div>
          <Label>Product Image</Label>
          <ImageUpload
            onUpload={(url) => form.setValue('imageUrl', url)}
            existingUrl={form.watch('imageUrl')}
            category={form.watch('category')}
          />
        </div>
      </div>

      {hasVariants && (
        <VariantsField
          control={form.control}
          register={form.register}
          errors={form.formState.errors}
        />
      )}

      {hasAddons && (
        <AddonsField
          control={form.control}
          register={form.register}
          errors={form.formState.errors}
        />
      )}

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full"
      >
        {form.formState.isSubmitting ? 'Saving...' : 'Save Product'}
      </Button>
    </form>
  );
};
```

## 5. Category Management

### 5.1 Category Navigation
```typescript
// src/components/products/CategoryNav.tsx
export const CategoryNav = ({
  activeCategory,
  onSelect,
}: {
  activeCategory: string
  onSelect: (category: string) => void
}) => {
  return (
    <nav className="flex overflow-x-auto py-4 gap-4">
      {MENU_CATEGORIES.map((category) => (
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

## 6. Testing Strategy

### 6.1 Component Tests
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

### 6.2 API Tests
```typescript
// src/app/api/products/__tests__/route.test.ts
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
```

## Best Practices

### Code Organization
- Keep components small and focused
- Use TypeScript for type safety
- Follow the Single Responsibility Principle
- Implement proper error boundaries
- Use meaningful component and file names

### Error Handling
```typescript
try {
  const { error } = await operation()
  if (error) throw error
} catch (error) {
  console.error('Context:', error)
  handleError(error)
}
```

### State Management
```typescript
// Good
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<Error | null>(null)
const [data, setData] = useState<Data | null>(null)

// Bad
const [state, setState] = useState({
  isLoading: false,
  error: null,
  data: null,
})
```

## Things to Avoid

### Code Practices
❌ Don't write duplicate code
❌ Don't skip error handling
❌ Don't use any type
❌ Don't hardcode values
❌ Don't mix concerns

### Security
❌ Don't expose API keys
❌ Don't store sensitive data in localStorage
❌ Don't trust user input
❌ Don't skip input validation
❌ Don't ignore security warnings

### Performance
❌ Don't skip image optimization
❌ Don't ignore bundle size
❌ Don't skip lazy loading
❌ Don't block the main thread
❌ Don't ignore memory leaks

## Next Steps
Moving to Phase 3, we will focus on:
1. Cart system implementation
2. Order processing
3. Payment integration
4. Email notifications
5. Order tracking system
```
