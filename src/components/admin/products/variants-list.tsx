'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/lib/utils';
import { ProductVariant } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { Edit, Minus, MoreHorizontal, Plus, Trash } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { VariantForm } from './variant-form';

interface VariantsListProps {
  productId: string;
}

async function getVariants(productId: string) {
  const response = await fetch(`/api/products/${productId}/variants`);
  if (!response.ok) {
    throw new Error('Failed to fetch variants');
  }
  return response.json();
}

export function VariantsList({ productId }: VariantsListProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: variants = [], refetch } = useQuery({
    queryKey: ['variants', productId],
    queryFn: () => getVariants(productId),
  });

  const handleDelete = async (variantId: string) => {
    try {
      const response = await fetch(
        `/api/products/${productId}/variants?variantId=${variantId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Failed to delete variant');
      }

      toast.success('Variant deleted');
      refetch();
    } catch (error) {
      console.error('Error deleting variant:', error);
      toast.error('Failed to delete variant');
    }
  };

  const handleStockUpdate = async (variantId: string, newStock: number) => {
    try {
      const response = await fetch(
        `/api/products/${productId}/variants/stock`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ variantId, stock: newStock }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update stock');
      }

      toast.success('Stock updated');
      refetch();
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Variants</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Variant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Variant</DialogTitle>
              <DialogDescription>
                Add a new variant to this product
              </DialogDescription>
            </DialogHeader>
            <VariantForm
              productId={productId}
              onSuccess={() => {
                setIsAddDialogOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {variants.map((variant: ProductVariant) => (
          <Card key={variant.id}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{variant.name}</CardTitle>
                  <CardDescription>
                    {variant.type} - {formatCurrency(variant.price)}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedVariant(variant);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(variant.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-4">
                {variant.imageUrl && (
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={variant.imageUrl}
                      alt={variant.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Stock</p>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleStockUpdate(variant.id, Math.max(0, variant.stock - 1))}
                          disabled={variant.stock <= 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <p className="text-sm text-muted-foreground min-w-[3ch] text-center">
                          {variant.stock}
                        </p>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleStockUpdate(variant.id, variant.stock + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Badge variant={variant.isAvailable ? 'default' : 'secondary'}>
                      {variant.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Price</p>
                    <p className="text-sm font-medium">{formatCurrency(variant.price)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Variant</DialogTitle>
            <DialogDescription>
              Make changes to this variant
            </DialogDescription>
          </DialogHeader>
          {selectedVariant && (
            <VariantForm
              productId={productId}
              initialData={{
                type: selectedVariant.type,
                name: selectedVariant.name,
                price: selectedVariant.price,
                stock: selectedVariant.stock,
                isAvailable: selectedVariant.isAvailable,
                imageUrl: selectedVariant.imageUrl || undefined,
              }}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setSelectedVariant(null);
                refetch();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
