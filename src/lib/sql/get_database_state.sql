-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_database_state();

-- Create the function
CREATE OR REPLACE FUNCTION get_database_state()
RETURNS jsonb AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'tables', (
            SELECT jsonb_agg(jsonb_build_object(
                'name', tables.table_name,
                'columns', (
                    SELECT jsonb_agg(jsonb_build_object(
                        'name', columns.column_name,
                        'type', columns.data_type,
                        'nullable', columns.is_nullable,
                        'default', columns.column_default
                    ))
                    FROM information_schema.columns
                    WHERE columns.table_schema = 'public'
                    AND columns.table_name = tables.table_name
                ),
                'policies', (
                    SELECT jsonb_agg(jsonb_build_object(
                        'name', pol.policyname,
                        'command', pol.cmd,
                        'roles', pol.roles,
                        'using', pol.qual,
                        'with_check', pol.with_check
                    ))
                    FROM pg_policies pol
                    WHERE pol.schemaname = 'public'
                    AND pol.tablename = tables.table_name
                ),
                'indexes', (
                    SELECT jsonb_agg(jsonb_build_object(
                        'name', idx.indexname,
                        'definition', idx.indexdef
                    ))
                    FROM pg_indexes idx
                    WHERE idx.schemaname = 'public'
                    AND idx.tablename = tables.table_name
                )
            ))
            FROM information_schema.tables tables
            WHERE tables.table_schema = 'public'
            AND tables.table_type = 'BASE TABLE'
        ),
        'enums', (
            SELECT jsonb_agg(enum_info)
            FROM (
                SELECT jsonb_build_object(
                    'name', t.typname,
                    'values', (
                        SELECT jsonb_agg(e.enumlabel ORDER BY e.enumsortorder)
                        FROM pg_enum e
                        WHERE e.enumtypid = t.oid
                    )
                ) AS enum_info
                FROM pg_type t
                JOIN pg_namespace n ON t.typnamespace = n.oid
                WHERE t.typtype = 'e'
                AND n.nspname = 'public'
            ) subq
        ),
        'functions', (
            SELECT jsonb_agg(jsonb_build_object(
                'name', p.proname,
                'language', l.lanname,
                'return_type', t.typname,
                'arguments', pg_get_function_arguments(p.oid),
                'security_definer', p.prosecdef
            ))
            FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            JOIN pg_language l ON p.prolang = l.oid
            JOIN pg_type t ON p.prorettype = t.oid
            WHERE n.nspname = 'public'
        ),
        'triggers', (
            SELECT jsonb_agg(jsonb_build_object(
                'name', trg.trigger_name,
                'table', trg.event_object_table,
                'timing', trg.action_timing,
                'event', trg.event_manipulation,
                'definition', trg.action_statement
            ))
            FROM information_schema.triggers trg
            WHERE trg.trigger_schema = 'public'
        ),
        'table_contents', (
            SELECT jsonb_object_agg(table_name, table_data)
            FROM (
                SELECT table_name,
                (
                    SELECT jsonb_agg(row_to_json(t))
                    FROM (
                        SELECT *
                        FROM information_schema.tables
                        WHERE table_schema = 'public'
                        AND table_type = 'BASE TABLE'
                        LIMIT 100  -- Safety limit per table
                    ) t
                ) as table_data
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_type = 'BASE TABLE'
            ) tables
        )
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_database_state() TO authenticated;

-- Add comment to the function
COMMENT ON FUNCTION get_database_state() IS 'Returns a complete snapshot of the database state including tables, columns, policies, indexes, enums, functions, and triggers';
