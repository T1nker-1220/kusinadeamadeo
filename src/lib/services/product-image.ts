import { createClient } from '@supabase/supabase-js';
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
   * Uploads an image to storage with proper validation and error handling
   */
  private static async uploadImage({ file, type, oldImagePath }: UploadImageOptions): Promise<UploadResult> {
    try {
      // Validate file
      const validation = StorageConfig.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Generate unique path
      const path = StorageConfig.generatePath(type, file.name);

      // Upload new image
      const { data, error } = await this.supabase.storage
        .from(StorageConfig.BUCKET_NAME)
        .upload(path, file, {
          cacheControl: StorageConfig.CACHE_CONTROL,
          upsert: false
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

      return { url, path };
    } catch (error) {
      throw StorageConfig.handleStorageError(error);
    }
  }

  /**
   * Deletes an image from storage
   */
  public static async deleteImage(path: string): Promise<void> {
    try {
      const { error } = await this.supabase.storage
        .from(StorageConfig.BUCKET_NAME)
        .remove([path]);

      if (error) {
        throw error;
      }
    } catch (error) {
      throw StorageConfig.handleStorageError(error);
    }
  }

  /**
   * Uploads a product image
   */
  public static async uploadProductImage(file: File, oldImagePath?: string): Promise<UploadResult> {
    return this.uploadImage({
      file,
      type: 'products',
      oldImagePath
    });
  }

  /**
   * Uploads a variant image
   */
  public static async uploadVariantImage(file: File, oldImagePath?: string): Promise<UploadResult> {
    return this.uploadImage({
      file,
      type: 'variants',
      oldImagePath
    });
  }

  /**
   * Uploads a category image
   */
  public static async uploadCategoryImage(file: File, oldImagePath?: string): Promise<UploadResult> {
    return this.uploadImage({
      file,
      type: 'categories',
      oldImagePath
    });
  }

  static getImagePath(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathMatch = urlObj.pathname.match(/\/images\/(.+)$/);
      return pathMatch ? pathMatch[1] : null;
    } catch {
      return null;
    }
  }
}
