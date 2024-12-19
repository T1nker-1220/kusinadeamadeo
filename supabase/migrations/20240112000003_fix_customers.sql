-- Create customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  google_id UUID UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read for users accessing their own data" ON customers;
DROP POLICY IF EXISTS "Enable insert/update for auth callback" ON customers;
DROP POLICY IF EXISTS "Enable admin access" ON customers;

-- Create policies
CREATE POLICY "Enable read for users accessing their own data"
  ON customers
  FOR SELECT
  USING (
    auth.uid()::text = google_id::text
    OR 
    current_setting('app.customer_access_enabled', true)::boolean = true
    OR
    auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );

CREATE POLICY "Enable insert/update for auth callback"
  ON customers
  FOR ALL
  USING (
    current_setting('app.customer_access_enabled', true)::boolean = true
    OR
    auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );

CREATE POLICY "Enable admin access"
  ON customers
  FOR ALL
  USING (
    auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );

-- Create function to enable customer access
CREATE OR REPLACE FUNCTION enable_customer_access()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config('app.customer_access_enabled', 'true', true);
END;
$$;

-- Create function to disable customer access
CREATE OR REPLACE FUNCTION disable_customer_access()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config('app.customer_access_enabled', 'false', true);
END;
$$;

-- Set admin email
DO $$
BEGIN
  PERFORM set_config('app.admin_email', 'kusinadeamadeo@gmail.com', false);
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Insert admin user if not exists
INSERT INTO customers (
  google_id,
  email,
  full_name,
  last_login
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'kusinadeamadeo@gmail.com',
  'Admin User',
  NOW()
)
ON CONFLICT (email) DO NOTHING; 