-- Enable RLS on customers table
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create function to enable customer access temporarily
CREATE OR REPLACE FUNCTION enable_customer_access()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set session variable to allow customer access
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
  -- Reset session variable
  PERFORM set_config('app.customer_access_enabled', 'false', true);
END;
$$;

-- Create RLS policy for customers table
CREATE POLICY "Enable read for users accessing their own data"
  ON customers
  FOR SELECT
  USING (
    auth.uid() = google_id::uuid
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

-- Set admin email in database settings
ALTER DATABASE postgres SET app.admin_email TO 'kusinadeamadeo@gmail.com';