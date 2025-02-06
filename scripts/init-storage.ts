import { createClient } from '@supabase/supabase-js';
import { StorageConfig } from '../src/lib/services/storage-config';

/**
 * @quantum_doc Storage Initialization Script
 * @feature_context Sets up storage bucket and initial configuration
 * @security Implements secure bucket setup
 */
async function initializeStorage() {
  try {
    console.log('Initializing storage configuration...');

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for admin operations
    );

    // Create the images bucket if it doesn't exist
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets();

    if (listError) {
      throw listError;
    }

    const imagesBucket = buckets?.find(b => b.name === StorageConfig.BUCKET_NAME);

    if (!imagesBucket) {
      console.log('Creating images bucket...');
      const { error: createError } = await supabase
        .storage
        .createBucket(StorageConfig.BUCKET_NAME, {
          public: true,
          fileSizeLimit: StorageConfig.MAX_FILE_SIZE,
          allowedMimeTypes: StorageConfig.ALLOWED_FILE_TYPES
        });

      if (createError) {
        throw createError;
      }
    }

    // Create required folders
    console.log('Creating storage folders...');
    const folders = ['products', 'variants', 'categories'];

    for (const folder of folders) {
      const { error: folderError } = await supabase
        .storage
        .from(StorageConfig.BUCKET_NAME)
        .upload(`${folder}/.keep`, new Uint8Array(0));

      if (folderError && !folderError.message.includes('The resource already exists')) {
        throw folderError;
      }
    }

    console.log('Storage initialization completed successfully');
  } catch (error) {
    console.error('Error initializing storage:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeStorage();
