# RLS Quick Reference Guide - January 2024

## 🔒 Core Security Functions

### Admin Check
```sql
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM "User"
    WHERE "id"::text = auth.uid()::text
    AND "role" = 'ADMIN'
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

## 🛡️ Common RLS Patterns

### 1. User Data Access
```sql
-- View own data
USING ("userId"::text = auth.uid()::text)

-- View own + admin access
USING (
    "userId"::text = auth.uid()::text
    OR
    auth.is_admin() = true
)
```

### 2. Public Access
```sql
-- Public read
USING (true)

-- Public read + admin write
CREATE POLICY "public_read" ON "table_name"
    FOR SELECT TO PUBLIC
    USING (true);

CREATE POLICY "admin_write" ON "table_name"
    FOR ALL TO authenticated
    USING (auth.is_admin() = true);
```

### 3. Related Data Access
```sql
-- Through parent table
USING (
    EXISTS (
        SELECT 1 FROM "ParentTable"
        WHERE "ParentTable"."id" = "table_name"."parentId"
        AND "ParentTable"."userId"::text = auth.uid()::text
    )
)
```

## 🔍 Quick Troubleshooting

### 1. Check Authentication
```sql
-- Get current user ID
SELECT auth.uid();

-- Verify admin status
SELECT auth.is_admin();

-- Check user role
SELECT role FROM "User"
WHERE id::text = auth.uid()::text;
```

### 2. Verify Policies
```sql
-- List table policies
SELECT * FROM pg_policies
WHERE tablename = 'your_table';

-- Check specific policy
SELECT * FROM pg_policies
WHERE policyname = 'your_policy';
```

## ⚡ Performance Tips

### 1. Use Proper Indexes
```sql
-- Index user ID columns
CREATE INDEX idx_user_id ON "table_name"("userId");

-- Index for common filters
CREATE INDEX idx_status ON "table_name"("status");
```

### 2. Optimize Conditions
```sql
-- ✅ Good: Simple condition
USING ("userId"::text = auth.uid()::text)

-- ❌ Bad: Complex subquery
USING (userId IN (SELECT id FROM ...))
```

## 🔐 Common Policies

### 1. User Table
```sql
-- View own profile
CREATE POLICY "view_own_profile" ON "User"
    FOR SELECT
    TO authenticated
    USING (id::text = auth.uid()::text);

-- Update own profile
CREATE POLICY "update_own_profile" ON "User"
    FOR UPDATE
    TO authenticated
    USING (id::text = auth.uid()::text);
```

### 2. Order Table
```sql
-- Create own orders
CREATE POLICY "create_own_orders" ON "Order"
    FOR INSERT
    TO authenticated
    WITH CHECK ("userId"::text = auth.uid()::text);

-- View own orders
CREATE POLICY "view_own_orders" ON "Order"
    FOR SELECT
    TO authenticated
    USING ("userId"::text = auth.uid()::text);
```

### 3. Product Table
```sql
-- Public view
CREATE POLICY "public_view" ON "Product"
    FOR SELECT
    TO PUBLIC
    USING (true);

-- Admin manage
CREATE POLICY "admin_manage" ON "Product"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);
```

## 🚀 Quick Setup Steps

1. Enable RLS
```sql
ALTER TABLE "table_name" ENABLE ROW LEVEL SECURITY;
```

2. Create Basic Policies
```sql
-- Read policy
CREATE POLICY "read_policy" ON "table_name"
    FOR SELECT
    TO authenticated
    USING (condition);

-- Write policy
CREATE POLICY "write_policy" ON "table_name"
    FOR INSERT
    TO authenticated
    WITH CHECK (condition);
```

3. Verify Setup
```sql
-- Check RLS status
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Test access
SELECT has_table_privilege(
    'authenticated',
    'table_name',
    'SELECT'
);
```

## ⚠️ Common Gotchas

1. Type Casting
```sql
-- ✅ Correct
"id"::text = auth.uid()::text

-- ❌ Wrong
id = auth.uid()
```

2. Column Names
```sql
-- ✅ Correct
"userId"

-- ❌ Wrong
userid
```

3. Policy Combinations
```sql
-- ✅ Correct: Separate policies
CREATE POLICY "policy1" ... USING (condition1);
CREATE POLICY "policy2" ... USING (condition2);

-- ❌ Wrong: Complex single policy
CREATE POLICY "policy" ... USING (
    complex AND nested AND conditions
);
```

## 📋 Quick Checklist

### Setup
- [ ] Enable RLS on table
- [ ] Create admin function
- [ ] Add basic policies
- [ ] Test access patterns

### Security
- [ ] Verify type casting
- [ ] Check column names
- [ ] Test all operations
- [ ] Validate admin access

### Performance
- [ ] Add required indexes
- [ ] Optimize conditions
- [ ] Monitor query plans
- [ ] Test with real data

## Version Info
- Last Updated: January 16, 2024
- Version: 1.0.0
- Status: Production Ready
```
