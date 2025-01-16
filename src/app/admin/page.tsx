import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  ListOrdered,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { cookies } from "next/headers";

export default async function AdminDashboard() {
  const supabase = createServerComponentClient({ cookies });

  // Fetch counts
  const [
    categoriesCount,
    productsCount,
    ordersCount,
    usersCount,
  ] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
  ]);

  const stats = [
    {
      title: "Total Categories",
      value: categoriesCount,
      icon: ListOrdered,
      color: "text-blue-600",
    },
    {
      title: "Total Products",
      value: productsCount,
      icon: Package,
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: ordersCount,
      icon: ShoppingCart,
      color: "text-orange-600",
    },
    {
      title: "Total Users",
      value: usersCount,
      icon: Users,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={cn("h-4 w-4", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
