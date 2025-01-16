# RLS Implementation Patterns - January 2024

## Core RLS Patterns

### 1. User Data Isolation Pattern
```sql
-- Pattern: Users can only access their own data
CREATE POLICY "user_isolation_policy" ON "table_name"
    FOR operation
    TO authenticated
    USING ("userId"::text = auth.uid()::text);

-- Example Implementation (Orders)
CREATE POLICY "Users can view own orders" ON "Order"
    FOR SELECT
    TO authenticated
    USING ("userId"::text = auth.uid()::text);
```

### 2. Admin Override Pattern
```sql
-- Pattern: Admins can access all data
CREATE POLICY "admin_override_policy" ON "table_name"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);

-- Example Implementation (Users)
CREATE POLICY "Admins have full access" ON "User"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);
```

### 3. Public Read Pattern
```sql
-- Pattern: Public can read specific data
CREATE POLICY "public_read_policy" ON "table_name"
    FOR SELECT
    TO PUBLIC
    USING (true);

-- Example Implementation (Products)
CREATE POLICY "Public read access" ON "Product"
    FOR SELECT
    TO PUBLIC
    USING (true);
```

### 4. Related Data Access Pattern
```sql
-- Pattern: Access through related tables
CREATE POLICY "related_access_policy" ON "table_name"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "related_table"
            WHERE "related_table"."id" = "table_name"."relatedId"
            AND "related_table"."userId"::text = auth.uid()::text
        )
    );

-- Example Implementation (Payments)
CREATE POLICY "Users can view own payments" ON "Payment"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "Order"
            WHERE "Order"."id" = "Payment"."orderId"
            AND "Order"."userId"::text = auth.uid()::text
        )
    );
```

## Implementation Examples

### 1. User Profile Management
```sql
-- View own profile
CREATE POLICY "view_own_profile" ON "User"
    FOR SELECT
    TO authenticated
    USING (
        id::text = auth.uid()::text
        OR
        auth.is_admin() = true
    );

-- Update own profile
CREATE POLICY "update_own_profile" ON "User"
    FOR UPDATE
    TO authenticated
    USING (id::text = auth.uid()::text);
```

### 2. Order Management
```sql
-- Create orders
CREATE POLICY "create_own_orders" ON "Order"
    FOR INSERT
    TO authenticated
    WITH CHECK ("userId"::text = auth.uid()::text);

-- View orders
CREATE POLICY "view_own_orders" ON "Order"
    FOR SELECT
    TO authenticated
    USING (
        "userId"::text = auth.uid()::text
        OR
        auth.is_admin() = true
    );
```

### 3. Product Catalog
```sql
-- Public product viewing
CREATE POLICY "view_products" ON "Product"
    FOR SELECT
    TO PUBLIC
    USING (true);

-- Admin product management
CREATE POLICY "manage_products" ON "Product"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);
```

## Best Practice Patterns

### 1. Type Safety Pattern
```sql
-- Always cast UUIDs to text for comparison
"id"::text = auth.uid()::text

-- Use proper column quoting
"userId" NOT "userid"
```

### 2. Performance Pattern
```sql
-- Use indexed columns in policies
CREATE INDEX idx_user_id ON "table_name"("userId");

-- Simple conditions for better performance
USING ("userId"::text = auth.uid()::text)
```

### 3. Security Pattern
```sql
-- Use SECURITY DEFINER for critical functions
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean
SECURITY DEFINER
AS $$
    -- Function body
$$;
```

## Common Pattern Combinations

### 1. User + Admin Access
```sql
CREATE POLICY "user_and_admin_access" ON "table_name"
    FOR operation
    TO authenticated
    USING (
        "userId"::text = auth.uid()::text
        OR
        auth.is_admin() = true
    );
```

### 2. Public Read + Admin Write
```sql
-- Public read
CREATE POLICY "public_read" ON "table_name"
    FOR SELECT
    TO PUBLIC
    USING (true);

-- Admin write
CREATE POLICY "admin_write" ON "table_name"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);
```

### 3. Related Data + Admin Override
```sql
CREATE POLICY "related_with_admin" ON "table_name"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "related_table"
            WHERE "related_table"."id" = "table_name"."relatedId"
            AND "related_table"."userId"::text = auth.uid()::text
        )
        OR
        auth.is_admin() = true
    );
```

## Pattern Testing

### 1. User Access Test
```sql
-- Test user isolation
SELECT auth.uid() = 'user-id'::uuid;
SELECT EXISTS (
    SELECT 1 FROM "table_name"
    WHERE "userId"::text = auth.uid()::text
);
```

### 2. Admin Access Test
```sql
-- Test admin override
SELECT auth.is_admin();
SELECT EXISTS (
    SELECT 1 FROM "User"
    WHERE "id"::text = auth.uid()::text
    AND "role" = 'ADMIN'
);
```

### 3. Related Data Test
```sql
-- Test related data access
SELECT EXISTS (
    SELECT 1 FROM "Order"
    JOIN "Payment" ON "Order"."id" = "Payment"."orderId"
    WHERE "Order"."userId"::text = auth.uid()::text
);
```

## Pattern Maintenance

### 1. Regular Audits
- Review policy effectiveness
- Check for security gaps
- Monitor performance impact
- Update as needed

### 2. Performance Monitoring
- Check query execution plans
- Monitor policy overhead
- Optimize complex conditions
- Update indexes as needed

### 3. Security Updates
- Regular security reviews
- Policy updates
- Permission audits
- Access pattern analysis

## Version Information
- Last Updated: January 16, 2024
- Pattern Version: 1.0.0
- Status: Production Ready
- Next Review: Pre-Phase 2
