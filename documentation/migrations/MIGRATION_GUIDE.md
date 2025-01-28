# Database Migration Guide

## Overview

This guide details the process of migrating the Kusina De Amadeo database to use Supabase storage and implement optimized schema changes. The migration includes moving images from local storage to Supabase, enhancing the database schema, and implementing proper validation procedures.

## Prerequisites

- Supabase project with appropriate permissions
- Environment variables configured:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  ```
- Node.js 18 or higher
- pnpm 8 or higher

## Migration Components

1. **Initial Setup**
   - `initial-setup.sql`: Creates base functions for migration
   - `setup-migration.ts`: Configures migration environment
   - `setup-migration.sql`: Sets up validation functions

2. **Schema Migration**
   - `schema-optimization.sql`: Implements schema changes
   - `execute-migration.ts`: Handles migration execution

3. **Storage Migration**
   - `storage-migration.ts`: Manages image migration
   - Includes validation and rollback capabilities

## Safety Measures

1. **Backup System**
   - Automatic backup before migration
   - JSON backup of all affected tables
   - Timestamp-based backup storage

2. **Validation Checks**
   - Pre-migration validation
   - Post-migration validation
   - Schema integrity checks
   - Image migration verification

3. **Rollback Capability**
   - Point-in-time recovery
   - Automated rollback procedures
   - State verification after rollback

## Step-by-Step Migration Process

### 1. Initial Setup

1. Run initial setup in Supabase SQL Editor:
   ```bash
   # Copy contents of src/lib/migrations/initial-setup.sql to Supabase SQL Editor
   # Execute the SQL to create base functions
   ```

2. Set up migration environment:
   ```bash
   pnpm migrate:setup
   ```

### 2. Dry Run

Run migration in dry-run mode to validate:
```bash
pnpm migrate:products:dry-run
```

### 3. Execute Migration

If dry run is successful, execute full migration:
```bash
pnpm migrate:products
```

### 4. Verify Migration

1. Check schema changes:
   ```sql
   SELECT * FROM validate_schema();
   ```

2. Verify image migration:
   ```sql
   SELECT * FROM products WHERE image_url IS NULL;
   SELECT * FROM product_variants WHERE image_url IS NULL;
   ```

## Rollback Procedures

### Automatic Rollback

If migration fails, the system will automatically attempt rollback:
```typescript
await rollbackMigration(timestamp);
```

### Manual Rollback

1. Restore from backup:
   ```bash
   # Navigate to backups directory
   cd backups/{timestamp}

   # Use provided rollback script
   pnpm migrate:rollback --timestamp={timestamp}
   ```

## Monitoring and Logging

- Migration logs are stored in `logs/migration-{timestamp}.log`
- Each step is logged with timestamp and status
- Errors are captured with full stack traces
- Validation results are logged for review

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   - Verify all required variables are set
   - Check variable names and values

2. **Permission Issues**
   - Verify Supabase service role key
   - Check RLS policies
   - Verify function permissions

3. **Storage Issues**
   - Check storage bucket permissions
   - Verify image paths
   - Check file access rights

### Recovery Steps

1. Check logs for error details
2. Verify environment configuration
3. Run validation checks
4. Execute rollback if needed
5. Retry migration with fixes

## Post-Migration Tasks

1. Verify all products have valid image URLs
2. Check all variants are properly linked
3. Verify schema constraints
4. Test application functionality
5. Monitor performance
6. Update application configuration

## Support

For issues or questions:
1. Check the troubleshooting guide
2. Review logs for specific errors
3. Contact the development team
4. Create an issue in the repository
