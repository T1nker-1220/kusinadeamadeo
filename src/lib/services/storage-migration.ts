import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

export class StorageMigrationService {
  private static supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  private static getStorageUrl(path: string): string {
    const { data: { publicUrl } } = this.supabase.storage
      .from('images')
      .getPublicUrl(path);
    return publicUrl;
  }

  private static extractPathFromLocalUrl(localUrl: string): string {
    // Remove leading slash and 'images/' prefix
    return localUrl.replace(/^\/images\//, '');
  }

  public static async migrateProductImages(): Promise<void> {
    const products = await prisma.product.findMany({
      where: {
        imageUrl: {
          startsWith: '/images/'
        }
      }
    });

    for (const product of products) {
      const storagePath = this.extractPathFromLocalUrl(product.imageUrl);
      const newUrl = this.getStorageUrl(storagePath);

      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl: newUrl }
      });

      console.log(`Migrated product image: ${product.id}`);
    }
  }

  public static async migrateVariantImages(): Promise<void> {
    const variants = await prisma.productVariant.findMany({
      where: {
        imageUrl: {
          startsWith: '/images/'
        }
      }
    });

    for (const variant of variants) {
      if (!variant.imageUrl) continue;

      const storagePath = this.extractPathFromLocalUrl(variant.imageUrl);
      const newUrl = this.getStorageUrl(storagePath);

      await prisma.productVariant.update({
        where: { id: variant.id },
        data: { imageUrl: newUrl }
      });

      console.log(`Migrated variant image: ${variant.id}`);
    }
  }

  public static async migrateCategoryImages(): Promise<void> {
    const categories = await prisma.category.findMany({
      where: {
        imageUrl: {
          startsWith: '/images/'
        }
      }
    });

    for (const category of categories) {
      const storagePath = this.extractPathFromLocalUrl(category.imageUrl);
      const newUrl = this.getStorageUrl(storagePath);

      await prisma.category.update({
        where: { id: category.id },
        data: { imageUrl: newUrl }
      });

      console.log(`Migrated category image: ${category.id}`);
    }
  }

  public static async migrateAllImages(): Promise<void> {
    console.log('Starting image migration...');

    try {
      await this.migrateProductImages();
      await this.migrateVariantImages();
      await this.migrateCategoryImages();

      console.log('Image migration completed successfully');
    } catch (error) {
      console.error('Error during image migration:', error);
      throw error;
    }
  }
}
