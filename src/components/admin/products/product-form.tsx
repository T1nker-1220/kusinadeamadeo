'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ImageUpload } from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useProductMutations } from '@/hooks/use-product-mutations';
import { validateProductsPerCategory } from '@/lib/validations/category';
import { productSchema, type ProductFormValues } from '@/lib/validations/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ProductFormProps {
  initialData?: ProductFormValues;
  categoryId: string;
  onSuccess?: () => void;
}

interface CategoryResponse {
  id: string;
  name: string;
}

async function getCategories() {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await response.json();
  return data as CategoryResponse[];
}

export function ProductForm({ initialData, categoryId, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const { uploadImage } = useImageUpload({
    type: 'product',
    onSuccess: (result) => {
      form.setValue('imageUrl', result.url);
    },
  });

  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const categories = categoriesData?.map((category: CategoryResponse) => ({
    label: category.name,
    value: category.id,
  })) ?? [];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createProduct, updateProduct } = useProductMutations();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      imageUrl: '',
      basePrice: 0,
      isAvailable: true,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);

      // Check category product limit if creating new product
      if (!initialData) {
        const { isValid, error } = await validateProductsPerCategory(categoryId);
        if (!isValid) {
          toast.error(error);
          return;
        }
      }

      if (initialData) {
        await updateProduct.mutateAsync({
          id: initialData.id,
          data: {
            ...data,
            categoryId,
          },
        });
      } else {
        await createProduct.mutateAsync({
          ...data,
          categoryId,
        });
      }

      onSuccess?.();
      form.reset();
      toast.success(
        initialData
          ? 'Product updated successfully'
          : 'Product created successfully'
      );
    } catch (error) {
      console.error('Product form error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCategoriesLoading) {
    return <div>Loading categories...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  onRemove={() => field.onChange('')}
                  onUpload={uploadImage}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Product description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
                </FormControl>
                <FormDescription>
                  This is the base price for the product. Variants can have
                  different prices.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isAvailable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Availability</FormLabel>
                  <FormDescription>
                    This product will be hidden from the store if disabled.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || !form.formState.isDirty}
          loading={isSubmitting}
        >
          {initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </form>
    </Form>
  );
}
