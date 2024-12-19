"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  [
    "flex w-full rounded-lg border border-white/10 bg-surface-secondary px-4",
    "text-text-primary placeholder:text-text-tertiary",
    "focus:outline-none focus:ring-2 focus:ring-brand-orange/50",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "transition-all duration-200",
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
        ghost: "border-0 bg-transparent px-0 focus:ring-0",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: boolean
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, variant, error, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary">
            {icon}
          </div>
        )}
        <input
          className={cn(
            inputVariants({ size, variant, className }),
            error && "border-error focus:ring-error/50",
            icon && "pl-12"
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants } 