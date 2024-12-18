import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    "touch-none select-none",
    "active:translate-y-px",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-brand-orange text-white",
          "hover:bg-brand-orange-light",
          "active:bg-brand-orange-dark",
        ].join(" "),
        destructive: [
          "bg-destructive text-destructive-foreground",
          "hover:bg-destructive/90",
          "active:bg-destructive/100",
        ].join(" "),
        outline: [
          "border border-white/10 bg-transparent",
          "hover:bg-surface-secondary hover:border-white/20",
          "active:bg-surface-elevated",
        ].join(" "),
        secondary: [
          "bg-surface-secondary text-text-primary",
          "hover:bg-surface-elevated",
          "active:bg-surface-primary",
        ].join(" "),
        ghost: [
          "text-text-primary",
          "hover:bg-surface-secondary",
          "active:bg-surface-elevated",
        ].join(" "),
        link: [
          "text-brand-orange underline-offset-4",
          "hover:underline",
          "active:text-brand-orange-dark",
        ].join(" "),
      },
      size: {
        default: "h-[var(--touch-target-min)] px-4",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-[var(--touch-target-min)] w-[var(--touch-target-min)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 