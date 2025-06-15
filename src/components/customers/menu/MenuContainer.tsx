"use client"

import { useState } from "react"
import ImprovedProductCard from "./ProductCard"
import ImprovedCart from "./Cart"
import { useCustomerStore } from "@/stores/customerStore"

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
  category_id: number;
  options: Option[];
};

type Category = { id: number; name: string };

type KusinaDeAmadeoImprovedProps = {
  categories: Category[];
  products: Product[];
  isStoreOpen: boolean;
};

export default function KusinaDeAmadeoImproved({ 
  categories, 
  products, 
  isStoreOpen 
}: KusinaDeAmadeoImprovedProps) {
  const [activeTab, setActiveTab] = useState(categories[0]?.name || "")
  
  // Group products by category
  const productsByCategory = categories.reduce((acc, category) => {
    acc[category.name] = products.filter(
      product => product.category_id === category.id
    )
    return acc
  }, {} as Record<string, Product[]>)

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full">
          {/* Category Tabs */}
          <div className="grid w-full grid-cols-3 md:grid-cols-6 bg-slate-800 border border-slate-600 rounded-xl p-1 mb-8 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.name)}
                className={`
                  px-3 py-2 rounded-lg transition-all duration-200 text-xs md:text-sm font-medium
                  ${activeTab === category.name 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
                    : 'text-slate-300 hover:bg-slate-700'}
                `}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Category Content */}
          {categories.map((category) => (
            <div 
              key={category.id} 
              className={activeTab === category.name ? 'block' : 'hidden'}
            >
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">{category.name}</h2>
                <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsByCategory[category.name]?.map((product) => (
                  <ImprovedProductCard 
                    key={product.id} 
                    product={product} 
                    isStoreOpen={isStoreOpen} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ImprovedCart />
    </div>
  )
}