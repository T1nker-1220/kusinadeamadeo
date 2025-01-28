"use client";

import { MetricCard } from "@/components/admin/dashboard/metric-card";
import { QuickActionCard } from "@/components/admin/dashboard/quick-action-card";
import { Motion } from "@/components/ui/motion";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { formatCurrency } from "@/lib/utils";
import {
  Clock,
  ListOrdered,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";

export default function AdminDashboard() {
  const { stats, loading, error } = useDashboardStats();

  const metrics = [
    {
      title: "Total Orders",
      value: stats?.orders.monthlyCount.toString() || "0",
      description: "Total orders this month",
      icon: ShoppingCart,
      trend: stats?.orders.trend,
    },
    {
      title: "Active Products",
      value: stats?.products.active.toString() || "0",
      description: "Products in catalog",
      icon: Package,
      trend: stats?.products.trend,
    },
    {
      title: "Total Users",
      value: stats?.users.total.toString() || "0",
      description: `${stats?.users.newThisMonth || 0} new this month`,
      icon: Users,
      trend: stats?.users.trend,
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(stats?.orders.monthlyRevenue || 0),
      description: "Revenue this month",
      icon: TrendingUp,
      trend: stats?.orders.trend,
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
      description: "Create a new product listing",
      icon: Tag,
      href: "/admin/products/new",
    },
    {
      title: "Manage Categories",
      description: `${stats?.categories.active || 0} active categories`,
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
