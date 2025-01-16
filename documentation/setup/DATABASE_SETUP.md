# Database Setup Guide - January 2024

## Overview
This guide details the complete database setup process for Kusina de Amadeo using Supabase and Prisma.

## Prerequisites

### 1. Environment Setup
```bash
# Required environment variables
DATABASE_URL="postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
```

### 2. Dependencies
```json
{
  "dependencies": {
    "@prisma/client": "^5.7.1",
    "@supabase/auth-helpers-nextjs": "^0.8.7",
    "@supabase/ssr": "^0.0.10",
    "@supabase/supabase-js": "^2.39.1"
  },
  "devDependencies": {
    "prisma": "^5.7.1"
  }
}
```

## Database Setup Steps

### 1. Initialize Prisma
```bash
# Initialize Prisma
pnpm add -D prisma
pnpm prisma init

# After schema creation
pnpm prisma generate
pnpm prisma db push
```

### 2. Schema Implementation
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// Core models implementation...
```

### 3. Database Seeding
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create admin user
  await prisma.user.upsert({
    where: { email: 'kusinadeamadeo@gmail.com' },
    update: { role: 'ADMIN' },
    create: {
      email: 'kusinadeamadeo@gmail.com',
      fullName: 'Kusina De Amadeo',
      role: 'ADMIN',
      // ... other fields
    }
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## Security Implementation

### 1. RLS Setup
```sql
-- Enable RLS
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;

-- Admin function
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "User"
    WHERE "id"::text = auth.uid()::text
    AND "role" = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Core Policies
```sql
-- User policies
CREATE POLICY "Users can view own data" ON "User"
    FOR SELECT
    TO authenticated
    USING (
        id::text = auth.uid()::text
        OR
        auth.is_admin() = true
    );

-- Product policies
CREATE POLICY "Public read access" ON "Product"
    FOR SELECT
    TO PUBLIC
    USING (true);

-- Order policies
CREATE POLICY "Users can view own orders" ON "Order"
    FOR SELECT
    TO authenticated
    USING (
        "userId"::text = auth.uid()::text
        OR
        auth.is_admin() = true
    );
```

## Performance Optimization

### 1. Index Setup
```sql
-- User indexes
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_user_role ON "User"(role);

-- Order indexes
CREATE INDEX idx_order_user ON "Order"("userId");
CREATE INDEX idx_order_status ON "Order"(status);
CREATE INDEX idx_order_payment ON "Order"("paymentStatus");

-- Product indexes
CREATE INDEX idx_product_category ON "Product"("categoryId");
CREATE INDEX idx_product_availability ON "Product"("isAvailable");
```

### 2. Query Optimization
```typescript
// Example of optimized queries
const getOrderWithItems = async (orderId: string) => {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
          ProductVariant: true,
          OrderItemAddon: {
            include: { addon: true }
          }
        }
      }
    }
  });
};
```

## Maintenance Procedures

### 1. Database Migrations
```bash
# Create migration
pnpm prisma migrate dev --name migration_name

# Apply migration
pnpm prisma migrate deploy

# Reset database (development only)
pnpm prisma migrate reset
```

### 2. Data Backup
```bash
# Backup database
pg_dump -h db.[PROJECT-REF].supabase.co -U postgres -d postgres > backup.sql

# Restore database
psql -h db.[PROJECT-REF].supabase.co -U postgres -d postgres < backup.sql
```

## Monitoring & Maintenance

### 1. Performance Monitoring
```sql
-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Check table statistics
SELECT relname, n_live_tup, n_dead_tup
FROM pg_stat_user_tables;
```

### 2. Regular Maintenance
```sql
-- Analyze tables
ANALYZE "User", "Order", "Product";

-- Vacuum tables
VACUUM ANALYZE "User", "Order", "Product";
```

## Troubleshooting

### 1. Common Issues
```sql
-- Check connection
SELECT version();

-- Test RLS policies
SELECT has_table_privilege('authenticated', 'User', 'SELECT');

-- Verify indexes
SELECT * FROM pg_indexes WHERE tablename = 'User';
```

### 2. Error Resolution
```typescript
// Error handling example
try {
  await prisma.$transaction(async (tx) => {
    // Database operations
  });
} catch (error) {
  if (error.code === 'P2002') {
    // Handle unique constraint violation
  }
  // Handle other errors
}
```

## Version Information
- Last Updated: January 16, 2024
- Database Version: PostgreSQL 15.1
- Prisma Version: 5.7.1
- Status: Production Ready
