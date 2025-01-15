# Supabase RLS Implementation Guide

## Overview
This document outlines the successful implementation of Row Level Security (RLS) policies in our Supabase database, including troubleshooting steps and solutions for common type casting issues.

## Table of Contents
1. [Common Issues](#common-issues)
2. [Solutions](#solutions)
3. [Implementation Steps](#implementation-steps)
4. [Policy Verification](#policy-verification)
5. [Best Practices](#best-practices)

## Common Issues

### Type Casting Issues
```sql
ERROR: 42883: operator does not exist: text = uuid
HINT: No operator matches the given name and argument types.
```

This error occurs when comparing `auth.uid()` (text) with UUID columns without proper type casting.

### Case Sensitivity Issues
```sql
ERROR: 42703: column "userid" does not exist
HINT: Perhaps you meant to reference the column "Order.userId"
```

PostgreSQL is case-sensitive with quoted identifiers, requiring exact column name matches.

## Solutions

### 1. Text Casting Solution
Convert both sides to text for comparison:
```sql
-- Instead of
id = auth.uid()::uuid

-- Use
"id"::text = auth.uid()::text
```

### 2. Column Naming Solution
Use double quotes for column names:
```sql
-- Instead of
userId = auth.uid()::text

-- Use
"userId"::text = auth.uid()::text
```

## Implementation Steps

### 1. Enable RLS
```sql
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
```

### 2. Drop Existing Policies
```sql
DROP POLICY IF EXISTS "policy_name" ON "table_name";
```

### 3. Create Basic Policies
```sql
-- Public read access
CREATE POLICY "allow_public_read_categories" ON "Category"
    FOR SELECT TO PUBLIC
    USING (true);

-- User data protection
CREATE POLICY "allow_user_own_data" ON "User"
    FOR ALL TO authenticated
    USING ("id"::text = auth.uid()::text);
```

### 4. Create Related Table Policies
```sql
-- Order protection
CREATE POLICY "allow_user_own_orders" ON "Order"
    FOR ALL TO authenticated
    USING ("userId"::text = auth.uid()::text);

-- Payment protection with relationships
CREATE POLICY "allow_user_own_payments" ON "Payment"
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "Order"
            WHERE "Order"."id" = "Payment"."orderId"
            AND "Order"."userId"::text = auth.uid()::text
        )
    );
```

## Policy Verification

### Verify Implementation
```sql
SELECT tablename, policyname, qual
FROM pg_policies
WHERE schemaname = 'public';
```

Expected Results:
- Public tables (Category, Product) should show `true` for qual
- User-specific tables should show text casting comparisons
- Related tables should show proper EXISTS clauses

## Best Practices

### 1. Type Casting
- Always cast both sides of the comparison to text
- Use consistent casting throughout policies
- Double quote all column names

### 2. Policy Structure
- Drop existing policies before creating new ones
- Use descriptive policy names
- Include proper TO clause (PUBLIC or authenticated)

### 3. Security Considerations
- Enable RLS on all tables
- Implement proper admin checks
- Use EXISTS clauses for related table checks

### 4. Maintenance
- Keep policies simple and focused
- Document all policy changes
- Regularly verify policy effectiveness

## Troubleshooting Steps

1. **Identify Error Type**
   - Type mismatch errors (42883)
   - Column not found errors (42703)
   - Policy already exists errors (42710)

2. **Apply Fixes**
   - Add proper type casting
   - Fix column name references
   - Drop existing policies first

3. **Verify Changes**
   - Check policy listing
   - Test with sample queries
   - Verify all access patterns

## Future Considerations

1. **Scaling**
   - Monitor policy performance
   - Consider index impact
   - Plan for data growth

2. **Maintenance**
   - Regular policy audits
   - Performance monitoring
   - Security reviews

3. **Documentation**
   - Keep this guide updated
   - Document new patterns
   - Track policy changes
