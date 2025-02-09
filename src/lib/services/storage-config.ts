import { createClient } from '@supabase/supabase-js';
import { useStorageStore } from '../stores/storage-store';

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
  public static readonly MAX_RETRIES = 3;
  public static readonly RETRY_DELAY = 1000; // 1 second

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
   * Generates a standardized storage path with proper validation
   */
  public static generatePath(type: keyof typeof this.PATHS, fileName: string): string {
    if (!this.PATHS[type]) {
      throw new Error(`Invalid path type: ${type}`);
    }

    const timestamp = Date.now();
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '');
    const ext = cleanFileName.split('.').pop()?.toLowerCase() || 'jpg';
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const path = `${this.PATHS[type]}/${timestamp}-${uniqueId}.${ext}`;

    // Validate final path
    if (!this.validatePath(path)) {
      throw new Error('Generated path contains invalid characters');
    }

    return path;
  }

  /**
   * Extracts path from storage URL with validation
   */
  public static extractPathFromUrl(url: string): string | null {
    if (!url) return null;

    try {
      const urlObj = new URL(url);
      const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/images\/(.+)$/);
      const path = pathMatch ? pathMatch[1] : null;

      // Validate extracted path
      if (!path || !this.validatePath(path)) {
        console.error('Invalid path extracted from URL:', path);
        return null;
      }

      return path;
    } catch (error) {
      console.error('Error extracting path from URL:', error);
      return null;
    }
  }

  /**
   * Gets public URL for a path with validation
   */
  public static getPublicUrl(path: string): string {
    if (!this.validatePath(path)) {
      throw new Error('Invalid storage path');
    }

    const { data: { publicUrl } } = this.supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(path);

    return publicUrl;
  }

  /**
   * Handles storage errors with standardized format and store updates
   */
  public static handleStorageError(error: unknown): Error {
    console.error('Storage operation error:', error);

    let errorMessage = 'An unexpected storage error occurred';

    if (error instanceof Error) {
      // Handle specific Supabase storage errors
      if (error.message.includes('storage/object-not-found')) {
        errorMessage = 'The requested file was not found';
      } else if (error.message.includes('storage/unauthorized')) {
        errorMessage = 'Unauthorized to perform this operation';
      } else if (error.message.includes('storage/quota-exceeded')) {
        errorMessage = 'Storage quota exceeded';
      } else {
        errorMessage = error.message;
      }
    }

    // Update store with error
    const store = useStorageStore.getState();
    store.setError(errorMessage);
    store.setUploading(false);
    store.setDeleting(false);

    return new Error(errorMessage);
  }

  /**
   * Validates a storage path
   */
  public static validatePath(path: string): boolean {
    if (!path) return false;

    // Check for valid characters
    if (!/^[a-zA-Z0-9/-_.]+$/.test(path)) return false;

    // Check for valid folder structure
    const folder = path.split('/')[0];
    if (!Object.values(this.PATHS).includes(folder as any)) return false;

    // Check for path traversal attempts
    if (path.includes('..')) return false;

    // Check for double slashes
    if (path.includes('//')) return false;

    return true;
  }

  /**
   * Retry a storage operation with exponential backoff
   */
  public static async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = this.MAX_RETRIES
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt === maxRetries) break;

        // Wait with exponential backoff
        await new Promise(resolve =>
          setTimeout(resolve, this.RETRY_DELAY * Math.pow(2, attempt - 1))
        );
      }
    }

    throw lastError || new Error('Operation failed after retries');
  }
}
