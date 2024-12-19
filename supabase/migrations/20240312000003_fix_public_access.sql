-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public Access" ON products;

-- Create policy for public read access
CREATE POLICY "Public Access" ON products
FOR SELECT
USING (true);

-- Ensure table has RLS enabled but allows public reads
ALTER TABLE products FORCE ROW LEVEL SECURITY; 