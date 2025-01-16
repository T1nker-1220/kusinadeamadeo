import { ProductsDataTable } from '@/components/admin/products/products-data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function ProductsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your products
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>
      <ProductsDataTable />
    </div>
  );
}
