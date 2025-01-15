# Supabase RLS Implementation Guide

## Overview
This document outlines the successful implementation of Row Level Security (RLS) policies in our Supabase database, including comprehensive troubleshooting steps and solutions for common issues.

## Table of Contents
1. [Common Issues & Solutions](#common-issues--solutions)
2. [Implementation Steps](#implementation-steps)
3. [Permission Management](#permission-management)
4. [Verification Steps](#verification-steps)
5. [Best Practices](#best-practices)

## Common Issues & Solutions

### 1. Type Casting Issues
```sql
ERROR: 42883: operator does not exist: text = uuid
```

**Solution:**
```sql
-- ❌ Wrong
WHERE id = auth.uid()::uuid

-- ✅ Correct
WHERE "id"::text = auth.uid()::text
```

### 2. Case Sensitivity Issues
```sql
ERROR: 42703: column "userid" does not exist
```

**Solution:**
```sql
-- ❌ Wrong
WHERE userid = auth.uid()::text

-- ✅ Correct
WHERE "userId"::text = auth.uid()::text
```

### 3. Permission Issues
```sql
ERROR: P0001: Schema permissions not properly set
```

**Solution:**
```sql
-- Reset permissions first
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;
REVOKE ALL ON SCHEMA public FROM authenticated;

-- Grant correct permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
```

## Implementation Steps

### 1. Enable RLS
```sql
ALTER TABLE "TableName" ENABLE ROW LEVEL SECURITY;
```

### 2. Create Admin Check Function
```sql
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
```

### 3. Set Up Basic Policies
```sql
-- User data protection
CREATE POLICY "Users can view own data"
    ON "TableName"
    FOR SELECT
    TO authenticated
    USING ("userId"::text = auth.uid()::text);

-- Public access
CREATE POLICY "Public read access"
    ON "TableName"
    FOR SELECT
    TO PUBLIC
    USING (true);
```

## Permission Management

### 1. Base Permissions
```sql
-- Grant schema usage
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant table access
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant sequence access
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
```

### 2. Future-Proofing Permissions
```sql
-- Set default privileges for new tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

-- Set default privileges for new sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO authenticated;
```

### 3. Enum Type Permissions
```sql
-- Grant enum type usage
DO $$
DECLARE
    enum_type text;
BEGIN
    FOR enum_type IN
        SELECT t.typname
        FROM pg_type t
        JOIN pg_namespace n ON t.typnamespace = n.oid
        WHERE n.nspname = 'public'
        AND t.typtype = 'e'
    LOOP
        EXECUTE format('GRANT USAGE ON TYPE %I TO authenticated', enum_type);
    END LOOP;
END
$$;
```

## Verification Steps

### 1. Check Basic Permissions
```sql
SELECT has_table_privilege('authenticated', 'TableName', 'SELECT');
```

### 2. Verify RLS Policies
```sql
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

### 3. Comprehensive Permission Check
```sql
-- Check all granted privileges
SELECT
    r.rolname,
    ARRAY_AGG(DISTINCT p.privilege_type) as privileges
FROM pg_roles r
LEFT JOIN information_schema.role_table_grants p
    ON r.rolname = p.grantee
WHERE r.rolname = 'authenticated'
GROUP BY r.rolname;
```

## Best Practices

### 1. Type Casting
- Always cast both sides of UUID comparisons to text
- Use proper column name quoting
- Be consistent with casting throughout policies

### 2. Permission Management
- Reset permissions before granting new ones
- Grant minimum required permissions
- Use default privileges for future-proofing
- Include sequence permissions for auto-incrementing fields

### 3. Policy Structure
- Use descriptive policy names
- Drop existing policies before creating new ones
- Include proper TO clause (PUBLIC or authenticated)
- Use EXISTS clauses for related table checks

### 4. Error Handling
- Implement proper error checking
- Use RAISE NOTICE for debugging
- Collect and report all missing permissions
- Verify permissions after granting

### 5. Security Considerations
- Enable RLS on all tables
- Implement proper admin checks
- Use SECURITY DEFINER functions carefully
- Regular permission audits

## Maintenance

### Regular Checks
1. Verify policy effectiveness
2. Audit permissions regularly
3. Monitor performance impact
4. Update documentation

### Performance Optimization
1. Create proper indexes for policy conditions
2. Monitor query performance
3. Optimize complex policies
4. Regular policy review

## Troubleshooting Checklist

- [ ] Verify RLS is enabled on all tables
- [ ] Check type casting in policies
- [ ] Verify permission grants
- [ ] Test policy effectiveness
- [ ] Monitor performance impact
- [ ] Audit security compliance
