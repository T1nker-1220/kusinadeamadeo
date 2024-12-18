import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  fcp: number | null // First Contentful Paint
  lcp: number | null // Largest Contentful Paint
  fid: number | null // First Input Delay
  cls: number | null // Cumulative Layout Shift
  ttfb: number | null // Time to First Byte
}

export function usePerformance(componentName: string) {
  const metricsRef = useRef<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Mark component mount
    performance.mark(`${componentName}-mount-start`)

    // First Contentful Paint
    const paintObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          metricsRef.current.fcp = entry.startTime
          logMetric('FCP', entry.startTime)
        }
      })
    })
    paintObserver.observe({ entryTypes: ['paint'] })

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        metricsRef.current.lcp = entry.startTime
        logMetric('LCP', entry.startTime)
      })
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        metricsRef.current.fid = entry.processingStart - entry.startTime
        logMetric('FID', entry.processingStart - entry.startTime)
      })
    })
    fidObserver.observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsScore = 0
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsScore += entry.value
        }
      })
      metricsRef.current.cls = clsScore
      logMetric('CLS', clsScore)
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      metricsRef.current.ttfb = navigationEntry.responseStart
      logMetric('TTFB', navigationEntry.responseStart)
    }

    return () => {
      // Mark component unmount
      performance.mark(`${componentName}-unmount`)
      performance.measure(
        `${componentName}-lifecycle`,
        `${componentName}-mount-start`,
        `${componentName}-unmount`
      )

      // Clean up observers
      paintObserver.disconnect()
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
    }
  }, [componentName])

  // Helper function to log metrics
  const logMetric = (name: string, value: number) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${componentName}] ${name}: ${value.toFixed(2)}ms`)
    }
    // In production, this would send to a monitoring service
  }

  return metricsRef.current
} 