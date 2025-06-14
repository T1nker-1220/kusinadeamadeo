'use client';
import { usePathname } from 'next/navigation';

export function useKiosk() {
  const pathname = usePathname();
  const isKiosk = pathname.startsWith('/kiosk');
  return { isKiosk };
} 