# Row Level Security (RLS) Setup Guide - January 2024

## Overview
This guide details the complete Row Level Security (RLS) implementation for Kusina de Amadeo, ensuring data protection at the database level.

## Core Security Functions

### 1. Admin Check Function
```sql
-- Function to check if current user is admin
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

## Table-Specific RLS Policies

### 1. User Table Policies
```sql
-- Enable RLS
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- View own data
CREATE POLICY "Users can view own data" ON "User"
    FOR SELECT
    TO authenticated
    USING (
        id::text = auth.uid()::text
        OR
        auth.is_admin() = true
    );

-- Update own data
CREATE POLICY "Users can update own data" ON "User"
    FOR UPDATE
    TO authenticated
    USING (id::text = auth.uid()::text);

-- Admin full access
CREATE POLICY "Admins have full access" ON "User"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);
```

### 2. Order Table Policies
```sql
-- Enable RLS
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;

-- View own orders
CREATE POLICY "Users can view own orders" ON "Order"
    FOR SELECT
    TO authenticated
    USING (
        "userId"::text = auth.uid()::text
        OR
        auth.is_admin() = true
    );

-- Create own orders
CREATE POLICY "Users can create own orders" ON "Order"
    FOR INSERT
    TO authenticated
    WITH CHECK ("userId"::text = auth.uid()::text);

-- Admin order management
CREATE POLICY "Admins can manage all orders" ON "Order"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);
```

### 3. Product Table Policies
```sql
-- Enable RLS
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON "Product"
    FOR SELECT
    TO PUBLIC
    USING (true);

-- Admin management
CREATE POLICY "Admins can manage products" ON "Product"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);
```

### 4. Category Table Policies
```sql
-- Enable RLS
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON "Category"
    FOR SELECT
    TO PUBLIC
    USING (true);

-- Admin management
CREATE POLICY "Admins can manage categories" ON "Category"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);
```

### 5. Payment Table Policies
```sql
-- Enable RLS
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;

-- View own payments
CREATE POLICY "Users can view own payments" ON "Payment"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "Order"
            WHERE "Order"."id" = "Payment"."orderId"
            AND "Order"."userId"::text = auth.uid()::text
        )
        OR
        auth.is_admin() = true
    );

-- Create own payments
CREATE POLICY "Users can create payments" ON "Payment"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "Order"
            WHERE "Order"."id" = "orderId"
            AND "Order"."userId"::text = auth.uid()::text
        )
    );

-- Admin payment management
CREATE POLICY "Admins can manage all payments" ON "Payment"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);
```

## Troubleshooting Guide

### 1. Common Issues & Solutions

#### Issue: Unable to Access Data
```sql
-- Check user authentication
SELECT auth.uid();

-- Verify user role
SELECT role FROM "User" WHERE id::text = auth.uid()::text;

-- Test admin function
SELECT auth.is_admin();
```

#### Issue: Policy Not Working
```sql
-- List all policies for a table
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Check policy definition
SELECT * FROM pg_policies WHERE policyname = 'your_policy';
```

### 2. Debugging Steps

1. **Authentication Check**
```sql
-- Verify session
SELECT auth.jwt();

-- Check user claims
SELECT auth.role();
```

2. **Policy Verification**
```sql
-- Test policy conditions
SELECT EXISTS (
    SELECT 1 FROM "User"
    WHERE id::text = auth.uid()::text
    AND role = 'ADMIN'
);
```

3. **Permission Test**
```sql
-- Test specific operations
BEGIN;
    -- Your test operation here
ROLLBACK;
```

## Security Best Practices

### 1. Policy Design
- Use `SECURITY DEFINER` for critical functions
- Implement least privilege principle
- Validate all user inputs
- Use proper error handling

### 2. Performance Optimization
- Index policy-referenced columns
- Use efficient policy conditions
- Avoid complex policy logic
- Monitor policy performance

### 3. Maintenance Tasks
- Regular policy audits
- Permission reviews
- Security updates
- Performance monitoring

## Implementation Checklist

### 1. Initial Setup
- [ ] Enable RLS on all tables
- [ ] Create admin check function
- [ ] Set up basic policies

### 2. User Management
- [ ] User view policy
- [ ] User update policy
- [ ] Admin access policy

### 3. Data Access
- [ ] Order policies
- [ ] Product policies
- [ ] Payment policies

### 4. Security Verification
- [ ] Test all policies
- [ ] Verify admin access
- [ ] Check user isolation

## Version Information
- Last Updated: January 16, 2024
- Status: Production Ready
- RLS Version: 1.0.0
- Next Review: Pre-Phase 2
