"use client"

import * as React from "react"
import { Card } from "@/components/ui/Card"
import { MENU_CATEGORIES } from "@/config/menu"

export default function CategoriesPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Categories</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MENU_CATEGORIES.map((category) => (
          <Card key={category.id} className="p-6">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.image}
                alt={category.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-text-primary">
                  {category.name}
                </h3>
                <p className="text-sm text-text-secondary">
                  {category.description}
                </p>
                <p className="text-sm text-brand-orange mt-1">
                  {category.priceRange}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 