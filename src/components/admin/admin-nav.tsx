"use client";

import { useSidebar } from "@/components/providers/sidebar-provider";
import { Button } from "@/components/ui/button";
import { Motion } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  ListOrdered,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  {
    group: "Primary",
    items: [
      {
        title: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
        description: "Manage customer orders",
      },
      {
        title: "Products",
        href: "/admin/products",
        icon: Package,
        description: "Manage product catalog",
      },
      {
        title: "Categories",
        href: "/admin/categories",
        icon: ListOrdered,
        description: "Organize product categories",
      },
    ],
  },
  {
    group: "Secondary",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutGrid,
        description: "Overview and analytics",
      },
      {
        title: "Users",
        href: "/admin/users",
        icon: Users,
        description: "Manage user accounts",
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
        description: "Configure store settings",
      },
    ],
  },
];

export function AdminNav() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <Motion
      type="aside"
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-[60px]" : "w-[240px]"
      )}
      initial={false}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link href="/admin" className="flex items-center space-x-2">
          {!isCollapsed && <span className="text-lg font-bold">Admin</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto p-4">
        {adminLinks.map((group) => (
          <div key={group.group} className="space-y-2">
            {!isCollapsed && (
              <h2 className="px-2 text-xs font-semibold uppercase text-muted-foreground">
                {group.group}
              </h2>
            )}
            <div className="space-y-1">
              {group.items.map((link) => {
                const Icon = link.icon;
                return (
                  <Motion
                    key={link.href}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center space-x-2 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        pathname === link.href
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground/60",
                        isCollapsed && "justify-center"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {!isCollapsed && (
                        <>
                          <span>{link.title}</span>
                          {pathname === link.href && (
                            <Motion
                              className="ml-auto text-xs text-muted-foreground"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              {link.description}
                            </Motion>
                          )}
                        </>
                      )}
                    </Link>
                  </Motion>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </Motion>
  );
}
