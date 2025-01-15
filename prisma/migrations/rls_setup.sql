-- First, disable RLS on all tables to reset state
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductVariant" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "GlobalAddon" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
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

-- Create helper function for admin check with text casting
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

-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductVariant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GlobalAddon" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;

-- User Policies with text casting
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

-- Public Access Policies
CREATE POLICY "Categories are viewable by all"
    ON "Category"
    FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Products are viewable by all"
    ON "Product"
    FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Product variants are viewable by all"
    ON "ProductVariant"
    FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Global addons are viewable by all"
    ON "GlobalAddon"
    FOR SELECT
    TO PUBLIC
    USING (true);

-- Admin Management Policies
CREATE POLICY "Categories are manageable by admins"
    ON "Category"
    FOR ALL
    TO authenticated
    USING (auth.is_admin());

CREATE POLICY "Products are manageable by admins"
    ON "Product"
    FOR ALL
    TO authenticated
    USING (auth.is_admin());

CREATE POLICY "Product variants are manageable by admins"
    ON "ProductVariant"
    FOR ALL
    TO authenticated
    USING (auth.is_admin());

CREATE POLICY "Global addons are manageable by admins"
    ON "GlobalAddon"
    FOR ALL
    TO authenticated
    USING (auth.is_admin());

-- Order Policies with text casting
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

-- OrderItem Policies with text casting
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

-- Payment Policies with text casting
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
