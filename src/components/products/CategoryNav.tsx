import * as React from "react"
import { cn } from "@/lib/utils"
import { MENU_CATEGORIES } from "@/config/menu"
import type { ProductCategory } from "@/types/product"

interface CategoryNavProps {
  activeCategory: string
  onSelect: (categoryId: string) => void
  className?: string
}

export function CategoryNav({
  activeCategory,
  onSelect,
  className,
}: CategoryNavProps) {
  return (
    <nav
      className={cn(
        "flex overflow-x-auto py-4 gap-2 no-scrollbar touch-pan-x",
        className
      )}
    >
      {MENU_CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            "flex-none px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap",
            activeCategory === category.id
              ? "bg-brand-orange text-white"
              : "bg-surface-secondary text-text-secondary hover:bg-surface-elevated"
          )}
        >
          {category.name}
        </button>
      ))}
    </nav>
  )
} 