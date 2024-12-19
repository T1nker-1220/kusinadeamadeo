-- Add missing columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS default_delivery_address TEXT;

-- RLS policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Admin can view all profiles
CREATE POLICY "Admin can view all profiles"
  ON users FOR SELECT
  USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

-- Admin can update all profiles
CREATE POLICY "Admin can update all profiles"
  ON users FOR UPDATE
  USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

-- RLS policies for orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Admin order policies
CREATE POLICY "Admin can view all orders"
  ON orders FOR SELECT
  USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

CREATE POLICY "Admin can update all orders"
  ON orders FOR UPDATE
  USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

-- RLS policies for order items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Admin order items policies
CREATE POLICY "Admin can view all order items"
  ON order_items FOR SELECT
  USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

CREATE POLICY "Admin can manage all order items"
  ON order_items FOR ALL
  USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_available_addons_product_id ON product_available_addons(product_id); 