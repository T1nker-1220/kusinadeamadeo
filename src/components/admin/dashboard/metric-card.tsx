"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Motion } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  isLoading?: boolean;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  isLoading = false,
}: MetricCardProps) {
  return (
    <Motion
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={cn("h-4 w-4 text-muted-foreground", isLoading && "animate-pulse")} />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
              {description && (
                <div className="mt-2 h-4 w-32 animate-pulse rounded-md bg-muted" />
              )}
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">{value}</div>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
              {trend && (
                <div
                  className={cn(
                    "mt-2 flex items-center text-xs",
                    trend.isPositive ? "text-green-500" : "text-red-500"
                  )}
                >
                  {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Motion>
  );
}
