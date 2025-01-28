"use client";

import { MetricCard } from "@/components/admin/dashboard/metric-card";
import { QuickActionCard } from "@/components/admin/dashboard/quick-action-card";
import { Motion } from "@/components/ui/motion";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { formatCurrency } from "@/lib/utils";
import {
  Clock,
  DollarSign,
  LayoutGrid,
  ListOrdered,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  UserPlus,
  Users
} from "lucide-react";

export default function AdminDashboard() {
  const { stats, loading, error } = useDashboardStats();

  const metrics = [
    {
      title: "Total Orders",
      value: stats?.Orders.monthlyCount.toString() || "0",
      description: "Total orders this month",
      icon: ShoppingCart,
      trend: stats?.Orders.trend,
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(stats?.Orders.monthlyRevenue || 0),
      description: "Total revenue this month",
      icon: DollarSign,
      trend: stats?.Orders.trend,
    },
    {
      title: "Active Products",
      value: stats?.Products.active.toString() || "0",
      description: "Products currently available",
      icon: Package,
      trend: stats?.Products.trend,
    },
    {
      title: "Active Categories",
      value: stats?.Categories.active.toString() || "0",
      description: "Categories currently available",
      icon: LayoutGrid,
    },
    {
      title: "Total Users",
      value: stats?.Users.total.toString() || "0",
      description: "Total registered users",
      icon: Users,
      trend: stats?.Users.trend,
    },
    {
      title: "New Users",
      value: stats?.Users.newThisMonth.toString() || "0",
      description: "New users this month",
      icon: UserPlus,
      trend: stats?.Users.trend,
    },
  ];

  const quickActions = [
    {
      title: "Process Orders",
      description: "View and manage pending orders",
      icon: Clock,
      href: "/admin/orders",
    },
    {
      title: "Add Product",
      description: `${stats?.Products.total || 0} products in catalog`,
      icon: Package,
      href: "/admin/products/new",
    },
    {
      title: "Add Category",
      description: `${stats?.Categories.total || 0} categories available`,
      icon: Tag,
      href: "/admin/categories/new",
    },
    {
      title: "Manage Categories",
      description: `${stats?.Categories.total || 0} total categories`,
      icon: ListOrdered,
      href: "/admin/categories",
    },
    {
      title: "Store Settings",
      description: "Configure store preferences",
      icon: Settings,
      href: "/admin/settings",
    },
  ];

  if (error) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-destructive bg-destructive/5 p-4 text-destructive">
        <p className="text-sm">
          Error loading dashboard data. Please try again later.
          {process.env.NODE_ENV === "development" && (
            <span className="block text-xs">{error.message}</span>
          )}
        </p>
      </div>
    );
  }

  return (
    <Motion
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your store's performance
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.title}
              {...metric}
              isLoading={loading}
            />
          ))}
        </div>

        <div>
          <h3 className="mb-4 text-lg font-medium">Quick Actions</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <QuickActionCard
                key={action.title}
                {...action}
                className={loading ? "opacity-50 pointer-events-none" : ""}
              />
            ))}
          </div>
        </div>
      </div>
    </Motion>
  );
}
