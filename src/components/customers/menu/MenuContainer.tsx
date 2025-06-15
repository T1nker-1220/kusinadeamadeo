"use client"

import { useState } from "react"
import ImprovedProductCard from "./ProductCard"
import ImprovedCart from "./Cart"
import { useCustomerStore } from "@/stores/customerStore"
import RecentOrder from './RecentOrder'

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
  const { isKioskMode } = useCustomerStore()
  
  // Group products by category
  const productsByCategory = categories.reduce((acc, category) => {
    acc[category.name] = products.filter(
      product => product.category_id === category.id
    )
    return acc
  }, {} as Record<string, Product[]>)

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full px-1 py-2">
        <div className="w-full">
          {!isKioskMode && <RecentOrder />}
          {/* Category Tabs */}
          <div className="grid w-full grid-cols-3 md:grid-cols-6 bg-slate-800 border border-slate-600 rounded-lg p-1 mb-4 overflow-x-auto mx-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.name)}
                className={`
                  px-2 py-1 rounded-md transition-all duration-200 text-xs font-medium
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
              <div className="mb-3 px-1">
                <h2 className="text-xl font-bold text-white mb-1">{category.name}</h2>
                <div className="h-0.5 w-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 px-1">
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