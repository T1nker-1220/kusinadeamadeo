"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const inputVariants = cva(
  [
    "flex h-[var(--touch-target-min)] w-full rounded-lg border bg-transparent px-4 py-2",
    "text-sm text-text-primary placeholder:text-text-tertiary",
    "focus-visible:outline-none focus-visible:ring-1",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "transition-colors duration-200",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-white/10",
          "focus-visible:border-brand-orange focus-visible:ring-brand-orange/20",
        ].join(" "),
        error: [
          "border-red-500/50",
          "focus-visible:border-red-500 focus-visible:ring-red-500/20",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, error, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({
            variant: error ? "error" : variant,
            className,
          })
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input } 