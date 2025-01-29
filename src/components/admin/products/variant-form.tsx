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
import { ProductImageService } from '@/lib/services/product-image';
import { zodResolver } from '@hookform/resolvers/zod';
import { VariantType } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const variantFormSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['SIZE', 'FLAVOR']),
  name: z.string().min(1, 'Name is required').max(50),
  price: z.coerce.number().min(0, 'Price must be greater than 0'),
  stock: z.coerce.number().min(0, 'Stock must be 0 or greater'),
  isAvailable: z.boolean().default(true),
  imageUrl: z.string().optional(),
});

type VariantFormValues = z.infer<typeof variantFormSchema>;

interface VariantFormProps {
  productId: string;
  initialData?: VariantFormValues;
  onSuccess?: () => void;
}

export function VariantForm({ productId, initialData, onSuccess }: VariantFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { uploadImage } = useImageUpload({
    type: 'variant',
    onSuccess: (result) => {
      form.setValue('imageUrl', result.url, {
        shouldDirty: true,
        shouldTouch: true
      });
      toast.success('Image uploaded successfully');
    },
    onError: () => {
      toast.error('Failed to upload image');
    },
  });

  const handleImageRemove = async () => {
    try {
      setIsRemoving(true);
      const currentImageUrl = form.getValues('imageUrl');
      const variantId = form.getValues('id');

      if (currentImageUrl) {
        if (variantId) {
          // If variant exists, delete from both storage and database
          const response = await fetch(
            `/api/products/${productId}/variants/image?variantId=${variantId}`,
            { method: 'DELETE' }
          );

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete image');
          }

          const result = await response.json();

          // Update form with the returned variant data
          if (result.variant) {
            form.reset(result.variant, {
              keepDefaultValues: true,
              keepDirty: true
            });
          } else {
            form.setValue('imageUrl', '', {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true
            });
          }
        } else {
          // If variant doesn't exist yet, just delete from storage
          const imagePath = ProductImageService.getImagePath(currentImageUrl);
          if (imagePath) {
            await fetch(`/api/upload?path=${encodeURIComponent(imagePath)}`, {
              method: 'DELETE'
            });
            form.setValue('imageUrl', '', {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true
            });
          }
        }

        toast.success('Image removed successfully');
      }
    } catch (error) {
      console.error('Error removing image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove image';
      toast.error(errorMessage);

      // Reset form state if image removal fails
      const currentImageUrl = form.getValues('imageUrl');
      if (currentImageUrl) {
        form.setValue('imageUrl', currentImageUrl, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false
        });
      }
    } finally {
      setIsRemoving(false);
    }
  };

  const form = useForm<VariantFormValues>({
    resolver: zodResolver(variantFormSchema),
    defaultValues: initialData || {
      type: 'SIZE',
      name: '',
      price: 0,
      stock: 0,
      isAvailable: true,
      imageUrl: '',
    },
  });

  const onSubmit = async (data: VariantFormValues) => {
    try {
      setIsSubmitting(true);
      const url = `/api/products/${productId}/variants${initialData?.id ? `?variantId=${initialData.id}` : ''}`;

      const response = await fetch(url, {
        method: initialData ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save variant');
      }

      const result = await response.json();
      toast.success(initialData ? 'Variant updated successfully' : 'Variant created successfully');
      onSuccess?.();
      form.reset(result.variant || data);
    } catch (error) {
      console.error('Error saving variant:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save variant');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variant Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select variant type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={VariantType.SIZE}>Size</SelectItem>
                    <SelectItem value={VariantType.FLAVOR}>Flavor</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose between size or flavor variant
                </FormDescription>
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
                  <Input placeholder="Variant name" {...field} />
                </FormControl>
                <FormDescription>
                  The name of this variant (e.g., "Large" or "Chocolate")
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
                </FormControl>
                <FormDescription>
                  The price for this variant
                </FormDescription>
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
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormDescription>
                  Current stock level for this variant
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variant Image</FormLabel>
              <FormControl>
                <div className="max-w-[200px]">
                  <ImageUpload
                    value={field.value}
                    onChange={(url) => {
                      field.onChange(url);
                      form.setValue('imageUrl', url, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true
                      });
                    }}
                    onRemove={handleImageRemove}
                    onUpload={uploadImage}
                    disabled={isSubmitting || isRemoving}
                  />
                </div>
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
                  This variant will be hidden if disabled
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

        <Button
          type="submit"
          disabled={isSubmitting || isRemoving || !form.formState.isDirty || form.formState.isSubmitting}
          className="w-full"
        >
          {isSubmitting || form.formState.isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {initialData ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            initialData ? 'Update Variant' : 'Add Variant'
          )}
        </Button>
      </form>
    </Form>
  );
}
