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
import { useVariantManagement } from '@/hooks/use-variant-management';
import { formatCurrency } from '@/lib/utils';
import { ProductVariant } from '@prisma/client';
import { Edit, Minus, MoreHorizontal, Plus, Trash } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { VariantForm } from './variant-form';

interface VariantsListProps {
  productId: string;
}

export function VariantsList({ productId }: VariantsListProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const {
    variants,
    isLoading,
    deleteVariant,
    updateStock,
    toggleAvailability,
  } = useVariantManagement({ productId });

  // Sort variants based on current sort settings
  const sortedVariants = [...variants].sort((a, b) => {
    const modifier = sortOrder === 'asc' ? 1 : -1;

    switch (sortBy) {
      case 'name':
        return modifier * a.name.localeCompare(b.name);
      case 'price':
        return modifier * (a.price - b.price);
      case 'stock':
        return modifier * (a.stock - b.stock);
      default:
        return 0;
    }
  });

  const handleDelete = async (variantId: string) => {
    try {
      await deleteVariant(variantId);
    } catch (error) {
      console.error('Error deleting variant:', error);
    }
  };

  const handleStockUpdate = async (variantId: string, newStock: number) => {
    try {
      await updateStock(variantId, newStock);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const handleAvailabilityToggle = async (variantId: string) => {
    try {
      await toggleAvailability(variantId);
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Variants</h3>
          <div className="flex items-center space-x-4">
            <select
              className="text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'stock')}
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="stock">Sort by Stock</option>
            </select>
            <button
              className="text-sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
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
              onSuccess={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border p-4 space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : sortedVariants.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No variants found. Add your first variant to get started.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedVariants.map((variant) => (
            <Card key={variant.id}>
              <CardHeader>
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
                      <Badge
                        variant={variant.isAvailable ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => handleAvailabilityToggle(variant.id)}
                      >
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
      )}

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
              initialData={selectedVariant}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setSelectedVariant(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
