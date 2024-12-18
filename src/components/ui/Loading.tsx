export function Loading() {
  return (
    <div className="flex min-h-[200px] w-full items-center justify-center">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-white/10" />
        <div className="absolute inset-0 rounded-full border-4 border-brand-orange border-r-transparent animate-spin" />
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="mobile-card animate-pulse">
      <div className="space-y-4">
        <div className="aspect-[4/3] w-full rounded-lg bg-surface-secondary" />
        <div className="space-y-2">
          <div className="h-6 w-2/3 rounded-lg bg-surface-secondary" />
          <div className="h-4 w-1/3 rounded-lg bg-surface-secondary" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonButton() {
  return (
    <div className="h-[var(--touch-target-min)] w-[120px] rounded-lg bg-surface-secondary animate-pulse" />
  )
}

export function SkeletonText() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-full rounded bg-surface-secondary animate-pulse" />
      <div className="h-4 w-5/6 rounded bg-surface-secondary animate-pulse" />
      <div className="h-4 w-4/6 rounded bg-surface-secondary animate-pulse" />
    </div>
  )
}

export function SkeletonAvatar() {
  return (
    <div className="h-[var(--touch-target-min)] w-[var(--touch-target-min)] rounded-full bg-surface-secondary animate-pulse" />
  )
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-primary/80 backdrop-blur-sm">
      <div className="rounded-xl bg-surface-elevated p-6 shadow-lg">
        <Loading />
        <p className="mt-4 text-center text-sm text-text-secondary">Loading...</p>
      </div>
    </div>
  )
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-r-brand-orange" />
    </div>
  )
} 