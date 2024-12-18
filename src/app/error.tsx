'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to your preferred error monitoring service
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h2 className="mb-4 font-display text-2xl font-bold">Something went wrong</h2>
      <p className="mb-6 text-text-secondary">We apologize for the inconvenience.</p>
      <div className="flex gap-4">
        <Button variant="ghost" onClick={() => window.location.reload()}>
          Reload page
        </Button>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
} 