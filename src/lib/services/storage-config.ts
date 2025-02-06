import { createClient } from '@supabase/supabase-js';

/**
 * @quantum_doc Storage Configuration Service
 * @feature_context Centralized storage configuration and utilities
 * @security Implements secure storage access patterns
 * @performance Optimized for efficient storage operations
 */
export class StorageConfig {
  private static supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Storage bucket configuration
  public static readonly BUCKET_NAME = 'images';
  public static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  public static readonly ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  public static readonly CACHE_CONTROL = '3600';

  // Path configuration
  private static readonly PATHS = {
    products: 'products',
    variants: 'variants',
    categories: 'categories'
  } as const;

  /**
   * Validates file type and size
   */
  public static validateFile(file: File): { isValid: boolean; error?: string } {
    if (!this.ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file type. Allowed types: ${this.ALLOWED_FILE_TYPES.join(', ')}`
      };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size must be less than ${this.MAX_FILE_SIZE / 1024 / 1024}MB`
      };
    }

    return { isValid: true };
  }

  /**
   * Generates a standardized storage path
   */
  public static generatePath(type: keyof typeof this.PATHS, fileName: string): string {
    const timestamp = Date.now();
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '');
    const ext = cleanFileName.split('.').pop();
    const uniqueId = Math.random().toString(36).substring(2, 15);

    return `${this.PATHS[type]}/${timestamp}-${uniqueId}.${ext}`;
  }

  /**
   * Extracts path from storage URL
   */
  public static extractPathFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/images\/(.+)$/);
      return pathMatch ? pathMatch[1] : null;
    } catch {
      return null;
    }
  }

  /**
   * Gets public URL for a path
   */
  public static getPublicUrl(path: string): string {
    const { data: { publicUrl } } = this.supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(path);
    return publicUrl;
  }

  /**
   * Handles storage errors with standardized format
   */
  public static handleStorageError(error: unknown): Error {
    console.error('Storage operation error:', error);

    if (error instanceof Error) {
      return error;
    }

    return new Error('An unexpected storage error occurred');
  }
}
