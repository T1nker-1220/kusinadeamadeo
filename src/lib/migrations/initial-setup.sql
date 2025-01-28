-- Initial setup for migration functions
-- Run this in the Supabase SQL editor first

-- Create admin function to execute SQL
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void AS $$
BEGIN
    -- Log the SQL being executed (optional, for debugging)
    RAISE NOTICE 'Executing SQL: %', sql;

    -- Execute the SQL
    EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;

-- Test the function
DO $$
BEGIN
    PERFORM exec_sql('SELECT 1');
    RAISE NOTICE 'exec_sql function created and tested successfully';
END $$;
