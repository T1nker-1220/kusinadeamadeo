# Database Initial Setup

## Overview
Documentation of the initial database setup and configuration for Kusina de Amadeo using Supabase.

## Supabase Configuration

### 1. Project Setup
```bash
# Install Supabase CLI
pnpm add -g supabase

# Login to Supabase
supabase login

# Initialize project
supabase init

# Link to existing project
supabase link --project-ref your-project-ref
```

### 2. Environment Variables
```env
# .env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Initialization

### 1. Schema Setup
```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enums
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CUSTOMER');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE "PaymentMethod" AS ENUM ('GCASH', 'CASH');
CREATE TYPE "VariantType" AS ENUM ('SIZE', 'FLAVOR');
```

### 2. Initial Data

```sql
-- Insert admin user
INSERT INTO "User" (
    "id",
    "email",
    "fullName",
    "phoneNumber",
    "address",
    "role",
    "createdAt",
    "updatedAt"
) VALUES (
    'admin-id',
    'kusinadeamadeo@gmail.com',
    'Kusina De Amadeo',
    '',
    '',
    'ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert initial categories
INSERT INTO "Category" (
    "id",
    "name",
    "description",
    "imageUrl",
    "sortOrder",
    "createdAt",
    "updatedAt"
) VALUES
    ('budget-meals', 'Budget Meals', 'Affordable meal options for everyone', '/images/categories/budget-meals.png', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('silog-meals', 'Silog Meals', 'Filipino breakfast combinations with rice and egg', '/images/categories/silog-meals.png', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('ala-carte', 'Ala Carte', 'Individual dishes and snacks', '/images/categories/ala-carte.png', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('beverages', 'Beverages', 'Refreshing drinks and beverages', '/images/categories/beverages.png', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
```

## Storage Setup

### 1. Bucket Creation
```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

-- Set bucket policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Auth Insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Owner Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (auth.uid() = owner);

CREATE POLICY "Owner Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (auth.uid() = owner);
```

### 2. Storage Structure
```
images/
├── products/        # Product images
├── categories/      # Category images
├── variants/        # Product variant images
└── payments/        # Payment screenshots
```

## Database Functions

### 1. Utility Functions
```sql
-- Get database state
CREATE OR REPLACE FUNCTION get_database_state()
RETURNS jsonb AS $$
DECLARE
    result jsonb;
BEGIN
    -- Implementation details
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute SQL
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void AS $$
BEGIN
    EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Trigger Functions
```sql
-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_timestamp
    BEFORE UPDATE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Repeat for other tables...
```

## Backup Configuration

### 1. Automated Backups
```sql
-- Enable point-in-time recovery
ALTER SYSTEM SET wal_level = logical;
ALTER SYSTEM SET archive_mode = on;
ALTER SYSTEM SET archive_command = 'test ! -f /mnt/archive/%f && cp %p /mnt/archive/%f';

-- Configure retention
ALTER SYSTEM SET archive_timeout = '1h';
```

### 2. Manual Backup
```bash
# Full database backup
pg_dump "postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" > backup.sql

# Restore from backup
psql "postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" < backup.sql
```

## Monitoring Setup

### 1. Performance Monitoring
```sql
-- Create monitoring schema
CREATE SCHEMA IF NOT EXISTS monitoring;

-- Create monitoring tables
CREATE TABLE monitoring.query_stats (
    id SERIAL PRIMARY KEY,
    query TEXT,
    execution_time INTERVAL,
    rows_affected INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Health Checks
```sql
-- Database health check function
CREATE OR REPLACE FUNCTION check_database_health()
RETURNS jsonb AS $$
DECLARE
    result jsonb;
BEGIN
    -- Implementation details
    RETURN result;
END;
$$ LANGUAGE plpgsql;
```

## Security Configuration

### 1. Connection Security
```sql
-- Configure connection settings
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET ssl_cert_file = 'server.crt';
ALTER SYSTEM SET ssl_key_file = 'server.key';
```

### 2. Access Control
```sql
-- Revoke public access
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;

-- Grant specific access
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
```

## Version Information
- Last Updated: January 2024
- Setup Version: 1.0.0
- Status: Production Ready
- Next Review: Pre-Phase 2
