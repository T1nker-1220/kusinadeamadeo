import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  imageUrl: z.string().url('Invalid image URL'),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

// Constants for category limits
export const CATEGORY_LIMITS = {
  MAX_CATEGORIES: 10,
  MAX_PRODUCTS_PER_CATEGORY: 50,
} as const;

// Helper function to check category limits
export async function validateCategoryLimits(): Promise<{ isValid: boolean; error?: string }> {
  try {
    const response = await fetch('/api/categories/count');
    if (!response.ok) {
      throw new Error('Failed to fetch category count');
    }

    const { count } = await response.json();

    if (count >= CATEGORY_LIMITS.MAX_CATEGORIES) {
      return {
        isValid: false,
        error: `Maximum number of categories (${CATEGORY_LIMITS.MAX_CATEGORIES}) reached`,
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: 'Failed to validate category limits',
    };
  }
}

// Helper function to check products per category limit
export async function validateProductsPerCategory(categoryId: string): Promise<{ isValid: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/categories/${categoryId}/products/count`);
    if (!response.ok) {
      throw new Error('Failed to fetch product count');
    }

    const { count } = await response.json();

    if (count >= CATEGORY_LIMITS.MAX_PRODUCTS_PER_CATEGORY) {
      return {
        isValid: false,
        error: `Maximum number of products (${CATEGORY_LIMITS.MAX_PRODUCTS_PER_CATEGORY}) for this category reached`,
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: 'Failed to validate products per category limit',
    };
  }
}
