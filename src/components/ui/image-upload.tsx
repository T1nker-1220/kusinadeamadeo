import { cn } from '@/lib/utils';
import { Loader2, UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Button } from './button';

interface ImageUploadProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  onRemove?: () => Promise<void>;
  onUpload?: (file: File) => Promise<{ url: string; path: string }>;
  disabled?: boolean;
  maxSize?: number; // in bytes
  aspectRatio?: 'square' | 'video' | 'banner';
  width?: number;
  height?: number;
}

export function ImageUpload({
  className,
  value,
  onChange,
  onRemove,
  onUpload,
  disabled = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  aspectRatio = 'square',
  width = 800,
  height = 800
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (disabled || isRemoving || isUploading || !onRemove) return;

    setError(null);
    setIsRemoving(true);

    try {
      await onRemove();
      onChange?.('');
      toast.success('Image removed successfully');
    } catch (error) {
      console.error('Error removing image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove image';
      setError(errorMessage);
      toast.error(errorMessage);
      // Reset the form state if removal fails
      onChange?.(value || '');
    } finally {
      setIsRemoving(false);
    }
  };

  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    banner: 'aspect-[21/9]'
  }[aspectRatio];

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const firstError = rejectedFiles[0].errors[0];
      if (firstError.code === 'file-too-large') {
        setError(`File is too large. Max size is ${maxSize / (1024 * 1024)}MB`);
      } else if (firstError.code === 'file-invalid-type') {
        setError('Only image files are allowed');
      } else {
        setError(firstError.message);
      }
      toast.error(firstError.message);
      return;
    }

    setError(null);
    const file = acceptedFiles[0];

    if (onUpload) {
      try {
        setIsUploading(true);
        await onUpload(file);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
        setError(errorMessage);
        toast.error(errorMessage);
        // Reset the form state if upload fails
        onChange?.(value || '');
      } finally {
        setIsUploading(false);
      }
    } else if (onChange) {
      // Fallback to base64 if no upload handler
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.onerror = () => {
        setError('Failed to read file');
        toast.error('Failed to read file');
      };
      reader.readAsDataURL(file);
    }
  }, [maxSize, onChange, onUpload, value]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxSize,
    maxFiles: 1,
    disabled: disabled || isUploading || isRemoving,
    multiple: false
  });

  return (
    <div className={cn('space-y-4 w-full', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-4 transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted',
          (disabled || isUploading || isRemoving) && 'opacity-50 cursor-not-allowed',
          'hover:border-primary/50'
        )}
      >
        <input {...getInputProps()} />

        {value ? (
          <div className={cn('relative w-full overflow-hidden rounded-lg', aspectRatioClass)}>
            <Image
              src={value}
              alt="Upload preview"
              className="object-cover"
              fill
              sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, ${width}px`}
              priority
            />
            {!disabled && onRemove && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-10"
                onClick={handleRemove}
                disabled={isRemoving || isUploading}
                aria-label="Remove image"
              >
                {isRemoving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-sm">
            {isUploading || isRemoving ? (
              <>
                <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-2" />
                <p className="text-muted-foreground">
                  {isUploading ? 'Uploading...' : 'Removing...'}
                </p>
              </>
            ) : (
              <>
                <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                <div className="text-muted-foreground">
                  {isDragActive ? (
                    <p>Drop the image here</p>
                  ) : (
                    <p>Drag & drop an image here, or click to select</p>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  PNG, JPG or WebP (max. {maxSize / (1024 * 1024)}MB)
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {error && (
        <div className="text-sm text-destructive" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
