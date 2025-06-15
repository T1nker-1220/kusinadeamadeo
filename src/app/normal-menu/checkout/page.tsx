'use client';

import { useEffect } from 'react';
import { useCustomerStore } from '@/stores/customerStore';
import CheckOut from '@/components/customers/CheckOut';

export default function MenuCheckoutPage() {
  const setIsKioskMode = useCustomerStore((state) => state.setIsKioskMode);

  useEffect(() => {
    // Ensure we're in personal device mode
    setIsKioskMode(false);
  }, [setIsKioskMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <CheckOut />
      </div>
    </div>
  );
} 