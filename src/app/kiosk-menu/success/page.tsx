import { Suspense } from 'react';
import KioskSuccessClient from '../../../components/customers/KioskSuccessClient';

function LoadingFallback() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-4 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mb-6"></div>
      <h1 className="text-2xl font-bold text-white mb-4">Loading...</h1>
      <p className="text-slate-300">Please wait a moment</p>
    </main>
  );
}

export default function KioskSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <KioskSuccessClient />
    </Suspense>
  );
} 