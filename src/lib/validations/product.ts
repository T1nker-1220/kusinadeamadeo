import { VariantType } from '@prisma/client';
import { z } from 'zod';

// Variant validation schema
export const ProductVariantSchema = z.object({
  type: z.nativeEnum(VariantType, {
    required_error: "Variant type is required",
    invalid_type_error: "Invalid variant type",
  }),
  name: z.string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters")
    .trim(),
  price: z.number()
    .positive("Price must be greater than 0")
    .finite("Price must be a finite number"),
  stock: z.number()
    .int("Stock must be a whole number")
    .nonnegative("Stock cannot be negative")
    .default(0),
  isAvailable: z.boolean().default(true),
  imageUrl: z.string()
    .url("Invalid image URL")
    .optional()
    .nullable(),
});

export type VariantFormValues = z.infer<typeof ProductVariantSchema>;

// Product validation schema
export const ProductSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(10).max(200),
  basePrice: z.number().nonnegative(),
  imageUrl: z.string().url(),
  categoryId: z.string().uuid(),
  isAvailable: z.boolean().default(true),
  allowsAddons: z.boolean().default(false),
  variants: z.array(ProductVariantSchema).optional()
});

// Product update schema (all fields optional)
export const ProductUpdateSchema = ProductSchema.partial();

// Product query params schema
export const ProductQuerySchema = z.object({
  categoryId: z.string().uuid().optional(),
  isAvailable: z.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'basePrice', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional()
});

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  imageUrl: z.string().url('Invalid image URL'),
  categoryId: z.string().min(1, 'Category is required'),
  basePrice: z.coerce.number().min(0, 'Base price must be greater than 0'),
  isAvailable: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productSchema>;
