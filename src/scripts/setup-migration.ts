import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

async function setupMigration() {
  // Verify environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required environment variables');
  }

  // Initialize Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // First check if exec_sql function exists
    const { data: functionExists, error: checkError } = await supabase
      .rpc('exec_sql', { sql: 'SELECT 1' });

    if (checkError) {
      console.log('exec_sql function not found. Please run initial-setup.sql in Supabase SQL editor first.');
      console.log('The file is located at: src/lib/migrations/initial-setup.sql');
      process.exit(1);
    }

    // Read and execute the setup script
    const setupScript = fs.readFileSync(
      path.join(__dirname, '../lib/migrations/setup-migration.sql'),
      'utf8'
    );

    // Execute the setup script using exec_sql
    const { error: setupError } = await supabase
      .rpc('exec_sql', { sql: setupScript });

    if (setupError) {
      console.error('Error executing setup script:', setupError);
      process.exit(1);
    }

    // Validate the schema
    const { data: validationResult, error: validationError } = await supabase
      .rpc('validate_schema');

    if (validationError) {
      console.error('Schema validation failed:', validationError);
      process.exit(1);
    }

    console.log('Migration functions setup completed successfully');
    console.log('Validation result:', validationResult);

  } catch (error) {
    console.error('Unexpected error during setup:', error);
    process.exit(1);
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  setupMigration().catch(console.error);
}

export { setupMigration };
