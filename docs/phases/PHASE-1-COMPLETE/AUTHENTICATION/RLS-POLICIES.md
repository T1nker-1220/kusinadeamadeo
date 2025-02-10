# Row Level Security (RLS) Policies

## Overview
Comprehensive documentation of Row Level Security (RLS) policies implemented for Kusina de Amadeo's database tables.

## Core Security Functions

### Admin Check Function
```sql
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

## Table Policies

### 1. User Table
```sql
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

### 2. Order Table
```sql
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
CREATE POLICY "Users can create orders" ON "Order"
    FOR INSERT
    TO authenticated
    WITH CHECK ("userId"::text = auth.uid()::text);

-- Admin order management
CREATE POLICY "Admins can manage orders" ON "Order"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);
```

### 3. Product Table
```sql
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Products are viewable by everyone" ON "Product"
    FOR SELECT
    TO PUBLIC
    USING (true);

-- Admin management
CREATE POLICY "Admins can manage products" ON "Product"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);
```

### 4. Category Table
```sql
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Categories are viewable by everyone" ON "Category"
    FOR SELECT
    TO PUBLIC
    USING (true);

-- Admin management
CREATE POLICY "Admins can manage categories" ON "Category"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);
```

### 5. Payment Table
```sql
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

-- Create payments
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
CREATE POLICY "Admins can manage payments" ON "Payment"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);
```

## Policy Patterns

### 1. User Isolation Pattern
```sql
-- Basic pattern
"userId"::text = auth.uid()::text

-- With admin override
"userId"::text = auth.uid()::text OR auth.is_admin() = true
```

### 2. Public Read Pattern
```sql
-- Allow public read
USING (true)

-- Public read with conditions
USING (is_public = true)
```

### 3. Related Data Pattern
```sql
-- Access through parent table
EXISTS (
    SELECT 1 FROM "ParentTable"
    WHERE "ParentTable"."id" = "table_name"."parentId"
    AND "ParentTable"."userId"::text = auth.uid()::text
)
```

## Security Best Practices

### 1. Type Safety
- Always cast UUIDs to text for comparison
- Use proper column quoting
- Validate input types

### 2. Performance
- Create appropriate indexes
- Use simple conditions
- Optimize complex queries

### 3. Maintenance
- Regular policy audits
- Performance monitoring
- Security updates

## Testing Guidelines

### 1. Policy Testing
```sql
-- Test user isolation
SELECT auth.uid() = 'user-id'::uuid;

-- Test admin access
SELECT auth.is_admin();

-- Test related data access
SELECT EXISTS (
    SELECT 1 FROM "Order"
    JOIN "Payment" ON "Order"."id" = "Payment"."orderId"
    WHERE "Order"."userId"::text = auth.uid()::text
);
```

### 2. Common Test Cases
- User data isolation
- Admin access verification
- Public access validation
- Related data access
- Error conditions

## Maintenance Tasks

### Regular Checks
- Monitor policy effectiveness
- Review access patterns
- Check error logs
- Verify role assignments

### Security Updates
- Regular policy audits
- Performance monitoring
- Access pattern analysis
- Security logging

## Version Information
- Last Updated: January 2024
- Status: Production Ready
- Next Review: Pre-Phase 2
