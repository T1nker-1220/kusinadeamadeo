-- Drop existing tables if they exist
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_available_addons CASCADE;
DROP TABLE IF EXISTS product_addons CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products_audit CASCADE;

-- Drop existing types if they exist
DROP TYPE IF EXISTS product_category CASCADE;
DROP TYPE IF EXISTS size_option CASCADE;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Product Categories Enum
CREATE TYPE product_category AS ENUM (
  'Budget Meals',
  'Silog Meals',
  'Ala Carte',
  'Beverages',
  'Special Orders'
);

-- Product Size Options Enum
CREATE TYPE size_option AS ENUM (
  '16oz',
  '22oz'
);

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_sign_in TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT valid_role CHECK (role IN ('admin', 'customer'))
);

-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  base_price DECIMAL(10,2),
  category product_category NOT NULL,
  image_url TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  has_variants BOOLEAN DEFAULT false,
  has_addons BOOLEAN DEFAULT false
);

-- Create variants table for products with variants
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  size size_option,
  flavor TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create add-ons table
CREATE TABLE product_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create junction table for products and their available add-ons
CREATE TABLE product_available_addons (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  addon_id UUID REFERENCES product_addons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (product_id, addon_id)
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  receipt_id TEXT UNIQUE NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  delivery_address TEXT,
  contact_number TEXT,
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  CONSTRAINT valid_payment_method CHECK (payment_method IN ('gcash', 'cash')),
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'paid', 'failed'))
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  variants JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit log for product changes
CREATE TABLE products_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changed_by TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert standard add-ons
INSERT INTO product_addons (name, price) VALUES
  ('Siomai', 5.00),
  ('Shanghai', 5.00),
  ('Skinless', 10.00),
  ('Egg', 15.00),
  ('Hotdog', 15.00),
  ('Extra Sauce', 5.00);

-- Insert categories
INSERT INTO categories (name, description) VALUES
  ('Budget Meals', 'Affordable meal options from ₱35-₱60'),
  ('Silog Meals', 'Filipino breakfast favorites from ₱85-₱100'),
  ('Ala Carte', 'Individual dishes from ₱20-₱60'),
  ('Beverages', 'Drinks and refreshments from ₱29-₱39'),
  ('Special Orders', 'Custom and bulk orders');

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read access for products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Public read access for variants"
  ON product_variants FOR SELECT
  USING (true);

CREATE POLICY "Public read access for addons"
  ON product_addons FOR SELECT
  USING (true);

-- Admin write access policies
CREATE POLICY "Admin write access for products"
  ON products FOR ALL
  USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

CREATE POLICY "Admin write access for variants"
  ON product_variants FOR ALL
  USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

CREATE POLICY "Admin write access for addons"
  ON product_addons FOR ALL
  USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

-- Seed products data
-- Budget Meals
INSERT INTO products (name, description, base_price, category, image_url, has_addons)
VALUES
  ('Hotsilog', 'Hotdog with Sinangag (Fried Rice) and Itlog (Egg)', 60.00, 'Budget Meals', '/images/products/hotsilog.jpg', false),
  ('Hamsilog', 'Ham with Sinangag (Fried Rice) and Itlog (Egg)', 55.00, 'Budget Meals', '/images/products/hamsilog.jpg', false),
  ('Silog', 'Sinangag (Fried Rice) and Itlog (Egg)', 35.00, 'Budget Meals', '/images/products/silog.jpg', false),
  ('Skinless Rice', 'Skinless Longganisa with Fried Rice', 40.00, 'Budget Meals', '/images/products/skinless-rice.jpg', false),
  ('Pork Chaofan', 'Pork Fried Rice Chinese Style', 45.00, 'Budget Meals', '/images/products/pork-chaofan.jpg', true),
  ('Beef Chaofan', 'Beef Fried Rice Chinese Style', 50.00, 'Budget Meals', '/images/products/beef-chaofan.jpg', true),
  ('Siomai Rice', 'Siomai with Fried Rice', 39.00, 'Budget Meals', '/images/products/siomai-rice.jpg', false),
  ('Shanghai Rice', 'Lumpia Shanghai with Rice', 39.00, 'Budget Meals', '/images/products/shanghai-rice.jpg', false);

-- Silog Meals
INSERT INTO products (name, description, base_price, category, image_url, has_addons)
VALUES
  ('Tapsilog', 'Beef Tapa with Sinangag and Itlog', 100.00, 'Silog Meals', '/images/products/tapsilog.jpg', false),
  ('Porksilog', 'Porkchop with Sinangag and Itlog', 95.00, 'Silog Meals', '/images/products/porksilog.jpg', false),
  ('Chicksilog', 'Chicken with Sinangag and Itlog', 95.00, 'Silog Meals', '/images/products/chicksilog.jpg', false),
  ('Bangsilog', 'Bangus with Sinangag and Itlog', 100.00, 'Silog Meals', '/images/products/bangsilog.jpg', false),
  ('Sisigsilog', 'Sisig with Sinangag and Itlog', 95.00, 'Silog Meals', '/images/products/sisigsilog.jpg', false),
  ('Tocilog', 'Tocino with Sinangag and Itlog', 85.00, 'Silog Meals', '/images/products/tocilog.jpg', false);

-- Ala Carte
INSERT INTO products (name, description, base_price, category, image_url, has_variants)
VALUES
  ('Lugaw', 'Filipino Rice Porridge', 20.00, 'Ala Carte', '/images/products/lugaw.jpg', false),
  ('Goto', 'Rice Porridge with Beef Tripe', 35.00, 'Ala Carte', '/images/products/goto.jpg', false),
  ('Beef Mami', 'Beef Noodle Soup', 45.00, 'Ala Carte', '/images/products/beef-mami.jpg', false),
  ('Pares', 'Beef Stew with Rice', 60.00, 'Ala Carte', '/images/products/pares.jpg', false),
  ('Fries', 'Crispy French Fries', 25.00, 'Ala Carte', '/images/products/fries.jpg', false),
  ('Waffle', 'Fresh Baked Waffle', NULL, 'Ala Carte', '/images/products/waffle.jpg', true),
  ('Graham Bar', 'Graham Cracker Dessert Bar', 20.00, 'Ala Carte', '/images/products/graham-bar.jpg', false),
  ('Cheese Stick', 'Crispy Cheese Stick (6 pieces per order)', 10.00, 'Ala Carte', '/images/products/cheese-stick.jpg', false),
  ('Siomai', 'Chinese-style Siomai', NULL, 'Ala Carte', '/images/products/siomai.jpg', true);

-- Beverages
INSERT INTO products (name, description, base_price, category, image_url, has_variants)
VALUES
  ('Coke Float', 'Coca-Cola with Ice Cream', NULL, 'Beverages', '/images/products/coke-float.jpg', true),
  ('Iced Coffee', 'Cold Brewed Coffee with Ice (22oz)', NULL, 'Beverages', '/images/products/iced-coffee.jpg', true),
  ('Fruit Soda', 'Refreshing Fruit-flavored Soda', NULL, 'Beverages', '/images/products/fruit-soda.jpg', true);

-- Insert variants for products with variants
-- Waffle variants
INSERT INTO product_variants (product_id, name, price, flavor)
SELECT 
  p.id,
  flavor,
  15.00,
  flavor
FROM products p
CROSS JOIN (
  VALUES ('Chocolate'), ('Cheese'), ('Hotdog')
) AS flavors(flavor)
WHERE p.name = 'Waffle';

-- Siomai variants
INSERT INTO product_variants (product_id, name, price, flavor)
SELECT 
  p.id,
  flavor,
  5.00,
  flavor
FROM products p
CROSS JOIN (
  VALUES ('Chicken'), ('Beef')
) AS flavors(flavor)
WHERE p.name = 'Siomai';

-- Coke Float variants
INSERT INTO product_variants (product_id, name, price, size)
SELECT 
  p.id,
  size::text,
  CASE 
    WHEN size = '16oz' THEN 29.00
    WHEN size = '22oz' THEN 39.00
  END,
  size
FROM products p
CROSS JOIN (
  VALUES ('16oz'::size_option), ('22oz'::size_option)
) AS sizes(size)
WHERE p.name = 'Coke Float';

-- Fruit Soda variants
INSERT INTO product_variants (product_id, name, price, size, flavor)
SELECT 
  p.id,
  flavor || ' ' || size::text,
  CASE 
    WHEN size = '16oz' THEN 29.00
    WHEN size = '22oz' THEN 39.00
  END,
  size,
  flavor
FROM products p
CROSS JOIN (
  VALUES ('16oz'::size_option), ('22oz'::size_option)
) AS sizes(size)
CROSS JOIN (
  VALUES ('Blueberry'), ('Strawberry'), ('Lemon'), ('Green Apple'), ('Lychee')
) AS flavors(flavor)
WHERE p.name = 'Fruit Soda';

-- Set up add-ons for Chaofan products
INSERT INTO product_available_addons (product_id, addon_id)
SELECT p.id, pa.id
FROM products p
CROSS JOIN product_addons pa
WHERE p.name IN ('Pork Chaofan', 'Beef Chaofan'); 