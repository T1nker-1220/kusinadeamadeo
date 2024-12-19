import { supabase } from '@/lib/supabase/client'
import type { ProductWithDetails, ProductCategory } from '@/types/product'

class ProductService {
  async getProducts(category?: ProductCategory): Promise<ProductWithDetails[]> {
    try {
      console.log('Fetching products from Supabase...')
      
      // Start with the base query
      let query = supabase
        .from('products')
        .select(`
          *,
          variants:product_variants (
            id,
            name,
            price,
            size,
            flavor,
            available,
            created_at,
            updated_at
          ),
          availableAddons:product_available_addons (
            addon:product_addons (
              id,
              name,
              price,
              available,
              created_at,
              updated_at
            )
          )
        `)
        .eq('available', true) // Only fetch available products by default

      // Add category filter if specified
      if (category) {
        query = query.eq('category', category)
      }

      // Execute the query
      const { data: products, error } = await query

      // Handle query error
      if (error) {
        console.error('Supabase query error:', error)
        throw new Error(`Failed to fetch products: ${error.message}`)
      }

      if (!products) {
        console.log('No products found')
        return []
      }

      // Transform the data
      const transformedProducts: ProductWithDetails[] = products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        imageUrl: product.image_url,
        basePrice: product.base_price,
        available: product.available,
        hasVariants: product.has_variants,
        hasAddons: product.has_addons,
        createdAt: new Date(product.created_at),
        updatedAt: new Date(product.updated_at),
        variants: product.variants?.map(variant => ({
          id: variant.id,
          productId: product.id,
          name: variant.name,
          price: variant.price,
          size: variant.size,
          flavor: variant.flavor,
          available: variant.available,
          createdAt: new Date(variant.created_at),
          updatedAt: new Date(variant.updated_at)
        })) || [],
        availableAddons: product.availableAddons?.map(relation => 
          relation.addon && {
            id: relation.addon.id,
            name: relation.addon.name,
            price: relation.addon.price,
            available: relation.addon.available,
            createdAt: new Date(relation.addon.created_at),
            updatedAt: new Date(relation.addon.updated_at)
          }
        ).filter(Boolean) || []
      }))

      return transformedProducts
    } catch (error) {
      console.error('Product service error:', error)
      throw error instanceof Error 
        ? error 
        : new Error('An unexpected error occurred while fetching products')
    }
  }

  async getProductById(id: string): Promise<ProductWithDetails | null> {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          variants:product_variants (
            id,
            name,
            price,
            size,
            flavor,
            available,
            created_at,
            updated_at
          ),
          availableAddons:product_available_addons (
            addon:product_addons (
              id,
              name,
              price,
              available,
              created_at,
              updated_at
            )
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
        throw new Error(`Failed to fetch product: ${error.message}`)
      }

      if (!product) {
        return null
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        imageUrl: product.image_url,
        basePrice: product.base_price,
        available: product.available,
        hasVariants: product.has_variants,
        hasAddons: product.has_addons,
        createdAt: new Date(product.created_at),
        updatedAt: new Date(product.updated_at),
        variants: product.variants?.map(variant => ({
          id: variant.id,
          productId: product.id,
          name: variant.name,
          price: variant.price,
          size: variant.size,
          flavor: variant.flavor,
          available: variant.available,
          createdAt: new Date(variant.created_at),
          updatedAt: new Date(variant.updated_at)
        })) || [],
        availableAddons: product.availableAddons?.map(relation => 
          relation.addon && {
            id: relation.addon.id,
            name: relation.addon.name,
            price: relation.addon.price,
            available: relation.addon.available,
            createdAt: new Date(relation.addon.created_at),
            updatedAt: new Date(relation.addon.updated_at)
          }
        ).filter(Boolean) || []
      }
    } catch (error) {
      console.error('Error in getProductById:', error)
      throw error instanceof Error 
        ? error 
        : new Error('An unexpected error occurred while fetching the product')
    }
  }
}

export const productService = new ProductService() 