import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import { executeMigration, validateSchemaChanges } from '../lib/migrations/execute-migration';

// Load environment variables
dotenv.config();

async function setupLogging() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logDir = path.join(process.cwd(), 'logs');
  const logFile = path.join(logDir, `migration-${timestamp}.log`);

  await fs.mkdir(logDir, { recursive: true });

  // Create write stream for logging
  const logStream = await fs.open(logFile, 'w');

  // Capture console output
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn
  };

  // Override console methods to write to file
  console.log = (...args) => {
    const message = `[LOG] ${args.join(' ')}\n`;
    logStream.write(message);
    originalConsole.log(...args);
  };

  console.error = (...args) => {
    const message = `[ERROR] ${args.join(' ')}\n`;
    logStream.write(message);
    originalConsole.error(...args);
  };

  console.warn = (...args) => {
    const message = `[WARN] ${args.join(' ')}\n`;
    logStream.write(message);
    originalConsole.warn(...args);
  };

  return {
    logFile,
    cleanup: async () => {
      await logStream.close();
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
    }
  };
}

async function runMigration(isDryRun = false) {
  const { logFile, cleanup } = await setupLogging();

  console.log(`Starting product system migration... (${isDryRun ? 'DRY RUN' : 'LIVE RUN'})`);
  console.log('Timestamp:', new Date().toISOString());
  console.log('Log file:', logFile);

  try {
    // Verify environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];

    const missingEnvVars = requiredEnvVars.filter(
      varName => !process.env[varName]
    );

    if (missingEnvVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingEnvVars.join(', ')}`
      );
    }

    if (isDryRun) {
      console.log('\nDRY RUN: No changes will be made to the database');
      console.log('Validating environment and configuration...');
      const validationResult = await validateSchemaChanges();

      if (validationResult.success) {
        console.log('Configuration validation successful');
      } else {
        console.warn('Configuration validation shows concerns:', validationResult.error);
      }
    } else {
      // Execute migration
      await executeMigration();

      // Final validation
      console.log('\nPerforming final validation...');
      const validationResult = await validateSchemaChanges();

      if (!validationResult.success) {
        console.warn(
          'Migration completed but validation shows some concerns. Please check the logs.'
        );
      } else {
        console.log('Migration completed successfully!');
      }
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await cleanup();
  }
}

// Run migration if executed directly
if (require.main === module) {
  const isDryRun = process.argv.includes('--dry-run');
  runMigration(isDryRun).catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { runMigration };
