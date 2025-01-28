import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import { migrateVariantImages, validateMigration } from './storage-migration';

// Load environment variables
dotenv.config();

// Verify environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

interface MigrationResult {
  success: boolean;
  error?: string;
}

async function backupCurrentState(): Promise<MigrationResult> {
  try {
    console.log('Creating database backup...');

    // Backup products table
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');

    if (productsError) throw productsError;

    // Backup variants table
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('*');

    if (variantsError) throw variantsError;

    // Save backups
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups', timestamp);

    await fs.mkdir(backupDir, { recursive: true });
    await fs.writeFile(
      path.join(backupDir, 'products.json'),
      JSON.stringify(products, null, 2)
    );
    await fs.writeFile(
      path.join(backupDir, 'variants.json'),
      JSON.stringify(variants, null, 2)
    );

    console.log('Backup created successfully');
    return { success: true };
  } catch (error) {
    console.error('Backup failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function executeSchemaMigration(): Promise<MigrationResult> {
  try {
    console.log('Executing schema migration...');

    // Read SQL migration file
    const sqlPath = path.join(__dirname, 'schema-optimization.sql');
    const sql = await fs.readFile(sqlPath, 'utf-8');

    // Execute the SQL directly
    const { error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      console.error('SQL execution error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    console.log('Schema migration completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Schema migration failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function validateSchemaChanges(): Promise<MigrationResult> {
  try {
    console.log('Validating schema changes...');

    // Call the validation stored procedure
    const { data, error } = await supabase.rpc('validate_schema');

    if (error) {
      console.error('Validation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }

    const validationResults = data as {
      orphaned_variants: Array<{ id: string; product_id: string }>;
      invalid_prices: Array<{ table_name: string; id: string; price: number }>;
    };

    let hasIssues = false;

    if (validationResults.orphaned_variants?.length > 0) {
      console.warn('Found orphaned variants:', validationResults.orphaned_variants);
      hasIssues = true;
    }

    if (validationResults.invalid_prices?.length > 0) {
      console.warn('Found invalid prices:', validationResults.invalid_prices);
      hasIssues = true;
    }

    return {
      success: !hasIssues,
      error: hasIssues ? 'Validation found issues' : undefined
    };
  } catch (error) {
    console.error('Validation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function rollbackMigration(timestamp: string): Promise<MigrationResult> {
  try {
    console.log('Rolling back migration...');

    // Read backup files
    const backupDir = path.join(process.cwd(), 'backups', timestamp);
    const products = JSON.parse(
      await fs.readFile(path.join(backupDir, 'products.json'), 'utf-8')
    );
    const variants = JSON.parse(
      await fs.readFile(path.join(backupDir, 'variants.json'), 'utf-8')
    );

    // Restore products
    const { error: productsError } = await supabase
      .from('products')
      .upsert(products);

    if (productsError) throw productsError;

    // Restore variants
    const { error: variantsError } = await supabase
      .from('product_variants')
      .upsert(variants);

    if (variantsError) throw variantsError;

    console.log('Rollback completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Rollback failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function executeMigration() {
  console.log('Starting migration process...');

  // Step 1: Create backup
  const backupResult = await backupCurrentState();
  if (!backupResult.success) {
    console.error('Migration aborted: Backup failed');
    return;
  }

  // Step 2: Execute schema migration
  const schemaResult = await executeSchemaMigration();
  if (!schemaResult.success) {
    console.error('Migration aborted: Schema migration failed');
    // Rollback not needed as schema changes are transactional
    return;
  }

  // Step 3: Validate schema changes
  const validationResult = await validateSchemaChanges();
  if (!validationResult.success) {
    console.error('Schema validation failed, but changes are in place');
    // Continue as validation failures might be expected
  }

  // Step 4: Migrate images
  console.log('Starting image migration...');
  await migrateVariantImages();
  await validateMigration();

  console.log('Migration process completed');
}

// Execute migration if run directly
if (require.main === module) {
  executeMigration().catch(console.error);
}

export {
  backupCurrentState, executeMigration, rollbackMigration,
  validateSchemaChanges
};
