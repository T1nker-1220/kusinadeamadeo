import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

interface UseVariantDeletionProps {
  productId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useVariantDeletion({
  productId,
  onSuccess,
  onError,
}: UseVariantDeletionProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const deleteVariant = async (variantId: string) => {
    setIsDeleting(true);
    let previousVariants: any = null;

    try {
      // Optimistically update the UI
      await queryClient.cancelQueries({ queryKey: ['variants', productId] });

      previousVariants = queryClient.getQueryData(['variants', productId]);

      queryClient.setQueryData(['variants', productId], (old: any) => {
        return old.filter((variant: any) => variant.id !== variantId);
      });

      // Make the API call
      const response = await fetch(`/api/products/${productId}/variants/${variantId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete variant');
      }

      toast.success('Variant deleted successfully');
      onSuccess?.();

    } catch (error) {
      // Revert the optimistic update
      if (previousVariants) {
        queryClient.setQueryData(['variants', productId], previousVariants);
      }

      const errorMessage = error instanceof Error ? error.message : 'Failed to delete variant';
      toast.error(errorMessage);
      onError?.(error as Error);

    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteVariant,
    isDeleting,
  };
}
