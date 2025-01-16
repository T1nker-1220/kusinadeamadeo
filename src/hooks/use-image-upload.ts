import { ProductImageService } from '@/lib/services/product-image';
import { useState } from 'react';

interface UploadResult {
  url: string;
  path: string;
}

interface UseImageUploadOptions {
  type: 'product' | 'variant' | 'category';
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: Error) => void;
  maxSize?: number; // in bytes, default 5MB
}

interface UseImageUploadResult {
  uploadImage: (file: File, oldImagePath?: string) => Promise<void>;
  isUploading: boolean;
  error: Error | null;
}

export function useImageUpload({
  type,
  onSuccess,
  onError,
  maxSize = 5 * 1024 * 1024 // 5MB default
}: UseImageUploadOptions): UseImageUploadResult {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const validateFile = (file: File): void => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Invalid file type. Only images are allowed.');
    }

    if (file.size > maxSize) {
      throw new Error(`File is too large. Max size is ${maxSize / (1024 * 1024)}MB`);
    }
  };

  const uploadImage = async (file: File, oldImagePath?: string) => {
    try {
      setIsUploading(true);
      setError(null);

      // Validate file before upload
      validateFile(file);

      let uploadFn;
      switch (type) {
        case 'product':
          uploadFn = ProductImageService.uploadProductImage;
          break;
        case 'variant':
          uploadFn = ProductImageService.uploadVariantImage;
          break;
        case 'category':
          uploadFn = ProductImageService.uploadCategoryImage;
          break;
        default:
          throw new Error('Invalid image type');
      }

      const result = await uploadFn(file, oldImagePath);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to upload image');
      setError(error);
      onError?.(error);
      throw error; // Re-throw to handle in component
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
    error
  };
}
