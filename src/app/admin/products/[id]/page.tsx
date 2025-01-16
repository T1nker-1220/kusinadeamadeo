'use client';

import { ProductForm } from '@/components/admin/products/product-form';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

async function getProduct(id: string) {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  const data = await response.json();
  return data;
}

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading product</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Product</h2>
        <p className="text-muted-foreground">
          Make changes to your product here
        </p>
      </div>
      <ProductForm initialData={data} />
    </div>
  );
}
