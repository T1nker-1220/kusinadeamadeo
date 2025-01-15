-- Enable Row Level Security for all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductVariant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GlobalAddon" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;

-- User Policies
CREATE POLICY "Users can view their own profile"
    ON "User"
    FOR SELECT
    USING (id = auth.uid()::uuid OR is_admin());

CREATE POLICY "Users can update their own profile"
    ON "User"
    FOR UPDATE
    USING (id = auth.uid()::uuid);

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
    USING (is_admin());

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
    USING (is_admin());

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
    USING (is_admin());

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
    USING (is_admin());

-- Order Policies
CREATE POLICY "Users can view their own orders"
    ON "Order"
    FOR SELECT
    TO authenticated
    USING (userId = auth.uid()::uuid OR is_admin());

CREATE POLICY "Users can create their own orders"
    ON "Order"
    FOR INSERT
    TO authenticated
    WITH CHECK (userId = auth.uid()::uuid);

CREATE POLICY "Only admins can update orders"
    ON "Order"
    FOR UPDATE
    TO authenticated
    USING (is_admin());

-- OrderItem Policies
CREATE POLICY "Users can view their order items"
    ON "OrderItem"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "Order"
            WHERE "Order".id = "OrderItem".orderId
            AND ("Order".userId = auth.uid()::uuid OR is_admin())
        )
    );

CREATE POLICY "Users can create their order items"
    ON "OrderItem"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "Order"
            WHERE "Order".id = orderId
            AND "Order".userId = auth.uid()::uuid
        )
    );

-- Payment Policies
CREATE POLICY "Users can view their own payments"
    ON "Payment"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "Order"
            WHERE "Order".id = "Payment".orderId
            AND ("Order".userId = auth.uid()::uuid OR is_admin())
        )
    );

CREATE POLICY "Users can create their own payments"
    ON "Payment"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "Order"
            WHERE "Order".id = orderId
            AND "Order".userId = auth.uid()::uuid
        )
    );

CREATE POLICY "Only admins can verify payments"
    ON "Payment"
    FOR UPDATE
    TO authenticated
    USING (is_admin());

-- Create helper function for admin check
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "User"
    WHERE id = auth.uid()::uuid
    AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create composite indexes for common query patterns
CREATE INDEX "order_user_status_idx" ON "Order"(userId, status);
CREATE INDEX "order_payment_status_idx" ON "Order"(paymentStatus, createdAt);
CREATE INDEX "payment_reference_status_idx" ON "Payment"(referenceNumber, status);
CREATE INDEX "product_category_available_idx" ON "Product"(categoryId, isAvailable);
