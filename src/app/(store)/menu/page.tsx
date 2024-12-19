'use client'

import { useEffect, useState } from 'react'
import { productService } from '@/lib/services/product.service'
import type { ProductWithDetails, ProductCategory } from '@/types/product'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { ProductCard } from '@/components/products/ProductCard'
import { CategoryNav } from '@/components/products/CategoryNav'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MENU_CATEGORIES } from '@/config/menu'

export default function MenuPage() {
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | undefined>()

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const fetchedProducts = await productService.getProducts(selectedCategory)
        setProducts(fetchedProducts)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory])

  const handleRetry = () => {
    setError(null)
    setLoading(true)
    // Re-run the effect by changing selectedCategory
    setSelectedCategory(selectedCategory)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          <ErrorMessage message={error} />
          <Button 
            onClick={handleRetry}
            className="mt-4 w-full"
          >
            Retry Loading
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-text-primary">Our Menu</h1>
      
      {/* Category Navigation */}
      <div className="mb-8">
        <CategoryNav
          activeCategory={selectedCategory || 'all'}
          onSelect={(categoryId) => {
            const category = MENU_CATEGORIES.find(c => c.id === categoryId)
            setSelectedCategory(categoryId === 'all' ? undefined : categoryId as ProductCategory)
          }}
        />
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(product, variantId, addonIds) => {
                // TODO: Implement add to cart functionality
                console.log('Add to cart:', { product, variantId, addonIds })
              }}
            />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-text-secondary">
            {selectedCategory 
              ? `No products found in ${selectedCategory} category.`
              : 'No products available at the moment.'}
          </p>
        </Card>
      )}
    </div>
  )
} 