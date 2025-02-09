import { createClient } from '@supabase/supabase-js';
import { useStorageStore } from '../stores/storage-store';
import { StorageConfig } from './storage-config';

interface UploadImageOptions {
  file: File;
  type: 'products' | 'variants' | 'categories';
  oldImagePath?: string;
}

interface UploadResult {
  url: string;
  path: string;
}

/**
 * @quantum_doc Product Image Service
 * @feature_context Handles product, variant, and category image operations
 * @dependencies StorageConfig
 * @security Implements secure image handling
 */
export class ProductImageService {
  private static supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  private static store = useStorageStore;

  private static generateUniqueFileName(originalName: string): string {
    const fileExt = originalName.split('.').pop();
    const uniqueId = Math.random().toString(36).substring(2);
    return `${uniqueId}.${fileExt}`;
  }

  public static getVariantImagePath(productId: string, fileName: string): string {
    const uniqueFileName = this.generateUniqueFileName(fileName);
    return `variants/${productId}/${uniqueFileName}`;
  }

  public static getProductImagePath(fileName: string): string {
    const uniqueFileName = this.generateUniqueFileName(fileName);
    return `products/${uniqueFileName}`;
  }

  public static getCategoryImagePath(fileName: string): string {
    const uniqueFileName = this.generateUniqueFileName(fileName);
    return `categories/${uniqueFileName}`;
  }

  /**
   * Uploads an image to storage with proper validation, error handling, and real-time updates
   */
  private static async uploadImage({ file, type, oldImagePath }: UploadImageOptions): Promise<UploadResult> {
    const store = this.store.getState();
    store.setUploading(true);
    store.setError(null);

    try {
      // Validate file
      const validation = StorageConfig.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Generate unique path
      const path = StorageConfig.generatePath(type, file.name);

      // Upload new image with retry logic
      const { data, error } = await StorageConfig.retryOperation(async () => {
        return await this.supabase.storage
          .from(StorageConfig.BUCKET_NAME)
          .upload(path, file, {
            cacheControl: StorageConfig.CACHE_CONTROL,
            upsert: false
          });
      });

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Failed to upload image');
      }

      // Get public URL
      const url = StorageConfig.getPublicUrl(path);

      // Delete old image if it exists
      if (oldImagePath) {
        const oldPath = StorageConfig.extractPathFromUrl(oldImagePath);
        if (oldPath && !oldPath.includes('placeholder')) {
          await this.deleteImage(oldPath).catch(console.error);
        }
      }

      // Update store with successful upload
      store.addRecentUpload(path, url);

      return { url, path };
    } catch (error) {
      throw StorageConfig.handleStorageError(error);
    } finally {
      store.setUploading(false);
    }
  }

  /**
   * Deletes an image from storage with real-time updates
   */
  public static async deleteImage(path: string): Promise<void> {
    const store = this.store.getState();
    store.setDeleting(true);
    store.setError(null);

    try {
      // Validate path before deletion
      if (!StorageConfig.validatePath(path)) {
        throw new Error('Invalid storage path');
      }

      // Delete image with retry logic
      const { error } = await StorageConfig.retryOperation(async () => {
        return await this.supabase.storage
          .from(StorageConfig.BUCKET_NAME)
          .remove([path]);
      });

      if (error) {
        throw error;
      }

      // Update store with successful deletion
      store.addRecentDelete(path);
    } catch (error) {
      throw StorageConfig.handleStorageError(error);
    } finally {
      store.setDeleting(false);
    }
  }

  /**
   * Uploads a product image with real-time updates
   */
  public static async uploadProductImage(file: File, oldImagePath?: string): Promise<UploadResult> {
    return this.uploadImage({
      file,
      type: 'products',
      oldImagePath
    });
  }

  /**
   * Uploads a variant image with real-time updates
   */
  public static async uploadVariantImage(file: File, oldImagePath?: string): Promise<UploadResult> {
    return this.uploadImage({
      file,
      type: 'variants',
      oldImagePath
    });
  }

  /**
   * Uploads a category image with real-time updates
   */
  public static async uploadCategoryImage(file: File, oldImagePath?: string): Promise<UploadResult> {
    return this.uploadImage({
      file,
      type: 'categories',
      oldImagePath
    });
  }

  /**
   * Gets image path from URL with validation
   */
  static getImagePath(url: string): string | null {
    return StorageConfig.extractPathFromUrl(url);
  }
}
