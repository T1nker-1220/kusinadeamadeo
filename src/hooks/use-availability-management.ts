import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

interface UseAvailabilityManagementProps {
  productId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useAvailabilityManagement({
  productId,
  onSuccess,
  onError,
}: UseAvailabilityManagementProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const toggleAvailability = async (variantId: string, isAvailable: boolean) => {
    setIsUpdating(true);
    let previousVariants: any = null;

    try {
      // Optimistically update the UI
      await queryClient.cancelQueries({ queryKey: ['variants', productId] });

      previousVariants = queryClient.getQueryData(['variants', productId]);

      queryClient.setQueryData(['variants', productId], (old: any) => {
        return old.map((variant: any) =>
          variant.id === variantId ? { ...variant, isAvailable } : variant
        );
      });

      // Make the API call
      const response = await fetch(`/api/products/${productId}/variants/${variantId}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAvailable }),
      });

      if (!response.ok) {
        throw new Error('Failed to update availability');
      }

      toast.success(`Variant ${isAvailable ? 'enabled' : 'disabled'} successfully`);
      onSuccess?.();

    } catch (error) {
      // Revert the optimistic update
      if (previousVariants) {
        queryClient.setQueryData(['variants', productId], previousVariants);
      }

      const errorMessage = error instanceof Error ? error.message : 'Failed to update availability';
      toast.error(errorMessage);
      onError?.(error as Error);

    } finally {
      setIsUpdating(false);
    }
  };

  return {
    toggleAvailability,
    isUpdating,
  };
}
