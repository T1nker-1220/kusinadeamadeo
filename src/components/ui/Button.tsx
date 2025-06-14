import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'accent' | 'warning' | 'chip';
  fullWidth?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  active?: boolean;
  [x: string]: any;
};

const variantStyles: Record<string, string> = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]',
  secondary: 'bg-[var(--color-secondary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]',
  danger: 'bg-[var(--color-danger)] text-white hover:bg-red-700',
  success: 'bg-[var(--color-success)] text-white hover:bg-green-700',
  accent: 'bg-[var(--color-accent)] text-white hover:bg-blue-700',
  warning: 'bg-[var(--color-warning)] text-black hover:bg-yellow-400',
  chip: 'rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-colors',
};

const variantClasses: Record<string, string> = {
  chip: 'rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-colors',
};

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  loading = false,
  active = false,
  iconLeft,
  iconRight,
  className = '',
  ...props
}: ButtonProps) {
  let classes = variantStyles[variant] || '';
  if (variant === 'chip') {
    classes += active
      ? ' bg-orange-500 text-white border border-orange-500'
      : ' bg-white text-orange-600 border border-orange-300';
  }
  return (
    <button
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] font-semibold shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 hover:scale-105 ${classes} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin w-5 h-5" /> : iconLeft}
      {children}
      {iconRight}
    </button>
  );
} 