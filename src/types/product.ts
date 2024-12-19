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

export interface CreateProductInput {
  name: string;
  description: string;
  basePrice: number | null;
  category: ProductCategory;
  imageUrl: string;
  hasVariants: boolean;
  hasAddons: boolean;
  variants?: Omit<ProductVariant, 'id' | 'productId' | 'createdAt' | 'updatedAt'>[];
  addonIds?: string[];
} 