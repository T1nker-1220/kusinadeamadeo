-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS enable_customer_access();
DROP FUNCTION IF EXISTS disable_customer_access();

-- Create or replace function to enable customer access with cookie handling
CREATE OR REPLACE FUNCTION enable_customer_access()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set session variable to allow customer access
  PERFORM set_config('app.customer_access_enabled', 'true', true);
  -- Set cookie settings
  PERFORM set_config('app.cookie_secure', CASE WHEN current_setting('app.environment', true) = 'production' THEN 'true' ELSE 'false' END, true);
  PERFORM set_config('app.cookie_same_site', 'lax', true);
  PERFORM set_config('app.cookie_path', '/', true);
END;
$$;

-- Create or replace function to disable customer access with cookie cleanup
CREATE OR REPLACE FUNCTION disable_customer_access()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Reset session variables
  PERFORM set_config('app.customer_access_enabled', 'false', true);
  PERFORM set_config('app.cookie_secure', 'false', true);
  PERFORM set_config('app.cookie_same_site', 'lax', true);
  PERFORM set_config('app.cookie_path', '/', true);
END;
$$;

-- Update RLS policies to include cookie checks
DROP POLICY IF EXISTS "Enable read for users accessing their own data" ON customers;
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

DROP POLICY IF EXISTS "Enable insert/update for auth callback" ON customers;
CREATE POLICY "Enable insert/update for auth callback"
  ON customers
  FOR ALL
  USING (
    current_setting('app.customer_access_enabled', true)::boolean = true
    OR
    auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );

-- Set default environment
DO $$
BEGIN
  -- Set environment (development/production)
  PERFORM set_config('app.environment', COALESCE(current_setting('app.environment', true), 'development'), false);
  -- Set admin email
  PERFORM set_config('app.admin_email', 'kusinadeamadeo@gmail.com', false);
  -- Set default cookie settings
  PERFORM set_config('app.cookie_secure', 'false', false);
  PERFORM set_config('app.cookie_same_site', 'lax', false);
  PERFORM set_config('app.cookie_path', '/', false);
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION enable_customer_access() TO authenticated;
GRANT EXECUTE ON FUNCTION disable_customer_access() TO authenticated;
GRANT EXECUTE ON FUNCTION enable_customer_access() TO anon;
GRANT EXECUTE ON FUNCTION disable_customer_access() TO anon;