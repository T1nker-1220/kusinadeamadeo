'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCustomerStore } from '@/stores/customerStore';

export default function KioskGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { isKioskMode } = useCustomerStore();

  useEffect(() => {
    // If user is in kiosk mode but not on a kiosk-allowed path, redirect to kiosk
    if (isKioskMode) {
      const allowedKioskPaths = ['/kiosk', '/kiosk/success', '/checkout'];
      const isOnAllowedPath = allowedKioskPaths.some(path => pathname.startsWith(path));
      
      if (!isOnAllowedPath) {
        router.replace('/kiosk');
      }
    }
  }, [pathname, router, isKioskMode]);

  return null; // This component renders nothing
} 