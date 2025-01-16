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
import { zodResolver } from '@hookform/resolvers/zod';
import { Product } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().min(1, 'Image is required'),
  categoryId: z.string().min(1, 'Category is required'),
  basePrice: z.coerce.number().min(0, 'Base price must be greater than 0'),
  isAvailable: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: Product | null;
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

export function ProductForm({ initialData }: ProductFormProps) {
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

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      imageUrl: initialData?.imageUrl ?? '',
      categoryId: initialData?.categoryId ?? '',
      basePrice: initialData?.basePrice ?? 0,
      isAvailable: initialData?.isAvailable ?? true,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const response = await fetch(
        `/api/products${initialData ? `/${initialData.id}` : ''}`,
        {
          method: initialData ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      router.refresh();
      router.push('/admin/products');
      toast.success(
        initialData ? 'Product updated successfully' : 'Product created successfully'
      );
    } catch (error) {
      toast.error('Failed to save product');
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
        <Button type="submit" className="ml-auto">
          {initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </form>
    </Form>
  );
}
