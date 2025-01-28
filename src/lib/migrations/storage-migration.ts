import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';

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

interface ImageUploadResult {
  success: boolean;
  path?: string;
  error?: string;
}

/**
 * Uploads a file to Supabase Storage
 */
async function uploadFile(
  filePath: string,
  bucket: string,
  targetPath: string
): Promise<ImageUploadResult> {
  try {
    const fileBuffer = await fs.readFile(filePath);
    const fileName = path.basename(filePath);
    const contentType = 'image/png'; // Assuming all images are PNG

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(targetPath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(targetPath);

    return {
      success: true,
      path: publicUrl.publicUrl,
    };
  } catch (error) {
    console.error(`Failed to upload ${filePath}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Updates product variant image URLs in the database
 */
async function updateVariantImageUrls(
  variantId: string,
  imageUrl: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('product_variants')
      .update({ image_url: imageUrl })
      .eq('id', variantId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`Failed to update variant ${variantId}:`, error);
    return false;
  }
}

/**
 * Migrates all variant images to Supabase storage
 */
export async function migrateVariantImages() {
  console.log('Starting variant image migration...');

  // Get all variants
  const { data: variants, error } = await supabase
    .from('product_variants')
    .select('*');

  if (error) {
    console.error('Failed to fetch variants:', error);
    return;
  }

  // Process each variant
  for (const variant of variants) {
    const localImagePath = path.join(
      process.cwd(),
      'public',
      'images',
      'variants',
      `${variant.name.toLowerCase()}.png`
    );

    // Check if local image exists
    try {
      await fs.access(localImagePath);
    } catch {
      console.log(`Image not found for variant ${variant.name}, skipping...`);
      continue;
    }

    // Upload to Supabase storage
    const targetPath = `variants/${variant.id}.png`;
    const uploadResult = await uploadFile(localImagePath, 'products', targetPath);

    if (uploadResult.success && uploadResult.path) {
      // Update database with new URL
      const updated = await updateVariantImageUrls(variant.id, uploadResult.path);
      if (updated) {
        console.log(`Successfully migrated variant ${variant.name}`);
      }
    }
  }

  console.log('Variant image migration completed');
}

/**
 * Validates the migration
 */
export async function validateMigration() {
  const { data: variants, error } = await supabase
    .from('product_variants')
    .select('*')
    .is('image_url', null);

  if (error) {
    console.error('Validation failed:', error);
    return;
  }

  if (variants.length > 0) {
    console.warn('Found variants with missing images:', variants);
  } else {
    console.log('All variants have image URLs');
  }
}

// Execute migration if run directly
if (require.main === module) {
  migrateVariantImages()
    .then(validateMigration)
    .catch(console.error);
}
