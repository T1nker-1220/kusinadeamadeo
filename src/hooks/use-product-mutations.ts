import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ProductMutationData {
  name: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  basePrice: number;
  isAvailable: boolean;
}

export function useProductMutations() {
  const queryClient = useQueryClient();

  // Helper function to invalidate product caches
  const invalidateProductCaches = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['products'] }),
      queryClient.invalidateQueries({ queryKey: ['product'] })
    ]);
  };

  // Create product mutation
  const createProduct = useMutation({
    mutationFn: async (data: ProductMutationData) => {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create product');
      }

      return response.json();
    },
    onSuccess: async (data) => {
      await invalidateProductCaches();
      toast.success('Product created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Update product mutation
  const updateProduct = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductMutationData> }) => {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update product');
      }

      return response.json();
    },
    onSuccess: async (data) => {
      await invalidateProductCaches();
      toast.success('Product updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Delete product mutation
  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete product');
      }

      return response.json();
    },
    onSuccess: async () => {
      await invalidateProductCaches();
      toast.success('Product deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
