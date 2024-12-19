"use client"

import * as React from "react"
import { Card } from "@/components/ui/Card"

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Settings</h1>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Business Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-text-secondary">Store Name</label>
                <p className="text-text-primary">Kusina De Amadeo</p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Address</label>
                <p className="text-text-primary">
                  107 i Purok 4 Dagatan, Amadeo, Cavite
                </p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Contact</label>
                <p className="text-text-primary">+63 960 508 8715</p>
                <p className="text-text-primary">(046) 890-9060</p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Email</label>
                <p className="text-text-primary">kusinadeamadeo@gmail.com</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Operating Hours
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary">Store Hours</span>
                <span className="text-text-primary">5:00 AM - 11:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Order Processing</span>
                <span className="text-text-primary">8:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Pickup Hours</span>
                <span className="text-text-primary">5:00 AM - 10:00 PM</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Payment Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-text-secondary">GCash Number</label>
                <p className="text-text-primary">09605088715</p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Account Name</label>
                <p className="text-text-primary">John Nathaniel Marquez</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 