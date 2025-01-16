'use client';

import { ProductForm } from '@/components/admin/products/product-form';

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">New Product</h2>
        <p className="text-muted-foreground">
          Add a new product to your store
        </p>
      </div>
      <ProductForm />
    </div>
  );
}
