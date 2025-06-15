'use client';

import { useEffect } from 'react';
import { useCustomerStore } from '@/stores/customerStore';
import Cart from '@/components/customers/menu/Cart';

export default function KioskCartPage() {
  const setIsKioskMode = useCustomerStore((state) => state.setIsKioskMode);

  useEffect(() => {
    // Ensure we're in kiosk mode
    setIsKioskMode(true);
  }, [setIsKioskMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Your Order</h1>
        <Cart />
      </div>
    </div>
  );
} 