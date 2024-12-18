"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, Settings, ShoppingBag, Home } from "lucide-react"
import { cn } from "@/lib/utils/cn"

const items = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
            "min-h-[var(--touch-target-min)] active:translate-y-px",
            pathname === item.href
              ? "bg-brand-orange/10 text-brand-orange"
              : "text-text-secondary hover:bg-brand-orange/10 hover:text-brand-orange"
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
} 