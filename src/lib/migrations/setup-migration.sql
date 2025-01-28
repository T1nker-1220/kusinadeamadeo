-- Create a function to execute SQL with proper permissions
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void AS $$
BEGIN
    EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;

-- Create schema validation function
CREATE OR REPLACE FUNCTION validate_schema()
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    -- Check for orphaned variants and invalid prices
    SELECT json_build_object(
        'orphaned_variants', (
            SELECT json_agg(row_to_json(t))
            FROM (
                SELECT pv.id, pv.product_id
                FROM product_variants pv
                LEFT JOIN products p ON p.id = pv.product_id
                WHERE p.id IS NULL
            ) t
        ),
        'invalid_prices', (
            SELECT json_agg(row_to_json(t))
            FROM (
                SELECT 'products' as table_name, id, base_price as price
                FROM products
                WHERE base_price < 0
                UNION ALL
                SELECT 'variants' as table_name, id, price
                FROM product_variants
                WHERE price < 0
            ) t
        ),
        'validation_timestamp', CURRENT_TIMESTAMP
    ) INTO result;

    -- Log validation execution
    RAISE NOTICE 'Schema validation executed at %', CURRENT_TIMESTAMP;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION validate_schema() TO authenticated;

-- Create function to check orphaned variants
CREATE OR REPLACE FUNCTION check_orphaned_variants()
RETURNS TABLE (
    variant_id uuid,
    product_id uuid
) AS $$
BEGIN
    RETURN QUERY
    SELECT pv.id, pv.product_id
    FROM product_variants pv
    LEFT JOIN products p ON p.id = pv.product_id
    WHERE p.id IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION check_orphaned_variants() TO authenticated;

-- Test the functions
DO $$
BEGIN
    -- Test validate_schema
    PERFORM validate_schema();
    RAISE NOTICE 'validate_schema function created and tested successfully';

    -- Test check_orphaned_variants
    PERFORM * FROM check_orphaned_variants();
    RAISE NOTICE 'check_orphaned_variants function created and tested successfully';
END $$;
