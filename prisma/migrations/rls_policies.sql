-- Enable Row Level Security for all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductVariant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GlobalAddon" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;

-- Create helper function for admin check first
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

-- Drop existing indexes to avoid conflicts
DROP INDEX IF EXISTS "order_user_status_idx";
DROP INDEX IF EXISTS "order_payment_status_idx";
DROP INDEX IF EXISTS "payment_reference_status_idx";
DROP INDEX IF EXISTS "product_category_available_idx";

-- Drop all existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON "User";
DROP POLICY IF EXISTS "Users can update their own profile" ON "User";
DROP POLICY IF EXISTS "Categories are viewable by all" ON "Category";
DROP POLICY IF EXISTS "Categories are manageable by admins" ON "Category";
DROP POLICY IF EXISTS "Products are viewable by all" ON "Product";
DROP POLICY IF EXISTS "Products are manageable by admins" ON "Product";
DROP POLICY IF EXISTS "Product variants are viewable by all" ON "ProductVariant";
DROP POLICY IF EXISTS "Product variants are manageable by admins" ON "ProductVariant";
DROP POLICY IF EXISTS "Global addons are viewable by all" ON "GlobalAddon";
DROP POLICY IF EXISTS "Global addons are manageable by admins" ON "GlobalAddon";
DROP POLICY IF EXISTS "Users can view their own orders" ON "Order";
DROP POLICY IF EXISTS "Users can create their own orders" ON "Order";
DROP POLICY IF EXISTS "Only admins can update orders" ON "Order";
DROP POLICY IF EXISTS "Users can view their order items" ON "OrderItem";
DROP POLICY IF EXISTS "Users can create their order items" ON "OrderItem";
DROP POLICY IF EXISTS "Users can view their own payments" ON "Payment";
DROP POLICY IF EXISTS "Users can create their own payments" ON "Payment";
DROP POLICY IF EXISTS "Only admins can verify payments" ON "Payment";

-- User Policies with proper type casting
CREATE POLICY "Users can view their own profile"
    ON "User"
    FOR SELECT
    TO authenticated
    USING ("id"::text = auth.uid()::text OR auth.is_admin());

CREATE POLICY "Users can update their own profile"
    ON "User"
    FOR UPDATE
    TO authenticated
    USING ("id"::text = auth.uid()::text);

-- Category Policies
CREATE POLICY "Categories are viewable by all"
    ON "Category"
    FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Categories are manageable by admins"
    ON "Category"
    FOR ALL
    TO authenticated
    USING (auth.is_admin());

-- Product Policies
CREATE POLICY "Products are viewable by all"
    ON "Product"
    FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Products are manageable by admins"
    ON "Product"
    FOR ALL
    TO authenticated
    USING (auth.is_admin());

-- ProductVariant Policies
CREATE POLICY "Product variants are viewable by all"
    ON "ProductVariant"
    FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Product variants are manageable by admins"
    ON "ProductVariant"
    FOR ALL
    TO authenticated
    USING (auth.is_admin());

-- GlobalAddon Policies
CREATE POLICY "Global addons are viewable by all"
    ON "GlobalAddon"
    FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Global addons are manageable by admins"
    ON "GlobalAddon"
    FOR ALL
    TO authenticated
    USING (auth.is_admin());

-- Order Policies with proper type casting
CREATE POLICY "Users can view their own orders"
    ON "Order"
    FOR SELECT
    TO authenticated
    USING ("userId"::text = auth.uid()::text OR auth.is_admin());

CREATE POLICY "Users can create their own orders"
    ON "Order"
    FOR INSERT
    TO authenticated
    WITH CHECK ("userId"::text = auth.uid()::text);

CREATE POLICY "Only admins can update orders"
    ON "Order"
    FOR UPDATE
    TO authenticated
    USING (auth.is_admin());

-- OrderItem Policies with proper type casting
CREATE POLICY "Users can view their order items"
    ON "OrderItem"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "Order"
            WHERE "Order"."id" = "OrderItem"."orderId"
            AND ("Order"."userId"::text = auth.uid()::text OR auth.is_admin())
        )
    );

CREATE POLICY "Users can create their order items"
    ON "OrderItem"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "Order"
            WHERE "Order"."id" = "orderId"
            AND "Order"."userId"::text = auth.uid()::text
        )
    );

-- Payment Policies with proper type casting
CREATE POLICY "Users can view their own payments"
    ON "Payment"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "Order"
            WHERE "Order"."id" = "Payment"."orderId"
            AND ("Order"."userId"::text = auth.uid()::text OR auth.is_admin())
        )
    );

CREATE POLICY "Users can create their own payments"
    ON "Payment"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "Order"
            WHERE "Order"."id" = "orderId"
            AND "Order"."userId"::text = auth.uid()::text
        )
    );

CREATE POLICY "Only admins can verify payments"
    ON "Payment"
    FOR UPDATE
    TO authenticated
    USING (auth.is_admin());

-- Create composite indexes with proper case sensitivity and quoting
CREATE INDEX IF NOT EXISTS "order_user_status_idx"
    ON "Order"("userId", "status");

CREATE INDEX IF NOT EXISTS "order_payment_status_idx"
    ON "Order"("paymentStatus", "createdAt");

CREATE INDEX IF NOT EXISTS "payment_reference_status_idx"
    ON "Payment"("referenceNumber", "status");

CREATE INDEX IF NOT EXISTS "product_category_available_idx"
    ON "Product"("categoryId", "isAvailable");

-- Begin Transaction
BEGIN;

-- Create authenticated role if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated;
    END IF;
END
$$;

-- Reset permissions first
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM authenticated;
REVOKE ALL ON SCHEMA public FROM authenticated;

-- Grant base permissions
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant table permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Ensure future tables/sequences have correct permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO authenticated;

-- Grant enum type permissions
DO $$
DECLARE
    enum_type text;
BEGIN
    FOR enum_type IN
        SELECT t.typname
        FROM pg_type t
        JOIN pg_namespace n ON t.typnamespace = n.oid
        WHERE n.nspname = 'public'
        AND t.typtype = 'e'
    LOOP
        EXECUTE format('GRANT USAGE ON TYPE %I TO authenticated', enum_type);
    END LOOP;
END
$$;

-- Verify permissions with better error handling
DO $$
DECLARE
    missing_permissions text[];
BEGIN
    -- Initialize array
    missing_permissions := ARRAY[]::text[];

    -- Check schema permission
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.usage_privileges
        WHERE grantee = 'authenticated'
        AND object_schema = 'public'
        AND privilege_type = 'USAGE'
    ) THEN
        missing_permissions := array_append(missing_permissions, 'schema usage');
    END IF;

    -- Check table permissions
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.role_table_grants
        WHERE grantee = 'authenticated'
        AND table_schema = 'public'
        AND privilege_type = 'SELECT'
    ) THEN
        missing_permissions := array_append(missing_permissions, 'table select');
    END IF;

    -- Check sequence permissions
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.usage_privileges
        WHERE grantee = 'authenticated'
        AND object_type = 'SEQUENCE'
        AND privilege_type = 'USAGE'
    ) THEN
        missing_permissions := array_append(missing_permissions, 'sequence usage');
    END IF;

    -- Raise detailed error if any permissions are missing
    IF array_length(missing_permissions, 1) > 0 THEN
        RAISE NOTICE 'Missing permissions for authenticated role: %', array_to_string(missing_permissions, ', ');
    ELSE
        RAISE NOTICE 'All permissions successfully verified for authenticated role';
    END IF;
END
$$;

-- Add documentation
COMMENT ON ROLE authenticated IS 'Role for authenticated users with full table access and RLS restrictions';

-- Commit Transaction
COMMIT;

-- Final verification
SELECT
    r.rolname,
    ARRAY_AGG(DISTINCT p.privilege_type) as privileges
FROM pg_roles r
LEFT JOIN information_schema.role_table_grants p
    ON r.rolname = p.grantee
WHERE r.rolname = 'authenticated'
GROUP BY r.rolname;
