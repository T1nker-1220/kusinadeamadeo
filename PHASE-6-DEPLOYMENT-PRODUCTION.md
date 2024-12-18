# Phase 6: Deployment & Production

## 1. Vercel Deployment

### 1.1 Project Configuration
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['supabase.co'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['sharp'],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'Kusina De Amadeo',
    NEXT_PUBLIC_APP_URL: 'https://kusinadeamadeo.vercel.app',
    NEXT_PUBLIC_BUSINESS_EMAIL: 'kusinadeamadeo@gmail.com',
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; font-src 'self' data: https:;"
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()'
        }
      ]
    }
  ]
}

module.exports = nextConfig
```

### 1.2 Build Configuration
```typescript
// vercel.json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_role_key",
    "NEXT_PUBLIC_GOOGLE_CLIENT_ID": "@google_client_id",
    "NEXT_PUBLIC_GOOGLE_CLIENT_SECRET": "@google_client_secret",
    "RESEND_API_KEY": "@resend_api_key"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        }
      ]
    }
  ]
}
```

## 2. Supabase Production Setup

### 2.1 Database Configuration
```sql
-- migrations/20240112000000_production_setup.sql

-- Enable connection pooling
ALTER SYSTEM SET max_connections = '100';
ALTER SYSTEM SET superuser_reserved_connections = '3';

-- Optimize shared buffers (25% of RAM)
ALTER SYSTEM SET shared_buffers = '1GB';

-- Optimize work memory
ALTER SYSTEM SET work_mem = '16MB';
ALTER SYSTEM SET maintenance_work_mem = '256MB';

-- Enable parallel query execution
ALTER SYSTEM SET max_parallel_workers_per_gather = '2';
ALTER SYSTEM SET max_parallel_workers = '4';

-- Configure WAL
ALTER SYSTEM SET wal_level = 'replica';
ALTER SYSTEM SET archive_mode = 'on';
ALTER SYSTEM SET archive_command = 'test ! -f /archive/%f && cp %p /archive/%f';

-- Configure autovacuum
ALTER SYSTEM SET autovacuum_vacuum_scale_factor = '0.1';
ALTER SYSTEM SET autovacuum_analyze_scale_factor = '0.05';
```

### 2.2 Backup Configuration
```typescript
// src/lib/database/backup.ts
interface BackupConfig {
  frequency: 'daily' | 'weekly'
  retention: number // days
  type: 'full' | 'incremental'
  location: 's3' | 'gcs'
  encryption: boolean
}

export const productionBackupConfig: BackupConfig = {
  frequency: 'daily',
  retention: 30,
  type: 'incremental',
  location: 's3',
  encryption: true
}
```

## 3. Production Monitoring

### 3.1 Performance Monitoring
```typescript
// src/lib/monitoring/performance.ts
interface PerformanceConfig {
  metrics: {
    lcp: number // ms
    fid: number // ms
    cls: number
    ttfb: number // ms
  }
  thresholds: {
    errorRate: number // percentage
    responseTime: number // ms
    uptimeTarget: number // percentage
  }
  alerts: {
    email: string[]
    slack?: string
    severity: 'low' | 'medium' | 'high' | 'critical'
  }
}

export const performanceConfig: PerformanceConfig = {
  metrics: {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    ttfb: 800
  },
  thresholds: {
    errorRate: 1,
    responseTime: 500,
    uptimeTarget: 99.9
  },
  alerts: {
    email: [process.env.NEXT_PUBLIC_ADMIN_EMAIL!],
    slack: process.env.SLACK_WEBHOOK_URL,
    severity: 'high'
  }
}
```

### 3.2 Error Monitoring
```typescript
// src/lib/monitoring/errors.ts
interface ErrorConfig {
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error'
    format: 'json' | 'text'
    destination: 'file' | 'service'
  }
  alerts: {
    minSeverity: 'low' | 'medium' | 'high' | 'critical'
    channels: ('email' | 'slack')[]
    grouping: boolean
  }
  sampling: {
    enabled: boolean
    rate: number // percentage
  }
}

export const errorConfig: ErrorConfig = {
  logging: {
    level: 'error',
    format: 'json',
    destination: 'service'
  },
  alerts: {
    minSeverity: 'high',
    channels: ['email', 'slack'],
    grouping: true
  },
  sampling: {
    enabled: true,
    rate: 10
  }
}
```

## 4. Security Configuration

### 4.1 Authentication
```typescript
// src/lib/auth/config.ts
interface AuthConfig {
  session: {
    duration: string
    refreshThreshold: string
    maxDevices: number
  }
  passwords: {
    minLength: number
    requireSpecialChar: boolean
    requireNumber: boolean
    requireUppercase: boolean
    maxAge: number // days
  }
  mfa: {
    enabled: boolean
    methods: ('email' | 'authenticator')[]
    graceMinutes: number
  }
}

export const authConfig: AuthConfig = {
  session: {
    duration: '24h',
    refreshThreshold: '1h',
    maxDevices: 5
  },
  passwords: {
    minLength: 12,
    requireSpecialChar: true,
    requireNumber: true,
    requireUppercase: true,
    maxAge: 90
  },
  mfa: {
    enabled: true,
    methods: ['email', 'authenticator'],
    graceMinutes: 5
  }
}
```

### 4.2 API Security
```typescript
// src/lib/api/security.ts
interface APISecurityConfig {
  rateLimit: {
    window: string
    max: number
    byIP: boolean
    byUser: boolean
  }
  cors: {
    origins: string[]
    methods: string[]
    credentials: boolean
  }
  encryption: {
    algorithm: string
    keyRotation: number // days
  }
}

export const apiSecurityConfig: APISecurityConfig = {
  rateLimit: {
    window: '1m',
    max: 100,
    byIP: true,
    byUser: true
  },
  cors: {
    origins: [process.env.NEXT_PUBLIC_APP_URL!],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  },
  encryption: {
    algorithm: 'AES-256-GCM',
    keyRotation: 30
  }
}
```

## 5. Deployment Pipeline

### 5.1 CI/CD Configuration
```yaml
# .github/workflows/deployment.yml
name: Deployment Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run lint
      - run: npm run type-check

  security:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  deploy:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 5.2 Database Migrations
```typescript
// src/lib/database/migrations.ts
interface MigrationConfig {
  directory: string
  tableName: string
  schemaName: string
  transactions: boolean
  logger: boolean
}

export const migrationConfig: MigrationConfig = {
  directory: './migrations',
  tableName: 'migrations',
  schemaName: 'public',
  transactions: true,
  logger: true
}

// Migration runner
export async function runMigrations() {
  const supabase = createClientComponentClient()
  
  try {
    // Lock migrations
    await acquireMigrationLock()
    
    // Get pending migrations
    const pending = await getPendingMigrations()
    
    // Run migrations in transaction
    await supabase.rpc('begin_transaction')
    for (const migration of pending) {
      await runMigration(migration)
    }
    await supabase.rpc('commit_transaction')
    
    // Release lock
    await releaseMigrationLock()
  } catch (error) {
    await supabase.rpc('rollback_transaction')
    throw error
  }
}
```

## 6. Production Checklist

### 6.1 Pre-deployment
```typescript
// scripts/pre-deployment.ts
interface DeploymentCheck {
  name: string
  description: string
  check: () => Promise<boolean>
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export const preDeploymentChecks: DeploymentCheck[] = [
  {
    name: 'Database Migrations',
    description: 'Check pending migrations',
    check: checkMigrations,
    severity: 'critical'
  },
  {
    name: 'Environment Variables',
    description: 'Verify all required env vars',
    check: checkEnvVars,
    severity: 'critical'
  },
  {
    name: 'Security Scan',
    description: 'Run security vulnerability scan',
    check: runSecurityScan,
    severity: 'high'
  },
  {
    name: 'Performance Test',
    description: 'Run performance benchmarks',
    check: runPerformanceTest,
    severity: 'high'
  },
  {
    name: 'API Tests',
    description: 'Run API integration tests',
    check: runAPITests,
    severity: 'high'
  }
]
```

### 6.2 Post-deployment
```typescript
// scripts/post-deployment.ts
interface HealthCheck {
  name: string
  endpoint: string
  method: string
  expectedStatus: number
  timeout: number
}

export const healthChecks: HealthCheck[] = [
  {
    name: 'Frontend',
    endpoint: '/',
    method: 'GET',
    expectedStatus: 200,
    timeout: 5000
  },
  {
    name: 'API',
    endpoint: '/api/health',
    method: 'GET',
    expectedStatus: 200,
    timeout: 5000
  },
  {
    name: 'Database',
    endpoint: '/api/db-health',
    method: 'GET',
    expectedStatus: 200,
    timeout: 5000
  },
  {
    name: 'Authentication',
    endpoint: '/api/auth/session',
    method: 'GET',
    expectedStatus: 200,
    timeout: 5000
  }
]

export async function runHealthChecks() {
  const results = await Promise.all(
    healthChecks.map(async check => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}${check.endpoint}`, {
          method: check.method,
          timeout: check.timeout
        })
        return {
          name: check.name,
          success: response.status === check.expectedStatus,
          status: response.status
        }
      } catch (error) {
        return {
          name: check.name,
          success: false,
          error: error.message
        }
      }
    })
  )
  
  // Notify results
  await notifyDeploymentStatus(results)
}
