'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ImageUpload } from '@/components/ui/ImageUpload'
import type { ProductCategory } from '@/types/product'

// Form validation schema
const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['Budget Meals', 'Silog Meals', 'Ala Carte', 'Beverages', 'Special Orders'] as const),
  basePrice: z.number().min(0, 'Price must be positive'),
  available: z.boolean().default(true),
  hasVariants: z.boolean().default(false),
  hasAddons: z.boolean().default(false),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  onSubmit: (data: ProductFormData & { imageUrl: string }) => Promise<void>
  initialData?: ProductFormData & { imageUrl?: string }
  isEditing?: boolean
}

export function ProductForm({ onSubmit, initialData, isEditing = false }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      available: true,
      hasVariants: false,
      hasAddons: false,
    }
  })

  const handleImageUpload = async (file: File) => {
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadImage = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(`products/${fileName}`, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(`products/${fileName}`)

    return publicUrl
  }

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      let imageUrl = initialData?.imageUrl || ''

      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      await onSubmit({ ...data, imageUrl })
      
      if (!isEditing) {
        reset()
        setImagePreview(null)
        setImageFile(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && <ErrorMessage message={error} />}

      <div className="space-y-4">
        <ImageUpload
          currentImage={imagePreview}
          onUpload={handleImageUpload}
          className="w-full h-48"
        />

        <Input
          label="Product Name"
          {...register('name')}
          error={errors.name?.message}
        />

        <Input
          label="Description"
          {...register('description')}
          error={errors.description?.message}
          multiline
          rows={3}
        />

        <Select
          label="Category"
          {...register('category')}
          error={errors.category?.message}
          options={[
            { value: 'Budget Meals', label: 'Budget Meals' },
            { value: 'Silog Meals', label: 'Silog Meals' },
            { value: 'Ala Carte', label: 'Ala Carte' },
            { value: 'Beverages', label: 'Beverages' },
            { value: 'Special Orders', label: 'Special Orders' },
          ]}
        />

        <Input
          label="Base Price"
          type="number"
          step="0.01"
          {...register('basePrice', { valueAsNumber: true })}
          error={errors.basePrice?.message}
        />

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('available')}
              className="form-checkbox"
            />
            Available
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('hasVariants')}
              className="form-checkbox"
            />
            Has Variants
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('hasAddons')}
              className="form-checkbox"
            />
            Has Add-ons
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => reset()}
          disabled={isLoading}
        >
          Reset
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : isEditing ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  )
} 