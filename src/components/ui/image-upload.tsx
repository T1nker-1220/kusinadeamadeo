'use client';

import { StorageConfig } from '@/lib/services/storage-config';
import { useStorageStore } from '@/lib/stores/storage-store';
import { cn } from '@/lib/utils';
import { AlertCircle, ImageIcon, Trash, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './button';

interface ImageUploadProps {
  value?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<void>;
  className?: string;
}

export function ImageUpload({
  value,
  disabled,
  onChange,
  onUpload,
  className,
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const { isUploading, isDeleting, error: storeError } = useStorageStore();

  // Sync store error with local error state
  useEffect(() => {
    if (storeError) {
      setError(storeError);
      // Clear error after 5 seconds
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [storeError]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setError(null);
        const file = acceptedFiles[0];

        if (!file) {
          return;
        }

        // Validate file using StorageConfig
        const validation = StorageConfig.validateFile(file);
        if (!validation.isValid) {
          setError(validation.error || 'Invalid file');
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
      setError(null);
      onChange('');
    } catch (error) {
      console.error('Error removing image:', error);
      setError(error instanceof Error ? error.message : 'Failed to remove image');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    maxSize: StorageConfig.MAX_FILE_SIZE,
    disabled: disabled || isUploading || isDeleting,
  });

  return (
    <div className={cn('space-y-4 w-full', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors',
          isDragActive && 'border-primary bg-primary/5',
          (disabled || isUploading || isDeleting) && 'opacity-50 cursor-not-allowed',
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
              sizes="(max-width: 200px) 100vw, 200px"
              priority
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            {isUploading ? (
              <>
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm">Uploading...</p>
              </>
            ) : isDeleting ? (
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
                  PNG, JPG, JPEG, GIF, WEBP up to {StorageConfig.MAX_FILE_SIZE / 1024 / 1024}MB
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}

      {value && !disabled && !isUploading && !isDeleting && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleRemove}
          disabled={isDeleting}
        >
          <Trash className="h-4 w-4 mr-2" />
          {isDeleting ? 'Removing...' : 'Remove Image'}
        </Button>
      )}
    </div>
  );
}
