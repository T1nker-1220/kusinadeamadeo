'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';

export default function KioskSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId'); // We'll pass this from checkout

  useEffect(() => {
    // Automatically redirect back to the kiosk menu after 15 seconds.
    const timer = setTimeout(() => {
      router.replace('/kiosk-menu');
    }, 15000); // 15 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-4 text-center">
      <CheckCircle className="text-green-500 w-24 h-24 mb-6" />
      <h1 className="text-4xl font-extrabold text-white mb-4">Thank You!</h1>
      <p className="text-xl text-slate-300 mb-8">Your order has been placed successfully.</p>
      
      {orderId && (
        <div className="mb-10">
          <p className="text-lg text-slate-300">Your Order Number is:</p>
          <div className="mt-2 text-6xl font-bold text-orange-500 bg-slate-800 py-4 px-8 rounded-lg border border-slate-600">
            #{orderId.toString().slice(-4)} {/* Show last 4 digits for simplicity */}
          </div>
          <p className="mt-4 text-slate-300">Please listen for this number to be called.</p>
        </div>
      )}

      <Button variant="primary" onClick={() => router.replace('/kiosk-menu')} className="text-lg py-3">
        Start New Order
      </Button>
    </main>
  );
} 