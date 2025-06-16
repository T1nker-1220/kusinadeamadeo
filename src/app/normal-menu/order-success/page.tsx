'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const paymentMethod = searchParams.get('method') as 'PayAtStore' | 'GCash' | null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-4 text-center">
      <CheckCircle className="text-green-500 w-24 h-24 mb-6" />
      <h1 className="text-4xl font-extrabold text-white mb-4">Order Placed Successfully!</h1>
      
      {orderId && (
        <div className="mb-6">
          <p className="text-lg text-slate-300">Your Order Number is:</p>
          <div className="mt-2 text-4xl font-bold text-orange-500 bg-slate-800 py-3 px-6 rounded-lg border border-slate-600">
            #{orderId.toString().slice(-4)}
          </div>
        </div>
      )}
      
      <p className="text-xl text-slate-300 mb-8">
        {paymentMethod === 'GCash' 
          ? 'Thank you for your payment! We will start preparing your order shortly.'
          : 'Thank you for your order. Please be ready to pay when you arrive.'
        }
      </p>
      
      <div className="space-y-4">
        {paymentMethod === 'PayAtStore' && orderId && (
          <Link href={`/normal-menu/order-status/${orderId}`}>
            <Button variant="success" className="text-lg py-3 px-8">
              Track Order Status
            </Button>
          </Link>
        )}
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

function LoadingFallback() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-4 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mb-6"></div>
      <h1 className="text-2xl font-bold text-white mb-4">Loading...</h1>
      <p className="text-slate-300">Please wait a moment</p>
    </main>
  );
}

export default function MenuOrderSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderSuccessContent />
    </Suspense>
  );
} 