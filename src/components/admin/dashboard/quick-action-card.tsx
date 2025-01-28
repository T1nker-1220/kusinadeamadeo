"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Motion } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  className?: string;
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  className,
}: QuickActionCardProps) {
  return (
    <Motion
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Icon className="mr-4 h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">{description}</p>
          <Button asChild className="w-full">
            <Link href={href}>Get Started</Link>
          </Button>
        </CardContent>
      </Card>
    </Motion>
  );
}
