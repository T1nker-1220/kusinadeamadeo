"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const modalVariants = cva(
  [
    "fixed inset-0 z-50 flex items-center justify-center p-4",
    "animate-in fade-in duration-200",
  ].join(" "),
  {
    variants: {
      position: {
        center: "",
        bottom: "items-end sm:items-center",
      },
    },
    defaultVariants: {
      position: "center",
    },
  }
)

const modalContentVariants = cva(
  [
    "relative w-full max-h-[90vh] overflow-auto",
    "bg-surface-elevated rounded-xl shadow-lg",
    "animate-in zoom-in-95 duration-200",
  ].join(" "),
  {
    variants: {
      position: {
        center: "sm:max-w-lg mx-auto",
        bottom: [
          "sm:max-w-lg mx-auto",
          "rounded-b-none sm:rounded-xl",
          "slide-in-from-bottom duration-300",
        ].join(" "),
      },
      size: {
        default: "sm:max-w-lg",
        sm: "sm:max-w-md",
        lg: "sm:max-w-xl",
        full: "sm:max-w-none",
      },
    },
    defaultVariants: {
      position: "center",
      size: "default",
    },
  }
)

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof modalVariants> {
  open?: boolean
  onClose?: () => void
  size?: VariantProps<typeof modalContentVariants>["size"]
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ className, children, open, onClose, position, size, ...props }, ref) => {
    // Close on escape key
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose?.()
      }
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }, [onClose])

    if (!open) return null

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
        />

        {/* Modal */}
        <div className={cn(modalVariants({ position, className }))} {...props}>
          <div
            ref={ref}
            className={cn(modalContentVariants({ position, size }))}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </>
    )
  }
)
Modal.displayName = "Modal"

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
ModalHeader.displayName = "ModalHeader"

const ModalTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold text-text-primary", className)}
    {...props}
  />
))
ModalTitle.displayName = "ModalTitle"

const ModalDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-text-secondary", className)}
    {...props}
  />
))
ModalDescription.displayName = "ModalDescription"

const ModalContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
ModalContent.displayName = "ModalContent"

const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      "border-t border-white/10 bg-surface-secondary/50 p-6",
      className
    )}
    {...props}
  />
))
ModalFooter.displayName = "ModalFooter"

export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter,
} 