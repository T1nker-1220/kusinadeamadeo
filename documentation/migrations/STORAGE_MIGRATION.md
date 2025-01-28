# Storage Migration Documentation

## Overview

This document details the process of migrating product and variant images from local storage to Supabase Storage. The migration ensures proper organization, accessibility, and management of product images in the cloud.

## Storage Structure

### Bucket Organization

```
supabase-storage/
├── products/
│   ├── {productId}/
│   │   ├── main.png
│   │   └── variants/
│   │       ├── {variantId1}.png
│   │       ├── {variantId2}.png
│   │       └── ...
│   └── ...
└── categories/
    ├── {categoryId1}.png
    ├── {categoryId2}.png
    └── ...
```

### Storage Policies

```sql
-- Public read access for products and categories
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'products' OR bucket_id = 'categories');

-- Admin insert access
CREATE POLICY "Admin Insert"
ON storage.objects FOR INSERT
WITH CHECK (auth.role() = 'admin');
```

## Migration Process

### 1. Image Upload Function

```typescript
async function uploadFile(
  filePath: string,
  bucket: string,
  targetPath: string
): Promise<ImageUploadResult> {
  try {
    const fileBuffer = await fs.readFile(filePath);
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(targetPath, fileBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(targetPath);

    return {
      success: true,
      path: publicUrl.publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
```

### 2. Database Update Function

```typescript
async function updateVariantImageUrls(
  variantId: string,
  imageUrl: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('product_variants')
      .update({ image_url: imageUrl })
      .eq('id', variantId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Failed to update variant ${variantId}:`, error);
    return false;
  }
}
```

## Migration Steps

1. **Preparation**
   ```typescript
   // Verify environment
   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

   // Initialize client
   const supabase = createClient(supabaseUrl, supabaseKey);
   ```

2. **Image Migration**
   ```typescript
   // For each variant
   for (const variant of variants) {
     const localImagePath = path.join(
       process.cwd(),
       'public',
       'images',
       'variants',
       `${variant.name.toLowerCase()}.png`
     );

     // Upload to Supabase
     const targetPath = `variants/${variant.id}.png`;
     const uploadResult = await uploadFile(
       localImagePath,
       'products',
       targetPath
     );

     // Update database
     if (uploadResult.success) {
       await updateVariantImageUrls(variant.id, uploadResult.path);
     }
   }
   ```

3. **Validation**
   ```typescript
   // Check for missing images
   const { data: variants } = await supabase
     .from('product_variants')
     .select('*')
     .is('image_url', null);

   // Log results
   if (variants.length > 0) {
     console.warn('Found variants with missing images:', variants);
   }
   ```

## Error Handling

### 1. Upload Failures
```typescript
try {
  // Upload attempt
  const result = await uploadFile(path, bucket, target);
  if (!result.success) {
    // Log failure
    console.error(`Failed to upload ${path}:`, result.error);
    // Add to retry queue
    retryQueue.push({ path, bucket, target });
  }
} catch (error) {
  // Handle unexpected errors
  console.error(`Unexpected error uploading ${path}:`, error);
}
```

### 2. Database Update Failures
```typescript
try {
  // Update attempt
  const updated = await updateVariantImageUrls(id, url);
  if (!updated) {
    // Log failure
    console.error(`Failed to update variant ${id}`);
    // Add to retry queue
    dbRetryQueue.push({ id, url });
  }
} catch (error) {
  // Handle unexpected errors
  console.error(`Unexpected error updating variant ${id}:`, error);
}
```

## Rollback Process

### 1. Storage Rollback
```typescript
async function rollbackStorageMigration() {
  // Delete uploaded files
  const { data: files } = await supabase.storage
    .from('products')
    .list('variants');

  for (const file of files) {
    await supabase.storage
      .from('products')
      .remove([`variants/${file.name}`]);
  }
}
```

### 2. Database Rollback
```typescript
async function rollbackDatabaseUpdates() {
  // Reset image URLs
  const { error } = await supabase
    .from('product_variants')
    .update({ image_url: null });

  if (error) {
    console.error('Failed to rollback database updates:', error);
  }
}
```

## Monitoring

### 1. Progress Tracking
```typescript
interface MigrationProgress {
  total: number;
  completed: number;
  failed: number;
  retrying: number;
}

// Update progress
function updateProgress(progress: MigrationProgress) {
  console.log('Migration progress:', {
    percentage: (progress.completed / progress.total) * 100,
    ...progress
  });
}
```

### 2. Validation Checks
```typescript
async function validateMigration() {
  // Check for missing images
  const missingImages = await checkMissingImages();

  // Verify image accessibility
  const inaccessibleImages = await checkImageAccessibility();

  // Report results
  return {
    success: missingImages.length === 0 && inaccessibleImages.length === 0,
    missingImages,
    inaccessibleImages
  };
}
```

## Post-Migration Tasks

1. Verify all images are accessible
2. Clean up local image storage
3. Update application configuration
4. Test image loading in all contexts
5. Monitor storage usage and costs
6. Document new image URLs format

## Support

For migration issues:
1. Check migration logs
2. Verify storage permissions
3. Test image accessibility
4. Review database records
5. Contact support team
