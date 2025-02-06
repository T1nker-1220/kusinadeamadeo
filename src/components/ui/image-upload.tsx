'use client';

import { cn } from '@/lib/utils';
import { ImageIcon, Trash, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './button';

interface ImageUploadProps {
  value?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
  className?: string;
}

export function ImageUpload({
  value,
  disabled,
  onChange,
  onUpload,
  isUploading,
  className,
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setError(null);
        const file = acceptedFiles[0];

        if (!file) {
          return;
        }

        if (!file.type.startsWith('image/')) {
          setError('Please upload an image file');
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          setError('Image must be less than 5MB');
          return;
        }

        await onUpload(file);
      } catch (error) {
        console.error('Error uploading image:', error);
        setError(error instanceof Error ? error.message : 'Failed to upload image');
      }
    },
    [onUpload]
  );

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      setError(null);
      onChange('');
    } catch (error) {
      console.error('Error removing image:', error);
      setError(error instanceof Error ? error.message : 'Failed to remove image');
    } finally {
      setIsRemoving(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: disabled || isUploading || isRemoving,
  });

  return (
    <div className={cn('space-y-4 w-full', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors',
          isDragActive && 'border-primary bg-primary/5',
          (disabled || isUploading || isRemoving) && 'opacity-50 cursor-not-allowed',
          error && 'border-destructive'
        )}
      >
        <input {...getInputProps()} />
        {value ? (
          <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-lg">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            {isUploading ? (
              <>
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm">Uploading...</p>
              </>
            ) : isRemoving ? (
              <>
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm">Removing...</p>
              </>
            ) : (
              <>
                {isDragActive ? (
                  <UploadCloud className="h-12 w-12" />
                ) : (
                  <ImageIcon className="h-12 w-12" />
                )}
                <p className="text-sm">
                  {isDragActive
                    ? 'Drop the image here'
                    : 'Drag & drop or click to upload'}
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, JPEG up to 5MB
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive flex items-center gap-2">
          <span className="i-lucide-alert-circle h-4 w-4" />
          {error}
        </p>
      )}

      {value && !disabled && !isUploading && !isRemoving && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleRemove}
          disabled={isRemoving}
        >
          <Trash className="h-4 w-4 mr-2" />
          {isRemoving ? 'Removing...' : 'Remove Image'}
        </Button>
      )}
    </div>
  );
}
