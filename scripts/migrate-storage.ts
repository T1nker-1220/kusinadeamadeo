import { StorageMigrationService } from '@/lib/services/storage-migration';

async function main() {
  try {
    console.log('Starting storage migration...');
    await StorageMigrationService.migrateAllImages();
    console.log('Storage migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during storage migration:', error);
    process.exit(1);
  }
}

main();
