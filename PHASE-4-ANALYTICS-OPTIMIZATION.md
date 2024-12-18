# Phase 4: Analytics & Optimization

## 1. Analytics Implementation

### 1.1 Business Analytics
```typescript
// src/lib/analytics/business.ts
interface BusinessMetrics {
  revenue: {
    daily: number
    weekly: number
    monthly: number
    byCategory: Record<string, number>
  }
  orders: {
    total: number
    completed: number
    cancelled: number
    averageValue: number
    byHour: Record<number, number>
    byCategory: Record<string, number>
  }
  products: {
    topSellers: Array<{
      id: string
      name: string
      quantity: number
      revenue: number
    }>
    byCategory: Record<string, {
      total: number
      revenue: number
    }>
  }
  customers: {
    total: number
    returning: number
    averageOrderValue: number
  }
}

export async function getBusinessMetrics(
  startDate: Date,
  endDate: Date
): Promise<BusinessMetrics> {
  const supabase = createClientComponentClient()
  
  // Get orders within date range
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
  
  // Calculate metrics
  return {
    revenue: calculateRevenue(orders),
    orders: analyzeOrders(orders),
    products: analyzeProducts(orders),
    customers: analyzeCustomers(orders)
  }
}
```

### 1.2 Performance Monitoring
```typescript
// src/lib/analytics/performance.ts
interface PerformanceMetrics {
  core: {
    lcp: number // Largest Contentful Paint
    fid: number // First Input Delay
    cls: number // Cumulative Layout Shift
    ttfb: number // Time to First Byte
  }
  api: {
    responseTime: number
    errorRate: number
    requestsPerMinute: number
  }
  database: {
    queryTime: number
    connectionPool: {
      active: number
      idle: number
      waiting: number
    }
  }
}

export function initializePerformanceMonitoring() {
  // Web Vitals
  webVitals.onLCP(metric => sendToAnalytics('LCP', metric))
  webVitals.onFID(metric => sendToAnalytics('FID', metric))
  webVitals.onCLS(metric => sendToAnalytics('CLS', metric))
  
  // API Monitoring
  setupAPIMonitoring()
  
  // Database Monitoring
  setupDatabaseMonitoring()
}

const performanceThresholds = {
  lcp: 2500, // 2.5s
  fid: 100,  // 100ms
  cls: 0.1,  // 0.1
  api: {
    responseTime: 500, // 500ms
    errorRate: 0.01,   // 1%
  }
}
```

### 1.3 Error Tracking
```typescript
// src/lib/analytics/errors.ts
interface ErrorEvent {
  id: string
  timestamp: string
  type: 'client' | 'server' | 'api'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  stack?: string
  context: {
    url?: string
    userId?: string
    userAgent?: string
    route?: string
    apiEndpoint?: string
  }
}

export async function logError(error: Error, context: ErrorEvent['context']) {
  const errorEvent: ErrorEvent = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    type: context.apiEndpoint ? 'api' : 'client',
    severity: determineSeverity(error),
    message: error.message,
    stack: error.stack,
    context
  }
  
  // Log to Supabase
  const supabase = createClientComponentClient()
  await supabase.from('error_logs').insert(errorEvent)
  
  // Send critical errors to admin
  if (errorEvent.severity === 'critical') {
    await sendErrorNotification(errorEvent)
  }
}
```

## 2. Performance Optimization

### 2.1 Image Optimization
```typescript
// src/components/common/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      quality={85}
      placeholder="blur"
      blurDataURL={getBlurDataUrl()}
    />
  )
}

// src/lib/images.ts
export async function optimizeProductImage(file: File): Promise<string> {
  if (file.size > 200 * 1024) { // > 200KB
    // Compress image
    const compressedFile = await compressImage(file, {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 1200
    })
    return uploadToStorage(compressedFile)
  }
  return uploadToStorage(file)
}
```

### 2.2 Database Optimization
```sql
-- migrations/20240112000000_optimize_queries.sql

-- Add indexes for common queries
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_available ON products(available);

-- Add materialized view for product analytics
CREATE MATERIALIZED VIEW product_analytics AS
SELECT 
  p.id,
  p.name,
  p.category,
  COUNT(oi.product_id) as order_count,
  SUM(oi.quantity) as total_quantity,
  SUM(oi.unit_price * oi.quantity) as total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, p.category;

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_product_analytics()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY product_analytics;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh view on order changes
CREATE TRIGGER refresh_product_analytics_trigger
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_product_analytics();
```

### 2.3 API Optimization
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimiter } from './lib/rate-limiter'
import { cacheControl } from './lib/cache-control'

export async function middleware(request: NextRequest) {
  // Rate limiting
  const rateLimit = await rateLimiter.check(request)
  if (!rateLimit.success) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }
  
  // Cache control
  const response = await cacheControl(request)
  if (response) return response
  
  // Continue to route handler
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}

// src/lib/cache-control.ts
export const cacheControl = {
  // Static data (products, categories)
  static: 'public, max-age=3600, stale-while-revalidate=86400',
  
  // Dynamic data (orders, cart)
  dynamic: 'private, no-cache, no-store, must-revalidate',
  
  // API responses
  api: {
    products: 'public, max-age=60, stale-while-revalidate=300',
    categories: 'public, max-age=3600, stale-while-revalidate=86400',
    orders: 'private, no-cache, no-store, must-revalidate'
  }
}
```

## 3. Core Web Vitals Optimization

### 3.1 Bundle Optimization
```typescript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizeImages: true,
    optimizeFonts: true,
  },
  
  webpack: (config, { dev, isServer }) => {
    // Enable tree shaking
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: true,
    }
    
    // Analyze bundle in development
    if (dev && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: false,
        })
      )
    }
    
    return config
  },
}
```

### 3.2 Performance Monitoring Dashboard
```typescript
// src/app/admin/performance/page.tsx
export default function PerformanceDashboard() {
  const { data: metrics } = useSWR<PerformanceMetrics>(
    '/api/analytics/performance',
    fetcher,
    { refreshInterval: 60000 } // Refresh every minute
  )
  
  if (!metrics) return <Loading />
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Core Web Vitals */}
      <MetricCard
        title="Largest Contentful Paint"
        value={metrics.core.lcp}
        threshold={2500}
        unit="ms"
      />
      <MetricCard
        title="First Input Delay"
        value={metrics.core.fid}
        threshold={100}
        unit="ms"
      />
      <MetricCard
        title="Cumulative Layout Shift"
        value={metrics.core.cls}
        threshold={0.1}
        unit=""
      />
      
      {/* API Performance */}
      <MetricCard
        title="API Response Time"
        value={metrics.api.responseTime}
        threshold={500}
        unit="ms"
      />
      <MetricCard
        title="Error Rate"
        value={metrics.api.errorRate * 100}
        threshold={1}
        unit="%"
      />
      
      {/* Database Performance */}
      <MetricCard
        title="Query Time"
        value={metrics.database.queryTime}
        threshold={100}
        unit="ms"
      />
    </div>
  )
}
```

## 4. Testing & Monitoring

### 4.1 Performance Testing
```typescript
// tests/performance/load.test.ts
import { check } from 'k6'
import http from 'k6/http'

export const options = {
  vus: 100,
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_reqs: ['rate>100'],
  },
}

export default function () {
  const BASE_URL = __ENV.BASE_URL

  // Test product listing
  const products = http.get(`${BASE_URL}/api/products`)
  check(products, {
    'products status 200': (r) => r.status === 200,
    'products duration < 500ms': (r) => r.timings.duration < 500,
  })

  // Test order creation
  const order = http.post(`${BASE_URL}/api/orders`, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // Test order data
    }),
  })
  check(order, {
    'order status 200': (r) => r.status === 200,
    'order duration < 1000ms': (r) => r.timings.duration < 1000,
  })
}
```

### 4.2 Monitoring Setup
```typescript
// src/lib/monitoring/setup.ts
export function setupMonitoring() {
  // Performance monitoring
  initializePerformanceMonitoring()
  
  // Error tracking
  setupErrorTracking()
  
  // Business metrics
  setupBusinessMetrics()
  
  // Database monitoring
  setupDatabaseMonitoring()
}

async function setupDatabaseMonitoring() {
  const supabase = createClientComponentClient()
  
  // Monitor connection pool
  setInterval(async () => {
    const { data } = await supabase.rpc('get_pool_stats')
    sendToAnalytics('database_pool', data)
  }, 60000)
  
  // Monitor query performance
  const { data: slowQueries } = await supabase
    .from('pg_stat_statements')
    .select('*')
    .order('mean_exec_time', { ascending: false })
    .limit(10)
  
  sendToAnalytics('slow_queries', slowQueries)
}
```

## 5. Deployment Checklist

### 5.1 Pre-deployment Verification
```typescript
// scripts/verify-deployment.ts
async function verifyDeployment() {
  // Check Core Web Vitals
  const vitals = await measureWebVitals()
  assert(vitals.lcp < 2500, 'LCP too high')
  assert(vitals.fid < 100, 'FID too high')
  assert(vitals.cls < 0.1, 'CLS too high')
  
  // Verify database indexes
  const { data: indexes } = await supabase
    .from('pg_indexes')
    .select('*')
  verifyRequiredIndexes(indexes)
  
  // Check API endpoints
  const endpoints = [
    '/api/products',
    '/api/orders',
    '/api/analytics'
  ]
  await Promise.all(endpoints.map(verifyEndpoint))
  
  // Verify monitoring setup
  assert(await isMonitoringActive(), 'Monitoring not active')
  
  console.log('✅ Deployment verification complete')
}
```

### 5.2 Post-deployment Monitoring
```typescript
// src/lib/monitoring/alerts.ts
interface AlertThresholds {
  performance: {
    lcp: number
    fid: number
    cls: number
    apiResponseTime: number
    errorRate: number
  }
  business: {
    orderFailureRate: number
    paymentFailureRate: number
    cartAbandonmentRate: number
  }
}

export const alertThresholds: AlertThresholds = {
  performance: {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    apiResponseTime: 500,
    errorRate: 0.01
  },
  business: {
    orderFailureRate: 0.05,
    paymentFailureRate: 0.05,
    cartAbandonmentRate: 0.7
  }
}

export async function monitorMetrics() {
  // Monitor performance metrics
  const metrics = await getPerformanceMetrics()
  checkThresholds(metrics, alertThresholds.performance)
  
  // Monitor business metrics
  const business = await getBusinessMetrics()
  checkThresholds(business, alertThresholds.business)
}
