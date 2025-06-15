'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, ShoppingCart, CreditCard, CheckCircle } from 'lucide-react';

const steps = [
  { label: 'Menu', path: '/menu', icon: <ShoppingBag size={20} /> },
  { label: 'Checkout', path: '/checkout', icon: <CreditCard size={20} /> },
  { label: 'Success', path: '/order-success', icon: <CheckCircle size={20} /> },
];

export default function Stepper({ className = '' }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentStep = steps.findIndex(step => pathname === step.path || (step.path !== '/' && pathname.startsWith(step.path)));

  return (
    <nav
      className={`w-full flex flex-col items-center px-2 py-4 bg-[var(--color-surface)]/95 backdrop-blur-lg shadow-md border-t border-[var(--color-border)] fixed bottom-0 left-0 z-40 md:static md:shadow-none md:border-none md:bg-transparent md:py-6 md:px-0 ${className}`}
      aria-label="Order Progress"
    >
      <div className="flex w-full max-w-xl justify-between items-center relative">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = idx < currentStep;
          const isLast = idx === steps.length - 1;
          return (
            <div key={step.label} className="flex-1 flex flex-col items-center relative">
              <button
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200
                  ${isCompleted ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white' :
                    isActive ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg' :
                    'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-muted)]'}
                `}
                onClick={() => router.push(step.path)}
                aria-current={isActive ? 'step' : undefined}
                aria-label={step.label}
              >
                {step.icon}
              </button>
              <span className={`mt-2 text-xs md:text-sm font-medium ${isActive ? 'text-[var(--color-primary)]' : isCompleted ? 'text-[var(--color-success)]' : 'text-[var(--color-muted)]'}`}>{step.label}</span>
              {/* Connector line */}
              {!isLast && (
                <span
                  className={`absolute top-1/2 left-full w-full h-1 -translate-y-1/2 z-[-1] md:w-16 md:left-1/2 md:right-auto md:translate-x-1/2
                    ${isCompleted ? 'bg-[var(--color-success)]' : 'bg-[var(--color-border)]'}
                  `}
                  style={{ width: 'calc(100% - 40px)', height: 4 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
} 