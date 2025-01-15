# Supabase RLS Quick Reference

## Common Patterns

### Basic User Data Protection
```sql
CREATE POLICY "user_own_data" ON "Table"
    FOR ALL TO authenticated
    USING ("id"::text = auth.uid()::text);
```

### Public Read Access
```sql
CREATE POLICY "public_read" ON "Table"
    FOR SELECT TO PUBLIC
    USING (true);
```

### Related Table Protection
```sql
CREATE POLICY "related_protection" ON "Table"
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "ParentTable"
            WHERE "ParentTable"."id" = "Table"."parentId"
            AND "ParentTable"."userId"::text = auth.uid()::text
        )
    );
```

## Troubleshooting Checklist

1. Type Casting Issues:
   - [ ] Use `::text` on both sides
   - [ ] Quote column names
   - [ ] Check case sensitivity

2. Policy Conflicts:
   - [ ] Drop existing policies
   - [ ] Use unique policy names
   - [ ] Verify policy listing

3. Access Control:
   - [ ] Enable RLS on tables
   - [ ] Set proper TO clause
   - [ ] Test all access patterns

## Quick Fixes

### UUID vs Text
```sql
-- ❌ Wrong
id = auth.uid()::uuid

-- ✅ Right
"id"::text = auth.uid()::text
```

### Column Names
```sql
-- ❌ Wrong
userid = auth.uid()::text

-- ✅ Right
"userId"::text = auth.uid()::text
```

### Policy Cleanup
```sql
-- Always start with
DROP POLICY IF EXISTS "policy_name" ON "table_name";
```

## Verification Commands

```sql
-- List all policies
SELECT tablename, policyname, qual
FROM pg_policies
WHERE schemaname = 'public';

-- Test policy
SELECT has_table_privilege('authenticated', 'TableName', 'SELECT');
```
