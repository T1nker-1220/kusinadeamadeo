# Supabase Remote Migration Guide
=====================================

## Prerequisites
---------------

1. **PostgreSQL 17 installed locally**
2. **Environment variables set up in `.env.local`**
3. **Migration files in `supabase/migrations/` directory**
4. **Seed files in `supabase/seed.sql`**

## Required Credentials
---------------------

Make sure you have these credentials from your `.env.local`:

```env
DATABASE_URL="postgresql://postgres.blglkqttwesxmtbczvxd:Angelicadino1220!?@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
NEXT_PUBLIC_SUPABASE_URL=https://blglkqttwesxmtbczvxd.supabase.co
SUPABASE_DATABASE_PASSWORD=Angelicadino1220!?
```

## Step-by-Step Migration Process
---------------------------------

### 1. Set Up Environment
-------------------------

First, ensure you're in your project directory:

```bash
cd your-project-directory
```

### 2. Run Migrations
---------------------

Use the PostgreSQL command line tool (psql) with the correct credentials:

```bash
# Set the password as an environment variable
$env:PGPASSWORD='Angelicadino1220!?'

# Run the migration script
& 'C:\Program Files\PostgreSQL\17\bin\psql.exe' `
  -h aws-0-ap-southeast-1.pooler.supabase.com `
  -p 6543 `
  -U postgres.blglkqttwesxmtbczvxd `
  -d postgres `
  -f supabase/migrations/20241212143540_add_products_schema.sql
```

*Expected output:*

```
CREATE EXTENSION
CREATE TABLE (categories)
CREATE TABLE (products)
CREATE TABLE (products_audit)
CREATE TABLE (variants)
CREATE FUNCTION (update_updated_at_column)
CREATE FUNCTION (audit_product_changes)
CREATE TRIGGER
ALTER TABLE
CREATE POLICY
INSERT 0 5 (categories)
CREATE POLICY (storage)
```

### 3. Run Seed Data
---------------------

After migrations are successful, run the seed script:

```bash
# Password should still be set from previous step
& 'C:\Program Files\PostgreSQL\17\bin\psql.exe' `
  -h aws-0-ap-southeast-1.pooler.supabase.com `
  -p 6543 `
  -U postgres.blglkqttwesxmtbczvxd `
  -d postgres `
  -f supabase/seed.sql
```

## Troubleshooting
------------------

### Common Issues and Solutions
------------------------------

1. **Access Denied Error**

   ```
   FATAL: Tenant or user not found
   ```

   *Solution:* Make sure you're using the full username including the project reference (postgres.blglkqttwesxmtbczvxd)

2. **Connection Issues**

   ```
   could not connect to server
   ```

   *Solution:* Verify your VPN is off and you have internet connectivity

3. **Permission Issues**
   ```
   permission denied for table
   ```
   *Solution:* Make sure you're using the service_role key and proper credentials

### Verification Steps
----------------------

To verify your migration was successful:

1. **Check the Supabase Dashboard Tables**
2. **Verify RLS Policies are in place**
3. **Confirm Categories and Products are populated**
4. **Test Storage Bucket permissions**

## Important Notes
------------------

1. **Always backup your database before running migrations**
2. **Use the correct port (6543) for Supabase PostgreSQL**
3. **Include the project ref in the username (postgres.PROJECT_REF)**
4. **Keep your credentials secure and never commit them to version control**

## Command Reference
--------------------

### Check Database Connection

```bash
$env:PGPASSWORD='your_password'; & 'C:\Program Files\PostgreSQL\17\bin\psql.exe' -h aws-0-ap-southeast-1.pooler.supabase.com -p 6543 -U postgres.your_project_ref -d postgres -c "\conninfo"
```

### List Tables

```bash
$env:PGPASSWORD='your_password'; & 'C:\Program Files\PostgreSQL\17\bin\psql.exe' -h aws-0-ap-southeast-1.pooler.supabase.com -p 6543 -U postgres.your_project_ref -d postgres -c "\dt"
```

### View Table Structure

```bash
$env:PGPASSWORD='your_password'; & 'C:\Program Files\PostgreSQL\17\bin\psql.exe' -h aws-0-ap-southeast-1.pooler.supabase.com -p 6543 -U postgres.your_project_ref -d postgres -c "\d+ table_name"
```

## Security Considerations
-------------------------

1. **Always use environment variables for sensitive information**
2. **Never expose your service_role key**
3. **Implement proper RLS policies before exposing data**
4. **Use the principle of least privilege for database access**

## Next Steps
--------------

After successful migration:

1. **Verify all tables are created correctly**
2. **Check RLS policies are working**
3. **Test data access through your application**
4. **Monitor for any performance issues**
