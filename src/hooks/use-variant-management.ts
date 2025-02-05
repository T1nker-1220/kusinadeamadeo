import { ProductVariantSchema } from '@/lib/validations/product';
import { ProductVariant } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { ZodError } from 'zod';

interface UseVariantManagementProps {
  productId: string;
}

type VariantInput = Omit<ProductVariant, 'id' | 'productId' | 'createdAt' | 'updatedAt'>;
type VariantUpdate = Partial<VariantInput>;

interface VariantOperations {
  variants: ProductVariant[];
  isLoading: boolean;
  error: Error | null;
  addVariant: (variant: VariantInput) => Promise<void>;
  updateVariant: (id: string, variant: VariantUpdate) => Promise<void>;
  deleteVariant: (id: string) => Promise<void>;
  updateStock: (id: string, newStock: number) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
}

async function getVariants(productId: string): Promise<ProductVariant[]> {
  const response = await fetch(`/api/products/${productId}/variants`);
  if (!response.ok) {
    throw new Error('Failed to fetch variants');
  }
  return response.json();
}

export function useVariantManagement({ productId }: UseVariantManagementProps): VariantOperations {
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  const { data: variants = [], isLoading } = useQuery({
    queryKey: ['variants', productId],
    queryFn: () => getVariants(productId),
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
  });

  const invalidateVariants = () => {
    queryClient.invalidateQueries({ queryKey: ['variants', productId] });
  };

  const addVariant = async (variant: VariantInput) => {
    try {
      // Validate the variant data before sending
      const validatedVariant = ProductVariantSchema.parse(variant);

      const response = await fetch(`/api/products/${productId}/variants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedVariant),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add variant');
      }

      toast.success('Variant added successfully');
      invalidateVariants();
    } catch (error) {
      let message = 'Failed to add variant';

      if (error instanceof ZodError) {
        message = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      } else if (error instanceof Error) {
        message = error.message;
      }

      setError(new Error(message));
      toast.error(message);
      throw error;
    }
  };

  const updateVariant = async (id: string, variant: VariantUpdate) => {
    try {
      // Validate the update data
      const validatedUpdate = ProductVariantSchema.partial().parse(variant);

      const response = await fetch(`/api/products/${productId}/variants?variantId=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedUpdate),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update variant');
      }

      toast.success('Variant updated successfully');
      invalidateVariants();
    } catch (error) {
      let message = 'Failed to update variant';

      if (error instanceof ZodError) {
        message = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      } else if (error instanceof Error) {
        message = error.message;
      }

      setError(new Error(message));
      toast.error(message);
      throw error;
    }
  };

  const deleteVariant = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${productId}/variants?variantId=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete variant');
      }

      toast.success('Variant deleted successfully');
      invalidateVariants();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete variant';
      setError(new Error(message));
      toast.error(message);
      throw error;
    }
  };

  const updateStock = async (id: string, newStock: number) => {
    try {
      const response = await fetch(`/api/products/${productId}/variants/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId: id, stock: newStock }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update stock');
      }

      toast.success('Stock updated successfully');
      invalidateVariants();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update stock';
      setError(new Error(message));
      toast.error(message);
      throw error;
    }
  };

  const toggleAvailability = async (id: string) => {
    const variant = variants.find(v => v.id === id);
    if (!variant) {
      throw new Error('Variant not found');
    }

    try {
      await updateVariant(id, { isAvailable: !variant.isAvailable });
      toast.success(`Variant ${variant.isAvailable ? 'disabled' : 'enabled'} successfully`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to toggle availability';
      setError(new Error(message));
      toast.error(message);
      throw error;
    }
  };

  return {
    variants,
    isLoading,
    error,
    addVariant,
    updateVariant,
    deleteVariant,
    updateStock,
    toggleAvailability,
  };
}
