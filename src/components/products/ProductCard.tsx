import * as React from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"
import { cn } from "@/lib/utils"
import type { ProductWithDetails } from "@/types/product"

interface ProductCardProps {
  product: ProductWithDetails
  onAddToCart?: (
    product: ProductWithDetails,
    variantId?: string,
    addonIds?: string[]
  ) => void
  className?: string
}

export function ProductCard({ product, onAddToCart, className }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = React.useState(
    product.variants?.[0]?.id
  )
  const [selectedAddons, setSelectedAddons] = React.useState<string[]>([])

  const handleAddToCart = () => {
    onAddToCart?.(product, selectedVariant, selectedAddons)
  }

  const calculatePrice = () => {
    let price = 0

    if (product.hasVariants && selectedVariant) {
      const variant = product.variants?.find((v) => v.id === selectedVariant)
      price = variant?.price || 0
    } else {
      price = product.basePrice || 0
    }

    // Add addon prices
    selectedAddons.forEach((addonId) => {
      const addon = product.availableAddons?.find((a) => a.id === addonId)
      if (addon) {
        price += addon.price
      }
    })

    return price
  }

  return (
    <Card
      variant="interactive"
      className={cn("overflow-hidden", className)}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <span className="text-lg font-semibold text-white">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      <CardHeader>
        <div className="space-y-1">
          <h3 className="font-display text-lg font-semibold text-text-primary">
            {product.name}
          </h3>
          <p className="text-sm text-text-secondary">{product.description}</p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Variants */}
          {product.hasVariants && product.variants && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">
                Select Option
              </label>
              <Select
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
              >
                {product.variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.name} - ₱{variant.price.toFixed(2)}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {/* Add-ons */}
          {product.hasAddons && product.availableAddons && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">
                Add-ons
              </label>
              <div className="space-y-2">
                {product.availableAddons.map((addon) => (
                  <label
                    key={addon.id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/10 bg-surface-secondary text-brand-orange focus:ring-brand-orange/50"
                      checked={selectedAddons.includes(addon.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAddons([...selectedAddons, addon.id])
                        } else {
                          setSelectedAddons(
                            selectedAddons.filter((id) => id !== addon.id)
                          )
                        }
                      }}
                    />
                    <span className="text-sm text-text-primary">
                      {addon.name} (+₱{addon.price.toFixed(2)})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-brand-orange">
              ₱{calculatePrice().toFixed(2)}
            </span>
            <Button
              size="sm"
              disabled={
                !product.available ||
                (product.hasVariants && !selectedVariant)
              }
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 