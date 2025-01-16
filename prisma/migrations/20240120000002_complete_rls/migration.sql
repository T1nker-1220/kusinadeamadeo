-- Drop existing policies
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON "Category";
DROP POLICY IF EXISTS "Admins can manage categories" ON "Category";
DROP POLICY IF EXISTS "Products are viewable by everyone" ON "Product";
DROP POLICY IF EXISTS "Admins can manage products" ON "Product";
DROP POLICY IF EXISTS "Product variants are viewable by everyone" ON "ProductVariant";
DROP POLICY IF EXISTS "Admins can manage product variants" ON "ProductVariant";
DROP POLICY IF EXISTS "Global addons are viewable by everyone" ON "GlobalAddon";
DROP POLICY IF EXISTS "Admins can manage global addons" ON "GlobalAddon";
DROP POLICY IF EXISTS "Users can view own orders" ON "Order";
DROP POLICY IF EXISTS "Users can create orders" ON "Order";
DROP POLICY IF EXISTS "Admins can manage orders" ON "Order";
DROP POLICY IF EXISTS "Users can view own order items" ON "OrderItem";
DROP POLICY IF EXISTS "Users can create order items" ON "OrderItem";
DROP POLICY IF EXISTS "Users can view own order item addons" ON "OrderItemAddon";
DROP POLICY IF EXISTS "Users can create order item addons" ON "OrderItemAddon";
DROP POLICY IF EXISTS "Users can view own payments" ON "Payment";
DROP POLICY IF EXISTS "Users can create payments" ON "Payment";
DROP POLICY IF EXISTS "Admins can manage payments" ON "Payment";
DROP POLICY IF EXISTS "Users can view own data" ON "User";
DROP POLICY IF EXISTS "Users can update own data" ON "User";

-- Enable RLS
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductVariant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GlobalAddon" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItemAddon" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Create admin check function
DROP FUNCTION IF EXISTS auth.is_admin();
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

-- User Policies
CREATE POLICY "Users can view own data" ON "User"
    FOR SELECT
    TO authenticated
    USING (
        "id"::text = auth.uid()::text
        OR
        auth.is_admin() = true
    );

CREATE POLICY "Users can update own data" ON "User"
    FOR UPDATE
    TO authenticated
    USING ("id"::text = auth.uid()::text);

-- Category Policies
CREATE POLICY "Categories are viewable by everyone" ON "Category"
    FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Admins can manage categories" ON "Category"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);

-- Product Policies
CREATE POLICY "Products are viewable by everyone" ON "Product"
    FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Admins can manage products" ON "Product"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);

-- ProductVariant Policies
CREATE POLICY "Product variants are viewable by everyone" ON "ProductVariant"
    FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Admins can manage product variants" ON "ProductVariant"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);

-- GlobalAddon Policies
CREATE POLICY "Global addons are viewable by everyone" ON "GlobalAddon"
    FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Admins can manage global addons" ON "GlobalAddon"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);

-- Order Policies
CREATE POLICY "Users can view own orders" ON "Order"
    FOR SELECT
    TO authenticated
    USING (
        "userId"::text = auth.uid()::text
        OR
        auth.is_admin() = true
    );

CREATE POLICY "Users can create orders" ON "Order"
    FOR INSERT
    TO authenticated
    WITH CHECK ("userId"::text = auth.uid()::text);

CREATE POLICY "Admins can manage orders" ON "Order"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);

-- OrderItem Policies
CREATE POLICY "Users can view own order items" ON "OrderItem"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "Order"
            WHERE "Order"."id" = "OrderItem"."orderId"
            AND "Order"."userId"::text = auth.uid()::text
        )
        OR
        auth.is_admin() = true
    );

CREATE POLICY "Users can create order items" ON "OrderItem"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "Order"
            WHERE "Order"."id" = "OrderItem"."orderId"
            AND "Order"."userId"::text = auth.uid()::text
        )
    );

-- OrderItemAddon Policies
CREATE POLICY "Users can view own order item addons" ON "OrderItemAddon"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "OrderItem"
            JOIN "Order" ON "Order"."id" = "OrderItem"."orderId"
            WHERE "OrderItem"."id" = "OrderItemAddon"."orderItemId"
            AND "Order"."userId"::text = auth.uid()::text
        )
        OR
        auth.is_admin() = true
    );

CREATE POLICY "Users can create order item addons" ON "OrderItemAddon"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "OrderItem"
            JOIN "Order" ON "Order"."id" = "OrderItem"."orderId"
            WHERE "OrderItem"."id" = "OrderItemAddon"."orderItemId"
            AND "Order"."userId"::text = auth.uid()::text
        )
    );

-- Payment Policies
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

CREATE POLICY "Users can create payments" ON "Payment"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "Order"
            WHERE "Order"."id" = "Payment"."orderId"
            AND "Order"."userId"::text = auth.uid()::text
        )
    );

CREATE POLICY "Admins can manage payments" ON "Payment"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
