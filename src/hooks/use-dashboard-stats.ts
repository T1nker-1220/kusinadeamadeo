"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

interface DashboardStats {
  orders: {
    total: number;
    monthlyCount: number;
    monthlyRevenue: number;
    trend: {
      value: number;
      isPositive: boolean;
    };
  };
  products: {
    total: number;
    active: number;
    trend: {
      value: number;
      isPositive: boolean;
    };
  };
  users: {
    total: number;
    newThisMonth: number;
    trend: {
      value: number;
      isPositive: boolean;
    };
  };
  categories: {
    total: number;
    active: number;
  };
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClientComponentClient();

  // Calculate trend percentage
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { value: 100, isPositive: true };
    const trend = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(Number(trend.toFixed(1))),
      isPositive: trend >= 0,
    };
  };

  // Fetch initial stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      // Fetch orders with better error handling
      const ordersPromise = supabase
        .from("orders")
        .select("id, total_amount, created_at")
        .order("created_at", { ascending: false });

      const currentMonthOrdersPromise = supabase
        .from("orders")
        .select("id, total_amount")
        .gte("created_at", firstDayOfMonth.toISOString());

      const lastMonthOrdersPromise = supabase
        .from("orders")
        .select("id, total_amount")
        .gte("created_at", firstDayOfLastMonth.toISOString())
        .lt("created_at", firstDayOfMonth.toISOString());

      // Fetch products with status
      const productsPromise = supabase
        .from("products")
        .select("id, active")
        .order("created_at", { ascending: false });

      // Fetch users with role
      const usersPromise = supabase
        .from("users")
        .select("id, created_at, role")
        .order("created_at", { ascending: false });

      const currentMonthUsersPromise = supabase
        .from("users")
        .select("id")
        .gte("created_at", firstDayOfMonth.toISOString());

      const lastMonthUsersPromise = supabase
        .from("users")
        .select("id")
        .gte("created_at", firstDayOfLastMonth.toISOString())
        .lt("created_at", firstDayOfMonth.toISOString());

      // Fetch categories
      const categoriesPromise = supabase
        .from("categories")
        .select("id, active")
        .order("created_at", { ascending: false });

      // Wait for all promises to resolve
      const [
        { data: orders, error: ordersError },
        { data: currentMonthOrders, error: currentMonthOrdersError },
        { data: lastMonthOrders, error: lastMonthOrdersError },
        { data: products, error: productsError },
        { data: users, error: usersError },
        { data: currentMonthUsers, error: currentMonthUsersError },
        { data: lastMonthUsers, error: lastMonthUsersError },
        { data: categories, error: categoriesError },
      ] = await Promise.all([
        ordersPromise,
        currentMonthOrdersPromise,
        lastMonthOrdersPromise,
        productsPromise,
        usersPromise,
        currentMonthUsersPromise,
        lastMonthUsersPromise,
        categoriesPromise,
      ]);

      // Check for any errors
      const errors = [
        ordersError,
        currentMonthOrdersError,
        lastMonthOrdersError,
        productsError,
        usersError,
        currentMonthUsersError,
        lastMonthUsersError,
        categoriesError,
      ].filter(Boolean);

      if (errors.length > 0) {
        console.error("Errors fetching dashboard data:", errors);
        throw new Error("Failed to fetch dashboard data");
      }

      // Calculate metrics
      const currentMonthRevenue =
        currentMonthOrders?.reduce(
          (sum, order) => sum + (order.total_amount || 0),
          0
        ) || 0;

      const lastMonthRevenue =
        lastMonthOrders?.reduce(
          (sum, order) => sum + (order.total_amount || 0),
          0
        ) || 0;

      const activeProducts = products?.filter((p) => p.active).length || 0;
      const totalProducts = products?.length || 0;

      const activeCategories = categories?.filter((c) => c.active).length || 0;
      const totalCategories = categories?.length || 0;

      const totalUsers = users?.length || 0;
      const newUsers = currentMonthUsers?.length || 0;
      const lastMonthNewUsers = lastMonthUsers?.length || 0;

      setStats({
        orders: {
          total: orders?.length || 0,
          monthlyCount: currentMonthOrders?.length || 0,
          monthlyRevenue: currentMonthRevenue,
          trend: calculateTrend(currentMonthOrders?.length || 0, lastMonthOrders?.length || 0),
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          trend: calculateTrend(activeProducts, totalProducts),
        },
        users: {
          total: totalUsers,
          newThisMonth: newUsers,
          trend: calculateTrend(newUsers, lastMonthNewUsers),
        },
        categories: {
          total: totalCategories,
          active: activeCategories,
        },
      });
    } catch (err) {
      console.error("Error in fetchStats:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up real-time subscriptions with error handling
    const subscriptions = [
      {
        channel: "orders-changes",
        table: "orders",
      },
      {
        channel: "products-changes",
        table: "products",
      },
      {
        channel: "users-changes",
        table: "users",
      },
      {
        channel: "categories-changes",
        table: "categories",
      },
    ].map(({ channel, table }) =>
      supabase
        .channel(channel)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          (payload) => {
            console.log(`Change received for ${table}:`, payload);
            fetchStats().catch((err) =>
              console.error(`Error updating ${table} stats:`, err)
            );
          }
        )
        .subscribe()
    );

    // Cleanup subscriptions
    return () => {
      subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
    };
  }, []);

  return { stats, loading, error };
}
