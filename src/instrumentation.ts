export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize performance monitoring
    const { performance, PerformanceObserver } = await import('perf_hooks')

    // Create a performance observer
    const obs = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        // Log performance metrics (in production this would go to a monitoring service)
        if (process.env.NODE_ENV === 'development') {
          console.log(`${entry.name}: ${entry.duration}ms`)
        }
      })
    })

    // Observe different types of performance metrics
    obs.observe({ entryTypes: ['measure', 'resource'] })

    // Add custom performance markers
    performance.mark('app-init')
  }
} 