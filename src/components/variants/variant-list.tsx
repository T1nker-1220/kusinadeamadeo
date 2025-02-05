'use client';

import { Button } from '@/components/ui/button';
import { AvailabilityToggle } from '@/components/variants/availability-toggle';
import { DeleteVariantDialog } from '@/components/variants/delete-variant-dialog';
import { StockUpdate } from '@/components/variants/stock-update';
import { useSorting } from '@/hooks/use-sorting';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import { ProductVariant } from '@prisma/client';
import { ArrowUpDown } from 'lucide-react';

type SortableFields = 'name' | 'price' | 'stock';

interface VariantListProps {
  variants: ProductVariant[];
  productId: string;
  onEdit: (variant: ProductVariant) => void;
}

export function VariantList({
  variants,
  productId,
  onEdit,
}: VariantListProps) {
  const {
    sortedItems: sortedVariants,
    sortKey,
    sortOrder,
    setSortKey,
    toggleSortOrder,
  } = useSorting<ProductVariant, SortableFields>({
    items: variants,
    defaultSortKey: 'name',
  });

  const handleSort = (key: SortableFields) => {
    if (sortKey === key) {
      toggleSortOrder();
    } else {
      setSortKey(key);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-4 py-2 font-medium">
        <Button
          variant="ghost"
          onClick={() => handleSort('name')}
          className={cn(
            'flex items-center justify-start px-2',
            sortKey === 'name' && 'underline'
          )}
        >
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleSort('price')}
          className={cn(
            'flex items-center justify-start px-2',
            sortKey === 'price' && 'underline'
          )}
        >
          Price <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleSort('stock')}
          className={cn(
            'flex items-center justify-start px-2',
            sortKey === 'stock' && 'underline'
          )}
        >
          Stock <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
        <div>Status</div>
        <div>Image</div>
        <div>Actions</div>
      </div>

      {sortedVariants.map((variant) => (
        <div key={variant.id} className="grid grid-cols-6 gap-4 py-2 border-t">
          <div>{variant.name}</div>
          <div>{formatCurrency(variant.price)}</div>
          <div>
            <StockUpdate
              productId={productId}
              variantId={variant.id}
              currentStock={variant.stock}
            />
          </div>
          <div>
            <AvailabilityToggle
              productId={productId}
              variantId={variant.id}
              isAvailable={variant.isAvailable}
            />
          </div>
          <div>
            {variant.imageUrl && (
              <img
                src={variant.imageUrl}
                alt={variant.name}
                className="h-10 w-10 object-cover rounded-md"
              />
            )}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(variant)}
            >
              Edit
            </Button>
            <DeleteVariantDialog
              productId={productId}
              variantId={variant.id}
              variantName={variant.name}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
