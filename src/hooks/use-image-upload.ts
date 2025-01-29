import { ProductImageService } from '@/lib/services/product-image';

interface UseImageUploadOptions {
  type: 'product' | 'variant' | 'category';
  onSuccess?: (result: { url: string; path: string }) => void;
  onError?: (error: Error) => void;
}

export function useImageUpload({ type, onSuccess, onError }: UseImageUploadOptions) {
  const uploadImage = async (file: File) => {
    try {
      let result;
      switch (type) {
        case 'product':
          result = await ProductImageService.uploadProductImage(file);
          break;
        case 'variant':
          result = await ProductImageService.uploadVariantImage(file);
          break;
        case 'category':
          result = await ProductImageService.uploadCategoryImage(file);
          break;
        default:
          throw new Error('Invalid image type');
      }

      onSuccess?.(result);
      return result;
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      onError?.(new Error(errorMessage));
      throw error;
    }
  };

  return { uploadImage };
}
