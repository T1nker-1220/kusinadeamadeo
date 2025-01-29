import { prisma } from '@/lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export class StorageCleanupService {
  /**
   * Checks if an image is orphaned (not referenced in the database)
   */
  static async isImageOrphaned(imagePath: string): Promise<boolean> {
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
  }

  /**
   * Deletes an image from storage if it's orphaned
   */
  static async deleteIfOrphaned(imagePath: string): Promise<boolean> {
    try {
      const isOrphaned = await StorageCleanupService.isImageOrphaned(imagePath);

      if (isOrphaned) {
        const supabase = createRouteHandlerClient({ cookies });
        const { error } = await supabase.storage
          .from('images')
          .remove([imagePath]);

        if (error) {
          console.error('Error deleting orphaned image:', error);
          return false;
        }

        console.log('Successfully deleted orphaned image:', imagePath);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking/deleting orphaned image:', error);
      return false;
    }
  }

  /**
   * Scans storage for orphaned images and deletes them
   */
  static async cleanupOrphanedImages(): Promise<void> {
    try {
      const supabase = createRouteHandlerClient({ cookies });

      // List all images in storage
      const { data: files, error: listError } = await supabase.storage
        .from('images')
        .list();

      if (listError) {
        console.error('Error listing storage files:', listError);
        return;
      }

      // Process each file
      for (const file of files) {
        await StorageCleanupService.deleteIfOrphaned(file.name);
      }

      console.log('Storage cleanup completed');
    } catch (error) {
      console.error('Error during storage cleanup:', error);
    }
  }
}
