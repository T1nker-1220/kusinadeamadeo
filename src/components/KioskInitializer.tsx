'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCustomerStore } from '@/stores/customerStore';

export default function KioskInitializer() {
  const pathname = usePathname();
  const setIsKioskMode = useCustomerStore((state) => state.setIsKioskMode);

  useEffect(() => {
    // Set the global kiosk state based on the initial URL path.
    const isKioskRoute = pathname.startsWith('/kiosk');
    setIsKioskMode(isKioskRoute);
  }, [pathname, setIsKioskMode]);

  return null; // This component renders nothing.
} 