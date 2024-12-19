-- First, disable RLS on all tables
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_addons DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_available_addons DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Public Access" ON products;
DROP POLICY IF EXISTS "Public read access for products" ON products;
DROP POLICY IF EXISTS "Admin full access to products" ON products;
DROP POLICY IF EXISTS "Public read access for variants" ON product_variants;
DROP POLICY IF EXISTS "Admin full access to variants" ON product_variants;
DROP POLICY IF EXISTS "Public read access for addons" ON product_addons;
DROP POLICY IF EXISTS "Admin full access to addons" ON product_addons;
DROP POLICY IF EXISTS "Public read access for product_available_addons" ON product_available_addons;
DROP POLICY IF EXISTS "Admin full access to product_available_addons" ON product_available_addons;
DROP POLICY IF EXISTS "Public read access for categories" ON categories;
DROP POLICY IF EXISTS "Admin full access to categories" ON categories;

-- Re-enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_available_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create simplified public read access policies
CREATE POLICY "products_public_read" ON products
FOR SELECT TO public USING (true);

CREATE POLICY "variants_public_read" ON product_variants
FOR SELECT TO public USING (true);

CREATE POLICY "addons_public_read" ON product_addons
FOR SELECT TO public USING (true);

CREATE POLICY "available_addons_public_read" ON product_available_addons
FOR SELECT TO public USING (true);

CREATE POLICY "categories_public_read" ON categories
FOR SELECT TO public USING (true);

-- Create admin policies for authenticated users with admin email
CREATE POLICY "products_admin_all" ON products
FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

CREATE POLICY "variants_admin_all" ON product_variants
FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

CREATE POLICY "addons_admin_all" ON product_addons
FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

CREATE POLICY "available_addons_admin_all" ON product_available_addons
FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

CREATE POLICY "categories_admin_all" ON categories
FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'kusinadeamadeo@gmail.com');

-- Grant necessary permissions to public and authenticated roles
GRANT SELECT ON products TO public, authenticated;
GRANT SELECT ON product_variants TO public, authenticated;
GRANT SELECT ON product_addons TO public, authenticated;
GRANT SELECT ON product_available_addons TO public, authenticated;
GRANT SELECT ON categories TO public, authenticated;

-- Grant additional permissions to authenticated admin
GRANT ALL ON products TO authenticated;
GRANT ALL ON product_variants TO authenticated;
GRANT ALL ON product_addons TO authenticated;
GRANT ALL ON product_available_addons TO authenticated;
GRANT ALL ON categories TO authenticated; 