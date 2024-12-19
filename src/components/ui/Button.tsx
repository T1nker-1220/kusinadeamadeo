import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg transition-all duration-200 font-medium",
  {
    variants: {
      variant: {
        primary: "bg-brand-orange text-white hover:bg-brand-orange-light active:bg-brand-orange-dark",
        secondary: "bg-surface-secondary text-text-primary hover:bg-surface-elevated",
        outline: "border-2 border-brand-orange text-brand-orange hover:bg-brand-orange/10",
        ghost: "text-text-primary hover:bg-surface-secondary",
      },
      size: {
        sm: "h-8 px-3 py-1 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-6 py-3 text-lg",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 