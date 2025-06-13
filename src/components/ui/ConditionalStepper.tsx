'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Stepper from './Stepper';

export default function ConditionalStepper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showStepper = ['/cart', '/checkout', '/order-success'].includes(pathname);
  return (
    <>
      {showStepper && (
        <div className="z-50 w-full fixed top-0 left-0">
          <Stepper />
        </div>
      )}
      {children}
    </>
  );
} 