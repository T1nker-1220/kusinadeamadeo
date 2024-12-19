"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Loading } from "@/components/ui/Loading"
import { Modal } from "@/components/ui/Modal"
import { ProductForm } from "@/components/admin/ProductForm"
import { productService } from "@/lib/services/product.service"
import { uploadService } from "@/lib/services/upload.service"
import { checkDatabaseConnection } from "@/lib/supabase/client"
import type { ProductWithDetails, CreateProductInput } from "@/types/product"

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = React.useState<ProductWithDetails[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<ProductWithDetails | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isConnected, setIsConnected] = React.useState(false)

  // Check database connection first
  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('Checking database connection...')
        const connected = await checkDatabaseConnection()
        console.log('Database connection status:', connected)
        setIsConnected(connected)
      } catch (err) {
        console.error('Database connection error:', err)
        setError('Failed to connect to database')
      }
    }
    checkConnection()
  }, [])

  // Fetch products
  const fetchProducts = React.useCallback(async () => {
    if (!isConnected) {
      console.log('Skipping product fetch - database not connected')
      return
    }

    try {
      console.log('Fetching products...')
      setIsLoading(true)
      setError(null)
      const data = await productService.getProducts()
      console.log('Products fetched:', data)
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err instanceof Error ? err.message : "Failed to load products")
    } finally {
      setIsLoading(false)
    }
  }, [isConnected])

  React.useEffect(() => {
    console.log('ProductsPage mounted, isConnected:', isConnected)
    if (isConnected) {
      fetchProducts()
    }
  }, [fetchProducts, isConnected])

  // Handle create/edit product
  const handleSubmit = async (data: CreateProductInput) => {
    try {
      console.log('Submitting product data:', data)
      setIsSaving(true)
      setError(null)

      if (selectedProduct) {
        console.log('Updating existing product:', selectedProduct.id)
        // If image changed, delete old image
        if (data.imageUrl !== selectedProduct.imageUrl) {
          console.log('Image changed, deleting old image:', selectedProduct.imageUrl)
          await uploadService.deleteProductImage(selectedProduct.imageUrl)
        }
        await productService.updateProduct(selectedProduct.id, data)
      } else {
        console.log('Creating new product')
        await productService.createProduct(data)
      }

      setIsModalOpen(false)
      setSelectedProduct(null)
      fetchProducts()
    } catch (err) {
      console.error('Error saving product:', err)
      setError(err instanceof Error ? err.message : "Failed to save product")
    } finally {
      setIsSaving(false)
    }
  }

  // Handle delete product
  const handleDelete = async (product: ProductWithDetails) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      console.log('Deleting product:', product.id)
      setIsLoading(true)
      setError(null)
      
      if (product.imageUrl) {
        console.log('Deleting product image:', product.imageUrl)
        await uploadService.deleteProductImage(product.imageUrl)
      }
      
      await productService.deleteProduct(product.id)
      console.log('Product deleted successfully')
      fetchProducts()
    } catch (err) {
      console.error('Error deleting product:', err)
      setError(err instanceof Error ? err.message : "Failed to delete product")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle toggle availability
  const handleToggleAvailability = async (product: ProductWithDetails) => {
    try {
      console.log('Toggling availability for product:', product.id)
      setError(null)
      await productService.toggleProductAvailability(product.id)
      console.log('Availability toggled successfully')
      fetchProducts()
    } catch (err) {
      console.error('Error toggling availability:', err)
      setError(err instanceof Error ? err.message : "Failed to update availability")
    }
  }

  if (!isConnected) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-2">Unable to connect to database</p>
          <Button onClick={() => window.location.reload()}>Retry Connection</Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loading size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Products
        </h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Product</Button>
      </div>

      {error && (
        <div className="rounded-lg bg-error/10 p-4 text-error">
          {error}
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {products.length === 0 && !error ? (
        <Card className="p-6">
          <div className="text-center text-text-secondary">
            <p>No products found. Click "Add Product" to create one.</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card
              key={product.id}
              className="flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3]">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full rounded-t-lg object-cover"
                    onError={(e) => {
                      console.error('Image load error:', product.imageUrl)
                      e.currentTarget.src = '/images/placeholder.jpg'
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 rounded-t-lg">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                {!product.available && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <span className="text-lg font-semibold text-white">
                      Currently Unavailable
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-text-secondary">
                  {product.description}
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
                  <span>{product.category}</span>
                  {product.basePrice && (
                    <>
                      <span>•</span>
                      <span>₱{product.basePrice.toFixed(2)}</span>
                    </>
                  )}
                </div>

                {/* Variants Summary */}
                {product.hasVariants && product.variants.length > 0 && (
                  <div className="mt-2 text-sm text-text-secondary">
                    <p>{product.variants.length} variants available</p>
                  </div>
                )}

                {/* Add-ons Summary */}
                {product.hasAddons && product.availableAddons.length > 0 && (
                  <div className="mt-1 text-sm text-text-secondary">
                    <p>{product.availableAddons.length} add-ons available</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-white/10 p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleAvailability(product)}
                >
                  {product.available ? "Mark Unavailable" : "Mark Available"}
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedProduct(product)
                      setIsModalOpen(true)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(product)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={() => {
          if (!isSaving) {
            setIsModalOpen(false)
            setSelectedProduct(null)
          }
        }}
      >
        <ProductForm
          initialData={selectedProduct || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            if (!isSaving) {
              setIsModalOpen(false)
              setSelectedProduct(null)
            }
          }}
          isLoading={isSaving}
        />
      </Modal>
    </div>
  )
} 