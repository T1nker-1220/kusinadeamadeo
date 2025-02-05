import { createClient } from '@supabase/supabase-js';

interface UploadImageOptions {
  file: File;
  type: 'product' | 'variant' | 'category';
  oldImagePath?: string;
}

interface UploadResult {
  url: string;
  path: string;
}

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

  public static async deleteImage(path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from('images')
      .remove([path]);

    if (error) {
      throw error;
    }
  }

  public static getPublicUrl(path: string): string {
    const { data: { publicUrl } } = this.supabase.storage
      .from('images')
      .getPublicUrl(path);

    return publicUrl;
  }

  private static async uploadImage({ file, type, oldImagePath }: UploadImageOptions): Promise<UploadResult> {
    if (!file.type.startsWith('image/')) {
      throw new Error('Invalid file type. Only images are allowed.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    // Upload new image
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload image');
    }

    const result = await response.json();

    // If there's an old image and it's not a placeholder, delete it
    if (oldImagePath && !oldImagePath.includes('placeholder')) {
      await ProductImageService.deleteImage(oldImagePath).catch(console.error);
    }

    return result;
  }

  static async uploadProductImage(file: File, oldImagePath?: string): Promise<UploadResult> {
    return ProductImageService.uploadImage({
      file,
      type: 'product',
      oldImagePath
    });
  }

  static async uploadVariantImage(file: File, oldImagePath?: string): Promise<UploadResult> {
    return ProductImageService.uploadImage({
      file,
      type: 'variant',
      oldImagePath
    });
  }

  static async uploadCategoryImage(file: File, oldImagePath?: string): Promise<UploadResult> {
    return ProductImageService.uploadImage({
      file,
      type: 'category',
      oldImagePath
    });
  }

  static async deleteProductImage(path: string): Promise<void> {
    return ProductImageService.deleteImage(path);
  }

  static async deleteVariantImage(path: string): Promise<void> {
    return ProductImageService.deleteImage(path);
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
