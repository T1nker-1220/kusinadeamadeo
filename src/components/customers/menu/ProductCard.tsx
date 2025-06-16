"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"
import { useCustomerStore } from "@/stores/customerStore"
import OptionsModal from './OptionsModal'
import toast from "react-hot-toast"

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
  const addToCart = useCustomerStore((state) => state.addToCart)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  // Debug: Log product availability
  console.log(`Product ${product.name} - is_available:`, product.is_available)

  const handleAddToCart = () => {
    // Don't allow adding unavailable products
    if (!product.is_available) {
      toast.error(`${product.name} is currently unavailable`)
      return
    }

    if (product.options.length > 0) {
      setIsModalOpen(true)
    } else {
      addToCart({
        id: product.id,
        name: product.name,
        base_price: product.base_price,
        image_url: product.image_url,
      })
      
      // Show animation feedback
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 600)
      
      toast.success(`${product.name} added to order!`)
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
            {/* Availability badge for testing */}
            <span className={`text-xs px-1 py-0.5 rounded ${product.is_available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {product.is_available ? 'Available' : 'Unavailable'}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!isStoreOpen || !product.is_available}
            className={`w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium py-1.5 rounded-md transition-all duration-200 flex items-center justify-center text-xs ${
              justAdded ? "animate-pulse bg-green-500" : ""
            } ${!isStoreOpen || !product.is_available ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Plus className="w-3 h-3 mr-1" />
            {!isStoreOpen 
              ? "Closed" 
              : !product.is_available
                ? "Unavailable"
                : product.options.length > 0 
                  ? "Options" 
                  : "Add"
            }
          </button>
        </div>
      </div>
    </>
  )
}