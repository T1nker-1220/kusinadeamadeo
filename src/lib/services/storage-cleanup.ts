import { prisma } from '@/lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { useStorageStore } from '../stores/storage-store';
import { StorageConfig } from './storage-config';

export class StorageCleanupService {
  private static store = useStorageStore;

  /**
   * Checks if an image is orphaned (not referenced in the database)
   */
  static async isImageOrphaned(imagePath: string): Promise<boolean> {
    try {
      // Validate path
      if (!StorageConfig.validatePath(imagePath)) {
        throw new Error('Invalid image path');
      }

      // Check products
      const productWithImage = await prisma.product.findFirst({
        where: {
          imageUrl: {
            contains: imagePath
          }
        }
      });

      if (productWithImage) return false;

      // Check variants
      const variantWithImage = await prisma.productVariant.findFirst({
        where: {
          imageUrl: {
            contains: imagePath
          }
        }
      });

      if (variantWithImage) return false;

      // Check categories
      const categoryWithImage = await prisma.category.findFirst({
        where: {
          imageUrl: {
            contains: imagePath
          }
        }
      });

      if (categoryWithImage) return false;

      return true;
    } catch (error) {
      console.error('Error checking orphaned image:', error);
      throw error;
    }
  }

  /**
   * Deletes an image from storage if it's orphaned
   */
  static async deleteIfOrphaned(imagePath: string): Promise<boolean> {
    const store = this.store.getState();
    store.setDeleting(true);
    store.setError(null);

    try {
      const isOrphaned = await StorageCleanupService.isImageOrphaned(imagePath);

      if (isOrphaned) {
        const supabase = createRouteHandlerClient({ cookies });
        const { error } = await supabase.storage
          .from('images')
          .remove([imagePath]);

        if (error) {
          console.error('Error deleting orphaned image:', error);
          store.setError('Failed to delete orphaned image');
          return false;
        }

        console.log('Successfully deleted orphaned image:', imagePath);
        store.addRecentDelete(imagePath);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking/deleting orphaned image:', error);
      store.setError(error instanceof Error ? error.message : 'Failed to check/delete orphaned image');
      return false;
    } finally {
      store.setDeleting(false);
    }
  }

  /**
   * Scans storage for orphaned images and deletes them
   */
  static async cleanupOrphanedImages(): Promise<void> {
    const store = this.store.getState();
    store.setError(null);

    try {
      const supabase = createRouteHandlerClient({ cookies });

      // List all images in storage
      const { data: files, error: listError } = await supabase.storage
        .from('images')
        .list();

      if (listError) {
        console.error('Error listing storage files:', listError);
        store.setError('Failed to list storage files');
        return;
      }

      // Process each file
      for (const file of files) {
        await StorageCleanupService.deleteIfOrphaned(file.name);
      }

      console.log('Storage cleanup completed');
    } catch (error) {
      console.error('Error during storage cleanup:', error);
      store.setError(error instanceof Error ? error.message : 'Failed to cleanup storage');
    }
  }
}
