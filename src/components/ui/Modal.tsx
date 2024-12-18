"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "./Button"
import { cn } from "@/lib/utils/cn"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
}

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
}: ModalProps) {
  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "relative w-full max-w-lg rounded-lg bg-surface-elevated p-6 shadow-xl",
                className
              )}
            >
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              )}
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

interface ModalHeaderProps {
  children: React.ReactNode
  className?: string
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
  return (
    <div className={cn("mb-4", className)}>
      <h2 className="heading-accent text-lg">{children}</h2>
    </div>
  )
}

interface ModalContentProps {
  children: React.ReactNode
  className?: string
}

export function ModalContent({ children, className }: ModalContentProps) {
  return <div className={cn("space-y-4", className)}>{children}</div>
}

interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn("mt-6 flex justify-end gap-4", className)}>
      {children}
    </div>
  )
} 