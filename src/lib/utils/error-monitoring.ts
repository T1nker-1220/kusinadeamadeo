type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

interface ErrorDetails {
  message: string
  stack?: string
  severity: ErrorSeverity
  context?: Record<string, unknown>
  userId?: string
  url?: string
}

class ErrorMonitor {
  private static instance: ErrorMonitor
  private isInitialized = false

  private constructor() {
    if (typeof window !== 'undefined') {
      // Set up global error handler
      window.onerror = (message, source, lineno, colno, error) => {
        this.captureError({
          message: String(message),
          stack: error?.stack,
          severity: 'high',
          context: {
            source,
            lineno,
            colno,
          },
          url: window.location.href,
        })
      }

      // Set up unhandled promise rejection handler
      window.onunhandledrejection = (event) => {
        this.captureError({
          message: event.reason?.message || 'Unhandled Promise Rejection',
          stack: event.reason?.stack,
          severity: 'critical',
          context: {
            reason: event.reason,
          },
          url: window.location.href,
        })
      }
    }
  }

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor()
    }
    return ErrorMonitor.instance
  }

  init() {
    if (this.isInitialized) return
    this.isInitialized = true
    console.log('Error monitoring initialized')
  }

  captureError(details: ErrorDetails) {
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured:', {
        ...details,
        timestamp: new Date().toISOString(),
      })
      return
    }

    // In production, this would send to an error monitoring service
    // For now, we'll just log to console
    console.error('Production error:', {
      ...details,
      timestamp: new Date().toISOString(),
    })
  }

  setUser(userId: string) {
    // Set user context for error tracking
    console.log('User context set:', userId)
  }

  clearUser() {
    // Clear user context
    console.log('User context cleared')
  }
}

export const errorMonitor = ErrorMonitor.getInstance()

// Helper function to wrap async functions with error monitoring
export function withErrorMonitoring<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: { severity?: ErrorSeverity; context?: Record<string, unknown> } = {}
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      errorMonitor.captureError({
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        severity: options.severity || 'high',
        context: {
          ...options.context,
          args,
        },
      })
      throw error
    }
  }) as T
} 