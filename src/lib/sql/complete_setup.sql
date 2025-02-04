-- Function to get complete database information
CREATE OR REPLACE FUNCTION get_database_state()
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'schemas', json_build_array(json_build_object(
            'name', 'public',
            'tables', (
                SELECT json_agg(json_build_object(
                    'name', tables.table_name,
                    'schema', tables.table_schema,
                    'columns', (
                        SELECT json_agg(json_build_object(
                            'name', cols.column_name,
                            'type', cols.data_type,
                            'isNullable', cols.is_nullable = 'YES',
                            'defaultValue', cols.column_default,
                            'isPrimaryKey', (
                                SELECT EXISTS (
                                    SELECT 1 FROM information_schema.key_column_usage kcu
                                    WHERE kcu.table_name = cols.table_name
                                    AND kcu.column_name = cols.column_name
                                )
                            ),
                            'isForeignKey', (
                                SELECT EXISTS (
                                    SELECT 1 FROM information_schema.key_column_usage kcu
                                    WHERE kcu.table_name = cols.table_name
                                    AND kcu.column_name = cols.column_name
                                    AND kcu.position_in_unique_constraint IS NOT NULL
                                )
                            ),
                            'references', (
                                SELECT json_build_object(
                                    'table', ccu.table_name,
                                    'column', ccu.column_name
                                )
                                FROM information_schema.key_column_usage kcu
                                JOIN information_schema.constraint_column_usage ccu
                                ON kcu.constraint_name = ccu.constraint_name
                                WHERE kcu.table_name = cols.table_name
                                AND kcu.column_name = cols.column_name
                                AND kcu.position_in_unique_constraint IS NOT NULL
                                LIMIT 1
                            )
                        ))
                        FROM information_schema.columns cols
                        WHERE cols.table_name = tables.table_name
                        AND cols.table_schema = tables.table_schema
                    ),
                    'policies', (
                        SELECT json_agg(json_build_object(
                            'name', pol.policyname,
                            'schema', pol.schemaname,
                            'table', pol.tablename,
                            'action', pol.cmd,
                            'roles', pol.roles,
                            'definition', pg_get_policydef(pol.oid)
                        ))
                        FROM pg_policies pol
                        WHERE pol.tablename = tables.table_name
                        AND pol.schemaname = tables.table_schema
                    ),
                    'indexes', (
                        SELECT json_agg(json_build_object(
                            'name', idx.indexname,
                            'table', idx.tablename,
                            'schema', idx.schemaname,
                            'definition', idx.indexdef,
                            'isUnique', idx.indexdef LIKE 'CREATE UNIQUE%'
                        ))
                        FROM pg_indexes idx
                        WHERE idx.tablename = tables.table_name
                        AND idx.schemaname = tables.table_schema
                    ),
                    'triggers', (
                        SELECT json_agg(json_build_object(
                            'name', trg.trigger_name,
                            'table', trg.event_object_table,
                            'schema', trg.event_object_schema,
                            'function', trg.action_statement,
                            'events', array[trg.event_manipulation]
                        ))
                        FROM information_schema.triggers trg
                        WHERE trg.event_object_table = tables.table_name
                        AND trg.event_object_schema = tables.table_schema
                    )
                ))
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_type = 'BASE TABLE'
            ),
            'functions', (
                SELECT json_agg(json_build_object(
                    'name', p.proname,
                    'schema', n.nspname,
                    'language', l.lanname,
                    'definition', pg_get_functiondef(p.oid),
                    'returnType', t.typname,
                    'arguments', (
                        SELECT json_agg(json_build_object(
                            'name', a.attname,
                            'type', typ.typname
                        ))
                        FROM pg_attribute a
                        JOIN pg_type typ ON a.atttypid = typ.oid
                        WHERE a.attrelid = p.prorettype
                        AND a.attnum > 0
                    )
                ))
                FROM pg_proc p
                JOIN pg_namespace n ON p.pronamespace = n.oid
                JOIN pg_language l ON p.prolang = l.oid
                JOIN pg_type t ON p.prorettype = t.oid
                WHERE n.nspname = 'public'
            ),
            'enums', (
                SELECT json_agg(json_build_object(
                    'name', t.typname,
                    'schema', n.nspname,
                    'values', (
                        SELECT array_agg(e.enumlabel ORDER BY e.enumsortorder)
                        FROM pg_enum e
                        WHERE e.enumtypid = t.oid
                    )
                ))
                FROM pg_type t
                JOIN pg_namespace n ON t.typnamespace = n.oid
                WHERE t.typtype = 'e'
                AND n.nspname = 'public'
            )
        )),
        'timestamp', now(),
        'version', version()
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_database_state() TO authenticated;
