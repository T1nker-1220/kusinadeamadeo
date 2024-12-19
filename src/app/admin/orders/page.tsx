"use client"

import * as React from "react"
import { Card } from "@/components/ui/Card"

export default function OrdersPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Orders</h1>

      <Card className="p-6">
        <div className="text-center text-text-secondary">
          <p>No orders yet</p>
        </div>
      </Card>
    </div>
  )
} 