"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Minus, Loader2 } from "lucide-react"
import { useCustomerStore } from "@/stores/customerStore"
import OptionsModal from './OptionsModal'
import toast from "react-hot-toast"
import { generateSignature } from "@/utils/cart"

type Option = {
  id: number;
  group_name: string;
  name: string;
  additional_price: number;
  is_available: boolean;
};

type Product = {
  id: number;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  is_available: boolean;
  owner?: string;
  options: Option[];
};

type ImprovedProductCardProps = {
  product: Product;
  isStoreOpen: boolean;
};

export default function ImprovedProductCard({ 
  product, 
  isStoreOpen 
}: ImprovedProductCardProps) {
  const { addToCart, updateQuantity, getCartItemQuantity, isKioskMode } = useCustomerStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // For products without options, get current quantity in cart
  const noOptionsSignature = generateSignature(product, [])
  const currentQuantity = getCartItemQuantity(noOptionsSignature)
  const hasOptions = product.options.length > 0

  const handleAddToCart = () => {
    // Don't allow adding unavailable products
    if (!product.is_available) {
      toast.error(`${product.name} is currently unavailable`)
      return
    }

    if (hasOptions) {
      setIsModalOpen(true)
    } else {
      handleQuantityChange('increase')
    }
  }

  const handleQuantityChange = async (action: 'increase' | 'decrease') => {
    if (!product.is_available || !isStoreOpen) return

    setIsUpdating(true)
    
    try {
      if (action === 'increase') {
        addToCart({
          id: product.id,
          name: product.name,
          base_price: product.base_price,
          image_url: product.image_url,
          is_available: product.is_available,
          owner: product.owner,
        })
        
        // Show animation feedback
        setJustAdded(true)
        setTimeout(() => setJustAdded(false), 600)
        
        toast.success(`${product.name} added to order!`)
      } else {
        updateQuantity(noOptionsSignature, 'decrease')
        
        // If quantity becomes 0, show brief feedback
        const newQuantity = getCartItemQuantity(noOptionsSignature) - 1
        if (newQuantity === 0) {
          toast.success(`${product.name} removed from order`)
        }
      }
    } catch (error) {
      toast.error('Failed to update quantity')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      <OptionsModal product={product} onClose={() => setIsModalOpen(false)} open={isModalOpen} />
      
      <div className={`bg-slate-800 border border-slate-600 hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 group overflow-hidden rounded-lg ${!product.is_available ? 'opacity-50 grayscale' : ''}`}>
        <div className="relative overflow-hidden">
          <Image
            src={product.image_url || "/images/products/logo.png"}
            alt={product.name}
            width={200}
            height={120}
            className="w-full h-24 sm:h-28 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {!product.is_available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-xs bg-red-600 px-2 py-1 rounded">UNAVAILABLE</span>
            </div>
          )}
        </div>

        <div className="p-2">
          <h3 className="font-bold text-sm text-white mb-1 group-hover:text-orange-400 transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-slate-400 text-xs mb-2 leading-tight line-clamp-2">{product.description}</p>
          )}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-green-400">₱{product.base_price}</span>
            {/* Availability badge */}
            <span className={`text-xs px-1 py-0.5 rounded ${product.is_available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {product.is_available ? 'Available' : 'Unavailable'}
            </span>
          </div>
          
          {/* Quantity Controls or Add Button */}
          {!hasOptions && currentQuantity > 0 ? (
            <div className={`flex items-center justify-between gap-1 ${isKioskMode ? 'h-12' : 'h-10'}`}>
              <button
                onClick={() => handleQuantityChange('decrease')}
                disabled={!isStoreOpen || !product.is_available || isUpdating}
                className={`${isKioskMode ? 'h-12 w-12' : 'h-10 w-10'} bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Minus className="w-4 h-4" />}
              </button>
              
              <div className="flex-1 text-center">
                <span className="text-white font-bold text-lg">{currentQuantity}</span>
                <div className="text-xs text-slate-400">in cart</div>
              </div>
              
              <button
                onClick={() => handleQuantityChange('increase')}
                disabled={!isStoreOpen || !product.is_available || isUpdating}
                className={`${isKioskMode ? 'h-12 w-12' : 'h-10 w-10'} bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!isStoreOpen || !product.is_available || isUpdating}
              className={`w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium ${isKioskMode ? 'py-3 text-sm' : 'py-2 text-xs'} rounded-md transition-all duration-200 flex items-center justify-center ${
                justAdded ? "animate-pulse bg-green-500" : ""
              } ${!isStoreOpen || !product.is_available || isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {!isStoreOpen 
                ? "Closed" 
                : !product.is_available
                  ? "Unavailable"
                  : hasOptions 
                    ? "Options" 
                    : "Add to Order"
              }
            </button>
          )}
        </div>
      </div>
    </>
  )
}