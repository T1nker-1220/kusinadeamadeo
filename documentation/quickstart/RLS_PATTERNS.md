# RLS Common Patterns Quick Reference

## Basic Patterns

### 1. User Data Protection
```sql
CREATE POLICY "user_own_data"
    ON "TableName"
    FOR ALL
    TO authenticated
    USING ("userId"::text = auth.uid()::text);
```

### 2. Public Read Access
```sql
CREATE POLICY "public_read"
    ON "TableName"
    FOR SELECT
    TO PUBLIC
    USING (true);
```

### 3. Admin-Only Access
```sql
CREATE POLICY "admin_only"
    ON "TableName"
    FOR ALL
    TO authenticated
    USING (auth.is_admin());
```

## Relationship Patterns

### 1. Parent-Child Relationship
```sql
CREATE POLICY "access_through_parent"
    ON "ChildTable"
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "ParentTable"
            WHERE "ParentTable"."id" = "ChildTable"."parentId"
            AND "ParentTable"."userId"::text = auth.uid()::text
        )
    );
```

### 2. Mixed Access (Own Data + Admin)
```sql
CREATE POLICY "own_or_admin"
    ON "TableName"
    FOR ALL
    TO authenticated
    USING (
        "userId"::text = auth.uid()::text
        OR
        auth.is_admin()
    );
```

## Permission Patterns

### 1. Basic Table Permissions
```sql
-- Reset and grant
REVOKE ALL ON "TableName" FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "TableName" TO authenticated;
```

### 2. Sequence Permissions
```sql
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
```

### 3. Type Permissions
```sql
GRANT USAGE ON TYPE "EnumName" TO authenticated;
```

## Common Solutions

### 1. UUID Comparison
```sql
-- ✅ Correct way
"id"::text = auth.uid()::text

-- ❌ Wrong way
id = auth.uid()::uuid
```

### 2. Case Sensitivity
```sql
-- ✅ Correct way
"userId"::text = auth.uid()::text

-- ❌ Wrong way
userid = auth.uid()::text
```

### 3. Related Data Access
```sql
-- ✅ Correct way
EXISTS (
    SELECT 1 FROM "ParentTable"
    WHERE "ParentTable"."id" = "ChildTable"."parentId"
    AND "ParentTable"."userId"::text = auth.uid()::text
)

-- ❌ Wrong way
"parentId" IN (SELECT id FROM "ParentTable" WHERE userId = auth.uid())
```

## Verification Queries

### 1. Check Policy Status
```sql
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

### 2. Check Permissions
```sql
SELECT has_table_privilege('authenticated', 'TableName', 'SELECT');
```

### 3. List All Permissions
```sql
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'authenticated';
```

## Best Practices Checklist

### Setup
- [ ] Enable RLS on table
- [ ] Drop existing policies
- [ ] Create admin check function
- [ ] Grant base permissions

### Policies
- [ ] Use proper type casting
- [ ] Quote column names
- [ ] Include admin access where needed
- [ ] Test all access patterns

### Security
- [ ] Minimum required permissions
- [ ] Proper error handling
- [ ] Regular audits
- [ ] Performance monitoring

## Quick Troubleshooting

1. Permission denied:
   - Check RLS is enabled
   - Verify policy exists
   - Check permission grants
   - Verify type casting

2. Column not found:
   - Check column name case
   - Use proper quoting
   - Verify column exists

3. Type mismatch:
   - Use text casting
   - Check data types
   - Verify comparison syntax

## Performance Tips

1. Use indexes on commonly filtered columns
2. Keep policies simple
3. Use EXISTS instead of IN
4. Regular ANALYZE on tables
5. Monitor policy performance
