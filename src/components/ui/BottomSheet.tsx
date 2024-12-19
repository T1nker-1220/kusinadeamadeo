import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const bottomSheetVariants = cva(
  [
    "fixed inset-x-0 bottom-0 z-50",
    "bg-surface-elevated rounded-t-xl shadow-lg",
    "transform transition-transform duration-300 ease-out",
    "touch-none",
  ].join(" "),
  {
    variants: {
      size: {
        default: "min-h-[200px] max-h-[90vh]",
        sm: "min-h-[150px] max-h-[50vh]",
        lg: "min-h-[300px] max-h-[90vh]",
        full: "min-h-[100vh]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface BottomSheetProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bottomSheetVariants> {
  open?: boolean
  onClose?: () => void
  snapPoints?: number[]
  defaultSnapPoint?: number
}

const BottomSheet = React.forwardRef<HTMLDivElement, BottomSheetProps>(
  ({ 
    className, 
    children, 
    open, 
    onClose, 
    size,
    snapPoints = [0.5, 0.9], // 50% and 90% of viewport height
    defaultSnapPoint = 0,
    ...props 
  }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false)
    const [startY, setStartY] = React.useState(0)
    const [currentY, setCurrentY] = React.useState(0)
    const [currentSnapPoint, setCurrentSnapPoint] = React.useState(defaultSnapPoint)

    const handleTouchStart = (e: React.TouchEvent) => {
      setIsDragging(true)
      setStartY(e.touches[0].clientY)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!isDragging) return
      const deltaY = e.touches[0].clientY - startY
      setCurrentY(deltaY)
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
      if (currentY > 100) {
        // If dragged down more than 100px, close the sheet
        onClose?.()
      } else {
        // Snap to nearest point
        const viewportHeight = window.innerHeight
        const currentPosition = (viewportHeight - currentY) / viewportHeight
        const nearestSnapPoint = snapPoints.reduce((prev, curr) => 
          Math.abs(curr - currentPosition) < Math.abs(prev - currentPosition) ? curr : prev
        )
        setCurrentSnapPoint(snapPoints.indexOf(nearestSnapPoint))
        setCurrentY(0)
      }
    }

    if (!open) return null

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
        />

        {/* Bottom Sheet */}
        <div
          ref={ref}
          className={cn(bottomSheetVariants({ size, className }))}
          style={{
            transform: `translateY(${currentY}px)`,
            height: `${snapPoints[currentSnapPoint] * 100}vh`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          {...props}
        >
          {/* Drag Handle */}
          <div className="flex justify-center p-4">
            <div className="w-8 h-1 rounded-full bg-text-tertiary" />
          </div>

          {/* Content */}
          <div className="px-4 pb-4 overflow-y-auto">
            {children}
          </div>
        </div>
      </>
    )
  }
)
BottomSheet.displayName = "BottomSheet"

export { BottomSheet, bottomSheetVariants } 