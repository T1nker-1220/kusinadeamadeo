"use client"

import React from 'react'
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { Package, ShoppingBag, Users } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Loading } from "@/components/ui/Loading"
import { motion } from "framer-motion"

interface Stats {
  pendingOrders: number
  totalProducts: number
  totalCustomers: number
}

interface StatCard {
  title: string
  value: number
  icon: React.ElementType
  href: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    pendingOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const supabase = createClientComponentClient()

  const fetchStats = async () => {
    try {
      // Fetch pending orders
      const { count: pendingOrders } = await supabase
        .from("orders")
        .select("*", { count: "exact" })
        .eq("status", "pending")

      // Fetch total products
      const { count: totalProducts } = await supabase
        .from("products")
        .select("*", { count: "exact" })

      // Fetch total customers
      const { count: totalCustomers } = await supabase
        .from("customers")
        .select("*", { count: "exact" })

      setStats({
        pendingOrders: pendingOrders || 0,
        totalProducts: totalProducts || 0,
        totalCustomers: totalCustomers || 0,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchStats()
  }

  if (loading) {
    return <Loading />
  }

  const statCards: StatCard[] = [
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: ShoppingBag,
      href: "/admin/orders",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      href: "/admin/products",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      href: "/admin/customers",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="heading-display text-3xl">Dashboard</h1>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={handleRefresh}
        >
          <motion.div
            animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 1, ease: "linear", repeat: isRefreshing ? Infinity : 0 }}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </motion.div>
        </Button>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-3">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.href}>
                <div className="mobile-card mobile-card--interactive">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="mobile-text--subtitle">{stat.title}</p>
                      <p className="heading-display text-2xl">{stat.value}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-brand-orange" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button 
          asChild 
          size="lg"
          className="bg-brand-orange hover:bg-brand-orange-light transition-colors"
        >
          <Link href="/admin/orders">View Orders</Link>
        </Button>
        <Button 
          asChild 
          size="lg"
          className="bg-brand-orange hover:bg-brand-orange-light transition-colors"
        >
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
        <Button 
          asChild 
          size="lg"
          className="bg-brand-orange hover:bg-brand-orange-light transition-colors"
        >
          <Link href="/admin/categories">Manage Categories</Link>
        </Button>
        <Button 
          asChild 
          size="lg"
          className="bg-brand-orange hover:bg-brand-orange-light transition-colors"
        >
          <Link href="/admin/settings">Settings</Link>
        </Button>
      </div>
    </div>
  )
} 