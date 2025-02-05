-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_database_state();

-- Create the function
CREATE OR REPLACE FUNCTION get_database_state()
RETURNS jsonb AS $$
DECLARE
    result jsonb;
    table_record record;
    table_contents jsonb;
    dynamic_sql text;
    storage_info jsonb;
BEGIN
    -- Initialize table_contents as an empty object
    table_contents := '{}'::jsonb;

    -- Get storage information
    SELECT jsonb_build_object(
        'buckets', (
            SELECT jsonb_agg(jsonb_build_object(
                'id', buckets.id,
                'name', buckets.name,
                'owner', buckets.owner,
                'public', buckets.public,
                'created_at', buckets.created_at,
                'updated_at', buckets.updated_at,
                'objects', (
                    SELECT jsonb_agg(jsonb_build_object(
                        'name', objects.name,
                        'bucket_id', objects.bucket_id,
                        'owner', objects.owner,
                        'size', objects.metadata->>'size',
                        'mimetype', objects.metadata->>'mimetype',
                        'created_at', objects.created_at,
                        'updated_at', objects.updated_at,
                        'last_accessed_at', objects.last_accessed_at,
                        'metadata', objects.metadata
                    ))
                    FROM storage.objects
                    WHERE objects.bucket_id = buckets.id
                )
            ))
            FROM storage.buckets
        ),
        'total_size', (
            SELECT sum((objects.metadata->>'size')::bigint)
            FROM storage.objects
        ),
        'object_count', (
            SELECT count(*)
            FROM storage.objects
        )
    ) INTO storage_info;

    -- For each table in public schema, get its contents
    FOR table_record IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
    LOOP
        -- Build dynamic SQL to get all rows from the table
        dynamic_sql := format(
            'SELECT jsonb_agg(to_jsonb(t)) FROM (SELECT * FROM %I) t',
            table_record.table_name
        );

        -- Execute dynamic SQL and merge results into table_contents
        EXECUTE dynamic_sql INTO result;
        IF result IS NOT NULL THEN
            table_contents := table_contents || jsonb_build_object(table_record.table_name, result);
        ELSE
            table_contents := table_contents || jsonb_build_object(table_record.table_name, '[]'::jsonb);
        END IF;
    END LOOP;

    -- Build complete result with all database information
    SELECT jsonb_build_object(
        'tables', (
            SELECT jsonb_agg(jsonb_build_object(
                'name', tables.table_name,
                'schema', tables.table_schema,
                'columns', (
                    SELECT jsonb_agg(jsonb_build_object(
                        'name', columns.column_name,
                        'type', columns.data_type,
                        'isNullable', columns.is_nullable = 'YES',
                        'defaultValue', columns.column_default,
                        'isPrimaryKey', (
                            SELECT EXISTS (
                                SELECT 1 FROM information_schema.key_column_usage kcu
                                WHERE kcu.table_schema = tables.table_schema
                                AND kcu.table_name = tables.table_name
                                AND kcu.column_name = columns.column_name
                            )
                        ),
                        'isForeignKey', (
                            SELECT EXISTS (
                                SELECT 1 FROM information_schema.key_column_usage kcu
                                JOIN information_schema.referential_constraints rc
                                ON kcu.constraint_name = rc.constraint_name
                                WHERE kcu.table_schema = tables.table_schema
                                AND kcu.table_name = tables.table_name
                                AND kcu.column_name = columns.column_name
                            )
                        )
                    ))
                    FROM information_schema.columns
                    WHERE columns.table_schema = tables.table_schema
                    AND columns.table_name = tables.table_name
                ),
                'policies', (
                    SELECT jsonb_agg(jsonb_build_object(
                        'name', pol.policyname,
                        'schema', pol.schemaname,
                        'table', pol.tablename,
                        'action', pol.cmd,
                        'roles', pol.roles,
                        'definition', pol.qual
                    ))
                    FROM pg_policies pol
                    WHERE pol.schemaname = tables.table_schema
                    AND pol.tablename = tables.table_name
                ),
                'indexes', (
                    SELECT jsonb_agg(jsonb_build_object(
                        'name', idx.indexname,
                        'definition', idx.indexdef
                    ))
                    FROM pg_indexes idx
                    WHERE idx.schemaname = tables.table_schema
                    AND idx.tablename = tables.table_name
                )
            ))
            FROM information_schema.tables
            WHERE tables.table_schema = 'public'
            AND tables.table_type = 'BASE TABLE'
        ),
        'enums', (
            SELECT jsonb_agg(jsonb_build_object(
                'name', t.typname,
                'schema', n.nspname,
                'values', (
                    SELECT jsonb_agg(e.enumlabel ORDER BY e.enumsortorder)
                    FROM pg_enum e
                    WHERE e.enumtypid = t.oid
                )
            ))
            FROM pg_type t
            JOIN pg_namespace n ON t.typnamespace = n.oid
            WHERE t.typtype = 'e'
            AND n.nspname = 'public'
        ),
        'functions', (
            SELECT jsonb_agg(jsonb_build_object(
                'name', p.proname,
                'schema', n.nspname,
                'language', l.lanname,
                'returnType', t.typname,
                'arguments', pg_get_function_arguments(p.oid)
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
                'events', ARRAY[trg.event_manipulation]
            ))
            FROM information_schema.triggers trg
            WHERE trg.trigger_schema = 'public'
        ),
        'storage', storage_info,
        'table_contents', table_contents
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_database_state() TO authenticated;

-- Add comment to the function
COMMENT ON FUNCTION get_database_state() IS 'Returns a complete snapshot of the database state including tables, columns, policies, indexes, enums, functions, triggers, storage information, and actual table contents';
