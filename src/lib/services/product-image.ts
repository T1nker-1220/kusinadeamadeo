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
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Invalid file type. Only images are allowed.');
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image must be less than 5MB');
      }

      // Generate unique path for variant image
      const fileExt = file.name.split('.').pop();
      const uniqueId = Math.random().toString(36).substring(2);
      const path = `variants/${uniqueId}.${fileExt}`;

      // Upload new image
      const { data, error } = await this.supabase.storage
        .from('images')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Failed to upload image');
      }

      // Get public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from('images')
        .getPublicUrl(data.path);

      // Delete old image if it exists and is not a placeholder
      if (oldImagePath) {
        const oldPath = this.getImagePath(oldImagePath);
        if (oldPath && !oldPath.includes('placeholder')) {
          await this.deleteImage(oldPath).catch(console.error);
        }
      }

      return {
        url: publicUrl,
        path: data.path,
      };
    } catch (error) {
      console.error('Error uploading variant image:', error);
      throw error;
    }
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
