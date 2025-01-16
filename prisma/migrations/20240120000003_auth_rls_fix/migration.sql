-- Drop existing User policies
DROP POLICY IF EXISTS "Users can view own data" ON "User";
DROP POLICY IF EXISTS "Admins can view all data" ON "User";
DROP POLICY IF EXISTS "Users can update own data" ON "User";

-- Recreate User policies with correct permissions
CREATE POLICY "Users can view own data" ON "User"
    FOR SELECT
    TO authenticated
    USING (
        id::text = auth.uid()::text
        OR
        auth.is_admin() = true
    );

CREATE POLICY "Admins can view all data" ON "User"
    FOR ALL
    TO authenticated
    USING (auth.is_admin() = true);

CREATE POLICY "Users can update own data" ON "User"
    FOR UPDATE
    TO authenticated
    USING (id::text = auth.uid()::text);

-- Update permissions to be more specific
REVOKE ALL ON "User" FROM authenticated;
GRANT SELECT, INSERT, UPDATE ON "User" TO authenticated;
