-- Enable RLS on User table
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can view own data" ON "User";
DROP POLICY IF EXISTS "Admins can view all data" ON "User";
DROP POLICY IF EXISTS "Users can update own data" ON "User";

-- Create admin check function if it doesn't exist
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "User"
    WHERE "id"::text = auth.uid()::text
    AND "role" = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy for users to view their own data
CREATE POLICY "Users can view own data" ON "User"
    FOR SELECT
    TO authenticated
    USING (
        id::text = auth.uid()::text
        OR
        auth.is_admin() = true
    );

-- Policy for admins to view all data
CREATE POLICY "Admins can view all data" ON "User"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);

-- Policy for users to update their own data
CREATE POLICY "Users can update own data" ON "User"
    FOR UPDATE
    TO authenticated
    USING (id::text = auth.uid()::text);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON "User" TO authenticated;
