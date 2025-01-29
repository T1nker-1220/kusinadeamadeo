
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

  private static async deleteImage(path: string): Promise<void> {
    const response = await fetch(`/api/upload?path=${encodeURIComponent(path)}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete image');
    }
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
