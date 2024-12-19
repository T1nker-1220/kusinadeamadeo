import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const selectVariants = cva(
  [
    "flex w-full appearance-none rounded-lg border border-white/10 bg-surface-secondary px-4",
    "text-text-primary placeholder:text-text-tertiary",
    "focus:outline-none focus:ring-2 focus:ring-brand-orange/50",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "transition-all duration-200",
    "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke-width%3D%221.5%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.6)%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19.5%208.25l-7.5%207.5-7.5-7.5%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_16px_center] bg-no-repeat pr-12",
  ].join(" "),
  {
    variants: {
      size: {
        default: "h-12", // Mobile-friendly default size (48px)
        sm: "h-10 text-sm",
        lg: "h-14 text-lg",
      },
      variant: {
        default: "bg-surface-secondary",
        filled: "bg-surface-elevated",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  error?: boolean
  label?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size, variant, error, label, children, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <select
          className={cn(
            selectVariants({ size, variant, className }),
            error && "border-error focus:ring-error/50"
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select, selectVariants } 