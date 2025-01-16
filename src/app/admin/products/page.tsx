'use client';

import { ProductsDataTable } from '@/components/admin/products/products-data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="text-center py-4">
      <h2 className="text-lg font-semibold text-red-500">Something went wrong:</h2>
      <pre className="text-sm text-gray-500">{error.message}</pre>
      <Button
        className="mt-4"
        onClick={() => {
          resetErrorBoundary();
          toast.success('Retrying...');
        }}
      >
        Try again
      </Button>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
      <div className="h-[400px] bg-gray-100 rounded-lg"></div>
    </div>
  );
}

export default function ProductsPage() {
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
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // Reset any state that could have caused the error
          window.location.reload();
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <ProductsDataTable />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
