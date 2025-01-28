"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestError } from '@supabase/supabase-js';
import { useEffect, useState } from "react";

interface DashboardStats {
  Orders: {
    total: number;
    monthlyCount: number;
    monthlyRevenue: number;
    trend: {
      value: number;
      isPositive: boolean;
    };
  };
  Products: {
    total: number;
    active: number;
    trend: {
      value: number;
      isPositive: boolean;
    };
  };
  Users: {
    total: number;
    newThisMonth: number;
    trend: {
      value: number;
      isPositive: boolean;
    };
  };
  Categories: {
    total: number;
    active: number;
  };
}

interface Order {
  id: string;
  total_amount: number;
  created_at: string;
}

interface Product {
  id: string;
  active: boolean;
}

interface User {
  id: string;
  created_at: string;
  role: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface QueryResult<T> {
  data: T[] | null;
  error: PostgrestError | null;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize Supabase client with error handling
  const supabase = (() => {
    try {
      console.debug('Initializing Supabase client...');
      const client = createClientComponentClient();
      console.debug('Supabase client initialized successfully');
      return client;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      throw new Error('Failed to initialize Supabase client');
    }
  })();

  // Calculate trend percentage
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { value: 100, isPositive: true };
    const trend = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(Number(trend.toFixed(1))),
      isPositive: trend >= 0,
    };
  };

  // Helper to convert Supabase query to Promise
  const executeQuery = async <T>(
    query: any,
    tableName: string
  ): Promise<QueryResult<T>> => {
    try {
      console.debug(`Executing query for ${tableName}...`);
      const { data, error } = await query;
      if (error) {
        console.error(`Error querying ${tableName}:`, error);
      } else {
        console.debug(`Successfully fetched ${data?.length || 0} records from ${tableName}`);
      }
      return { data, error };
    } catch (err) {
      console.error(`Exception querying ${tableName}:`, err);
      return { data: null, error: err as PostgrestError };
    }
  };

  // Retry utility for failed queries
  const retryQuery = async <T>(
    queryFn: () => Promise<QueryResult<T>>,
    retries = 3,
    delay = 1000
  ): Promise<QueryResult<T>> => {
    let lastError: PostgrestError | null = null;
    for (let i = 0; i < retries; i++) {
      try {
        const result = await queryFn();
        if (!result.error) return result;
        lastError = result.error;
        console.debug(`Query attempt ${i + 1} failed:`, result.error);
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      } catch (err) {
        lastError = err as PostgrestError;
        console.debug(`Query attempt ${i + 1} failed with exception:`, err);
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
    return { data: null, error: lastError };
  };

  // Fetch initial stats with retry mechanism
  const fetchStats = async () => {
    try {
      console.debug('Fetching dashboard stats...');
      setLoading(true);
      setError(null);

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      // Fetch data with retries
      const [
        ordersResult,
        currentMonthOrdersResult,
        lastMonthOrdersResult,
        productsResult,
        usersResult,
        currentMonthUsersResult,
        lastMonthUsersResult,
        categoriesResult,
      ] = await Promise.all([
        retryQuery<Order>(() =>
          executeQuery(
            supabase
              .from('Order')
              .select('id, totalAmount, createdAt')
              .order('createdAt', { ascending: false }),
            'Order'
          )
        ),
        retryQuery<Order>(() =>
          executeQuery(
            supabase
              .from('Order')
              .select('id, totalAmount')
              .gte('createdAt', firstDayOfMonth.toISOString()),
            'Order (current month)'
          )
        ),
        retryQuery<Order>(() =>
          executeQuery(
            supabase
              .from('Order')
              .select('id, totalAmount')
              .gte('createdAt', firstDayOfLastMonth.toISOString())
              .lt('createdAt', firstDayOfMonth.toISOString()),
            'Order (last month)'
          )
        ),
        retryQuery<Product>(() =>
          executeQuery(
            supabase
              .from('Product')
              .select('id, isAvailable')
              .order('createdAt', { ascending: false }),
            'Product'
          )
        ),
        retryQuery<User>(() =>
          executeQuery(
            supabase
              .from('User')
              .select('id, createdAt, role')
              .order('createdAt', { ascending: false }),
            'User'
          )
        ),
        retryQuery<User>(() =>
          executeQuery(
            supabase
              .from('User')
              .select('id')
              .gte('createdAt', firstDayOfMonth.toISOString()),
            'User (current month)'
          )
        ),
        retryQuery<User>(() =>
          executeQuery(
            supabase
              .from('User')
              .select('id')
              .gte('createdAt', firstDayOfLastMonth.toISOString())
              .lt('createdAt', firstDayOfMonth.toISOString()),
            'User (last month)'
          )
        ),
        retryQuery<Category>(() =>
          executeQuery(
            supabase
              .from('Category')
              .select('id, name, sortOrder, createdAt')
              .order('createdAt', { ascending: false }),
            'Category'
          )
        ),
      ]);

      // Check for errors and collect error messages
      const errors: { table: string; error: any }[] = [];
      if (ordersResult.error) errors.push({ table: 'Order', error: ordersResult.error });
      if (currentMonthOrdersResult.error) errors.push({ table: 'Order (current month)', error: currentMonthOrdersResult.error });
      if (lastMonthOrdersResult.error) errors.push({ table: 'Order (last month)', error: lastMonthOrdersResult.error });
      if (productsResult.error) errors.push({ table: 'Product', error: productsResult.error });
      if (usersResult.error) errors.push({ table: 'User', error: usersResult.error });
      if (currentMonthUsersResult.error) errors.push({ table: 'User (current month)', error: currentMonthUsersResult.error });
      if (lastMonthUsersResult.error) errors.push({ table: 'User (last month)', error: lastMonthUsersResult.error });
      if (categoriesResult.error) errors.push({ table: 'Category', error: categoriesResult.error });

      if (errors.length > 0) {
        console.error('Errors fetching dashboard data:', errors);
        throw new Error(
          `Failed to fetch dashboard data: ${errors
            .map((e) => `${e.table}: ${e.error.message || 'Unknown error'}`)
            .join(', ')}`
        );
      }

      // Safely extract data with fallbacks
      const orders = ordersResult.data || [];
      const currentMonthOrders = currentMonthOrdersResult.data || [];
      const lastMonthOrders = lastMonthOrdersResult.data || [];
      const products = productsResult.data || [];
      const users = usersResult.data || [];
      const currentMonthUsers = currentMonthUsersResult.data || [];
      const lastMonthUsers = lastMonthUsersResult.data || [];
      const categories = categoriesResult.data || [];

      // Calculate metrics with safe fallbacks
      const currentMonthRevenue = currentMonthOrders.reduce(
        (sum, order) => sum + (order.total_amount || 0),
        0
      );

      const lastMonthRevenue = lastMonthOrders.reduce(
        (sum, order) => sum + (order.total_amount || 0),
        0
      );

      const activeProducts = products.filter((p) => p.active).length;
      const totalProducts = products.length;

      const totalCategories = categories.length;
      const activeCategories = totalCategories;

      const totalUsers = users.length;
      const newUsers = currentMonthUsers.length;
      const lastMonthNewUsers = lastMonthUsers.length;

      console.debug('Dashboard stats calculated successfully');

      setStats({
        Orders: {
          total: orders.length,
          monthlyCount: currentMonthOrders.length,
          monthlyRevenue: currentMonthRevenue,
          trend: calculateTrend(currentMonthOrders.length, lastMonthOrders.length),
        },
        Products: {
          total: totalProducts,
          active: activeProducts,
          trend: calculateTrend(activeProducts, totalProducts),
        },
        Users: {
          total: totalUsers,
          newThisMonth: newUsers,
          trend: calculateTrend(newUsers, lastMonthNewUsers),
        },
        Categories: {
          total: totalCategories,
          active: activeCategories,
        },
      });
    } catch (err) {
      console.error('Error in fetchStats:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
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
        table: "Order",
      },
      {
        channel: "products-changes",
        table: "Product",
      },
      {
        channel: "users-changes",
        table: "User",
      },
      {
        channel: "categories-changes",
        table: "Category",
      },
    ].map(({ channel, table }) =>
      supabase
        .channel(channel)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          (payload) => {
            console.debug(`Change received for ${table}:`, payload);
            fetchStats().catch((err) =>
              console.error(`Error updating ${table} stats:`, err)
            );
          }
        )
        .subscribe((status) => {
          console.debug(`Subscription status for ${table}:`, status);
        })
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
