'use client';

import Button from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function MenuOrderSuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-4 text-center">
      <CheckCircle className="text-green-500 w-24 h-24 mb-6" />
      <h1 className="text-4xl font-extrabold text-white mb-4">Order Placed Successfully!</h1>
      <p className="text-xl text-slate-300 mb-8">Thank you for your order. You will receive updates on your order status.</p>
      
      <div className="space-y-4">
        <Link href="/normal-menu">
          <Button variant="primary" className="text-lg py-3 px-8">
            Back to Menu
          </Button>
        </Link>
        <Link href="/normal-menu/order-history">
          <Button variant="secondary" className="text-lg py-3 px-8">
            View Order History
          </Button>
        </Link>
      </div>
    </main>
  );
} 