-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access for products" ON products;
DROP POLICY IF EXISTS "Public read access for variants" ON product_variants;
DROP POLICY IF EXISTS "Public read access for addons" ON product_addons;
DROP POLICY IF EXISTS "Public read access for categories" ON categories;

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_available_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create public read access policies
CREATE POLICY "Public read access for products"
ON products FOR SELECT
TO public
USING (true);

CREATE POLICY "Public read access for variants"
ON product_variants FOR SELECT
TO public
USING (true);

CREATE POLICY "Public read access for addons"
ON product_addons FOR SELECT
TO public
USING (true);

CREATE POLICY "Public read access for product_available_addons"
ON product_available_addons FOR SELECT
TO public
USING (true);

CREATE POLICY "Public read access for categories"
ON categories FOR SELECT
TO public
USING (true);

-- Create admin access policies
CREATE POLICY "Admin full access to products"
ON products FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

CREATE POLICY "Admin full access to variants"
ON product_variants FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

CREATE POLICY "Admin full access to addons"
ON product_addons FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

CREATE POLICY "Admin full access to product_available_addons"
ON product_available_addons FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

CREATE POLICY "Admin full access to categories"
ON categories FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com'); 