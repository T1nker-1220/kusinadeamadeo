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
import { useImageUpload } from '@/hooks/use-image-upload';
import { useVariantManagement } from '@/hooks/use-variant-management';
import { ProductImageService } from '@/lib/services/product-image';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductVariant, VariantType } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type VariantInput = Omit<ProductVariant, 'id' | 'productId' | 'createdAt' | 'updatedAt'>;

const variantFormSchema = z.object({
  type: z.nativeEnum(VariantType),
  name: z.string().min(1, 'Name is required').max(50),
  price: z.coerce.number().min(0, 'Price must be greater than 0'),
  stock: z.coerce.number().min(0, 'Stock must be 0 or greater'),
  isAvailable: z.boolean().default(true),
  imageUrl: z.string().nullable(),
});

type VariantFormValues = z.infer<typeof variantFormSchema>;

interface VariantFormProps {
  productId: string;
  initialData?: ProductVariant;
  onSuccess?: () => void;
}

export function VariantForm({ productId, initialData, onSuccess }: VariantFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { uploadImage, isUploading } = useImageUpload();
  const { addVariant, updateVariant } = useVariantManagement({ productId });

  const form = useForm<VariantFormValues>({
    resolver: zodResolver(variantFormSchema),
    defaultValues: {
      type: initialData?.type || VariantType.SIZE,
      name: initialData?.name || '',
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
      isAvailable: initialData?.isAvailable ?? true,
      imageUrl: initialData?.imageUrl || null,
    },
  });

  const onSubmit = async (data: VariantFormValues) => {
    try {
      setIsLoading(true);

      const variantData: VariantInput = {
        type: data.type,
        name: data.name,
        price: data.price,
        stock: data.stock,
        isAvailable: data.isAvailable,
        imageUrl: data.imageUrl,
      };

      if (initialData?.id) {
        await updateVariant(initialData.id, variantData);
      } else {
        await addVariant(variantData);
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error saving variant:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save variant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsLoading(true);
      const { url, path } = await ProductImageService.uploadVariantImage(file, form.getValues('imageUrl'));
      form.setValue('imageUrl', url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue defaultValue={field.value} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={VariantType.SIZE}>Size</SelectItem>
                  <SelectItem value={VariantType.FLAVOR}>Flavor</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="Enter variant name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  disabled={isLoading}
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  disabled={isLoading}
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
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
                  Make this variant available for purchase
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  disabled={isLoading}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value || ''}
                  disabled={isLoading}
                  onChange={(url) => field.onChange(url)}
                  onUpload={handleImageUpload}
                  isUploading={isUploading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading || isUploading} type="submit" className="w-full">
          {isLoading || isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {initialData?.id ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>{initialData?.id ? 'Update variant' : 'Create variant'}</>
          )}
        </Button>
      </form>
    </Form>
  );
}
