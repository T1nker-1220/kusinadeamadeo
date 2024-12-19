import { supabase } from '@/lib/supabase/client'

export const uploadService = {
  async uploadProductImage(file: File): Promise<string> {
    // Generate a unique filename
    const timestamp = new Date().getTime()
    const fileExt = file.name.split('.').pop()
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `products/${fileName}`

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) throw uploadError

    // Get the public URL
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return data.publicUrl
  },

  async deleteProductImage(url: string): Promise<void> {
    // Extract the file path from the URL
    const filePath = url.split('product-images/')[1]
    if (!filePath) return

    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath])

    if (error) throw error
  },

  // Helper function to validate image files
  validateImage(file: File): string | null {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'File must be an image'
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return 'Image must be less than 5MB'
    }

    return null
  }
} 