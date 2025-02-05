import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

interface UseStockManagementProps {
  productId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useStockManagement({
  productId,
  onSuccess,
  onError,
}: UseStockManagementProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const updateStock = async (variantId: string, newStock: number) => {
    if (newStock < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    setIsUpdating(true);

    try {
      // Optimistically update the UI
      await queryClient.cancelQueries(['variants', productId]);

      const previousVariants = queryClient.getQueryData(['variants', productId]);

      queryClient.setQueryData(['variants', productId], (old: any) => {
        return old.map((variant: any) =>
          variant.id === variantId ? { ...variant, stock: newStock } : variant
        );
      });

      // Make the API call
      const response = await fetch(`/api/products/${productId}/variants/${variantId}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: newStock }),
      });

      if (!response.ok) {
        throw new Error('Failed to update stock');
      }

      toast.success('Stock updated successfully');
      onSuccess?.();

    } catch (error) {
      // Revert the optimistic update
      queryClient.setQueryData(['variants', productId], previousVariants);

      const errorMessage = error instanceof Error ? error.message : 'Failed to update stock';
      toast.error(errorMessage);
      onError?.(error as Error);

    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateStock,
    isUpdating,
  };
}
