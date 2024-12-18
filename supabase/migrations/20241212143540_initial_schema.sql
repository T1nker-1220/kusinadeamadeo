-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  google_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create product_variants table
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_adjustment DECIMAL(10,2) DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_id TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  delivery_address TEXT,
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Customers policies
CREATE POLICY "Public read access to customers" ON customers
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON customers
  FOR UPDATE USING (auth.uid()::text = google_id);

-- Categories policies
CREATE POLICY "Public read access to categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admin full access to categories" ON categories
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- Products policies
CREATE POLICY "Public read access to products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Admin full access to products" ON products
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- Product variants policies
CREATE POLICY "Public read access to product variants" ON product_variants
  FOR SELECT USING (true);

CREATE POLICY "Admin full access to product variants" ON product_variants
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid()::text IN (
    SELECT google_id FROM customers WHERE id = customer_id
  ));

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid()::text IN (
    SELECT google_id FROM customers WHERE id = customer_id
  ));

CREATE POLICY "Admin full access to orders" ON orders
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- Order items policies
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id IN (
        SELECT id FROM customers WHERE google_id = auth.uid()::text
      )
    )
  );

CREATE POLICY "Admin full access to order items" ON order_items
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- Set admin email in database settings
DO $$
BEGIN
  PERFORM set_config('app.admin_email', 'kusinadeamadeo@gmail.com', false);
END $$; 