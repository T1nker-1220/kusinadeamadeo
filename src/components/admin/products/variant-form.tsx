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
import { zodResolver } from '@hookform/resolvers/zod';
import { VariantType } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const variantFormSchema = z.object({
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
  const { uploadImage } = useImageUpload({
    type: 'variant',
    onSuccess: (result) => {
      form.setValue('imageUrl', result.url);
    },
  });

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
      const response = await fetch(`/api/products/${productId}/variants`, {
        method: initialData ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialData ? { variantId: initialData.id, ...data } : data),
      });

      if (!response.ok) {
        throw new Error('Failed to save variant');
      }

      toast.success(initialData ? 'Variant updated' : 'Variant created');
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving variant:', error);
      toast.error('Failed to save variant');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  onRemove={() => field.onChange('')}
                  onUpload={uploadImage}
                />
              </FormControl>
              <FormDescription>
                Optional image for this variant
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

        <Button type="submit" disabled={!form.formState.isDirty}>
          {initialData ? 'Update Variant' : 'Add Variant'}
        </Button>
      </form>
    </Form>
  );
}
