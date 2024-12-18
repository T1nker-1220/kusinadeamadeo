"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils/cn"

export type ToastType = "success" | "error" | "info"

interface ToastProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  type?: ToastType
  duration?: number
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const colors = {
  success: "text-green-500",
  error: "text-red-500",
  info: "text-brand-orange",
}

export function Toast({
  open,
  onClose,
  title,
  description,
  type = "info",
  duration = 5000,
}: ToastProps) {
  React.useEffect(() => {
    if (open && duration) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [open, duration, onClose])

  const Icon = icons[type]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none md:bottom-8"
        >
          <div className="flex justify-center">
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-surface-elevated shadow-lg">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Icon className={cn("h-5 w-5", colors[type])} />
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">{title}</p>
                    {description && (
                      <p className="mt-1 text-sm text-text-secondary">
                        {description}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md text-text-tertiary hover:text-text-primary"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Toast Store
import { create } from "zustand"

interface ToastState {
  open: boolean
  title: string
  description?: string
  type: ToastType
  duration?: number
  showToast: (props: Omit<ToastProps, "open" | "onClose">) => void
  hideToast: () => void
}

export const useToast = create<ToastState>((set) => ({
  open: false,
  title: "",
  description: "",
  type: "info",
  duration: 5000,
  showToast: (props) => set({ open: true, ...props }),
  hideToast: () => set({ open: false }),
}))

// Toast Provider Component
export function ToastProvider() {
  const { open, title, description, type, duration, hideToast } = useToast()

  return (
    <Toast
      open={open}
      onClose={hideToast}
      title={title}
      description={description}
      type={type}
      duration={duration}
    />
  )
} 