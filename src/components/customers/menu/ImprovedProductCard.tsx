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
};

type Product = {
  id: number;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
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

  const handleAddToCart = () => {
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
      
      <div className="bg-slate-800 border border-slate-600 hover:border-orange-500 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 group overflow-hidden rounded-xl">
        <div className="relative overflow-hidden">
          <Image
            src={product.image_url || "/images/products/logo.png"}
            alt={product.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-xl text-white mb-2 group-hover:text-orange-400 transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-slate-400 text-sm mb-3 leading-relaxed">{product.description}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-400">₱{product.base_price}</span>
          </div>
        </div>

        <div className="p-4 pt-0">
          <button
            onClick={handleAddToCart}
            disabled={!isStoreOpen}
            className={`w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center ${
              justAdded ? "animate-pulse bg-green-500" : ""
            } ${!isStoreOpen ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Plus className="w-4 h-4 mr-2" />
            {!isStoreOpen 
              ? "Store Closed" 
              : product.options.length > 0 
                ? "Select Options" 
                : "Add to Order"
            }
          </button>
        </div>
      </div>
    </>
  )
}