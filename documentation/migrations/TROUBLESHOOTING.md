# Migration Troubleshooting Guide

## Common Issues and Solutions

### 1. Environment Setup Issues

#### Missing Environment Variables
```
Error: Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Solution:**
1. Check `.env` file exists
2. Verify required variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
3. Ensure no trailing spaces
4. Restart the migration process

#### Invalid Environment Variables
```
Error: Invalid JWT token
```

**Solution:**
1. Verify Supabase project settings
2. Check token expiration
3. Regenerate keys if necessary
4. Update `.env` file

### 2. Database Migration Issues

#### Function Creation Failures
```
Error: function "exec_sql" already exists
```

**Solution:**
1. Check if function exists:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'exec_sql';
   ```
2. Drop existing function if needed:
   ```sql
   DROP FUNCTION IF EXISTS exec_sql(text);
   ```
3. Recreate function from `initial-setup.sql`

#### Schema Validation Errors
```
Error: relation "products" does not exist
```

**Solution:**
1. Verify database connection
2. Check schema exists:
   ```sql
   SELECT schema_name FROM information_schema.schemata;
   ```
3. Run initial schema creation if needed

### 3. Storage Migration Issues

#### Upload Failures
```
Error: Storage bucket "products" not found
```

**Solution:**
1. Create required buckets:
   ```typescript
   await supabase.storage.createBucket('products', {
     public: false,
     allowedMimeTypes: ['image/png']
   });
   ```
2. Verify bucket permissions
3. Retry upload

#### Image Access Issues
```
Error: Access denied to storage/objects
```

**Solution:**
1. Check storage policies:
   ```sql
   SELECT * FROM storage.policies;
   ```
2. Update policies if needed:
   ```sql
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'products');
   ```
3. Verify role permissions

### 4. Performance Issues

#### Slow Migration
```
Warning: Migration taking longer than expected
```

**Solution:**
1. Check network connection
2. Monitor resource usage:
   ```bash
   # Check CPU usage
   top

   # Check memory
   free -h
   ```
3. Adjust batch size in migration script
4. Consider running in smaller chunks

#### Memory Issues
```
Error: JavaScript heap out of memory
```

**Solution:**
1. Increase Node.js memory limit:
   ```bash
   export NODE_OPTIONS="--max-old-space-size=8192"
   ```
2. Process images in smaller batches
3. Implement garbage collection hints

### 5. Validation Issues

#### Orphaned Records
```
Warning: Found orphaned variants
```

**Solution:**
1. Check orphaned records:
   ```sql
   SELECT * FROM check_orphaned_variants();
   ```
2. Clean up or reassign:
   ```sql
   -- Delete orphaned variants
   DELETE FROM product_variants
   WHERE id IN (SELECT variant_id FROM check_orphaned_variants());

   -- Or reassign to valid products
   UPDATE product_variants
   SET product_id = new_product_id
   WHERE id = orphaned_variant_id;
   ```

#### Invalid Prices
```
Warning: Found invalid prices
```

**Solution:**
1. Identify invalid records:
   ```sql
   SELECT * FROM check_invalid_prices();
   ```
2. Fix prices:
   ```sql
   UPDATE products
   SET base_price = 0
   WHERE base_price < 0;

   UPDATE product_variants
   SET price = 0
   WHERE price < 0;
   ```

### 6. Rollback Issues

#### Failed Rollback
```
Error: Could not restore from backup
```

**Solution:**
1. Check backup files exist
2. Verify backup integrity
3. Manual restoration:
   ```typescript
   // Read backup files
   const backupData = JSON.parse(
     await fs.readFile('backups/timestamp/data.json')
   );

   // Restore data
   await supabase
     .from('products')
     .upsert(backupData.products);
   ```

#### Incomplete Rollback
```
Warning: Some changes could not be reverted
```

**Solution:**
1. Identify remaining changes
2. Manual cleanup:
   ```sql
   -- Reset schema changes
   ALTER TABLE products
   DROP COLUMN IF EXISTS image_url;

   -- Reset storage
   DELETE FROM storage.objects
   WHERE bucket_id = 'products';
   ```

## Recovery Procedures

### 1. Quick Recovery
For minor issues:
1. Check error logs
2. Fix specific issue
3. Retry failed operation
4. Validate changes

### 2. Full Recovery
For major issues:
1. Stop all migration processes
2. Restore from backup
3. Verify data integrity
4. Restart migration

### 3. Manual Intervention
When automatic recovery fails:
1. Access database directly
2. Fix data inconsistencies
3. Reset migration state
4. Restart process

## Prevention Tips

1. **Always Backup First**
   ```bash
   # Create backup
   pnpm migrate:backup

   # Verify backup
   pnpm migrate:verify-backup
   ```

2. **Use Dry Run**
   ```bash
   # Test migration
   pnpm migrate:products:dry-run

   # Check logs
   cat logs/migration-latest.log
   ```

3. **Monitor Progress**
   ```bash
   # Watch logs
   tail -f logs/migration-latest.log

   # Check status
   pnpm migrate:status
   ```

## Support Resources

1. Check migration logs:
   ```bash
   ls -l logs/
   cat logs/migration-latest.log
   ```

2. Verify database state:
   ```sql
   SELECT * FROM validate_schema();
   ```

3. Contact support:
   - Open GitHub issue
   - Include logs and error messages
   - Describe steps to reproduce

4. Emergency rollback:
   ```bash
   pnpm migrate:rollback --timestamp=latest
   ```
