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
        setError('Failed to upload image');
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: disabled || isUploading,
  });

  return (
    <div className={cn('space-y-4 w-full', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors',
          isDragActive && 'border-primary bg-primary/5',
          disabled && 'opacity-50 cursor-not-allowed',
          isUploading && 'opacity-50 cursor-wait'
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
              </>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {value && !disabled && !isUploading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onChange('')}
        >
          <Trash className="h-4 w-4 mr-2" />
          Remove Image
        </Button>
      )}
    </div>
  );
}
