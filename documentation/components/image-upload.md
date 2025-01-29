# ImageUpload Component Documentation

## Overview

The `ImageUpload` component is a reusable component for handling image uploads with drag-and-drop support, preview, and error handling.

## Props Interface

```typescript
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
```

## Features

### 1. Image Upload
- Drag-and-drop support
- File type validation
- Size validation
- Loading states
- Error handling
- Success feedback

### 2. Image Preview
- Responsive image display
- Aspect ratio control
- Remove button
- Loading indicators

### 3. Error Handling
- File type validation
- Size validation
- Upload errors
- Removal errors
- Form state recovery

## Usage Example

```typescript
import { ImageUpload } from '@/components/ui/image-upload';
import { useImageUpload } from '@/hooks/use-image-upload';

function MyComponent() {
  const { uploadImage } = useImageUpload({
    type: 'variant',
    onSuccess: (result) => {
      console.log('Upload success:', result);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
    },
  });

  return (
    <ImageUpload
      value={imageUrl}
      onChange={setImageUrl}
      onRemove={handleImageRemove}
      onUpload={uploadImage}
      disabled={isSubmitting}
      maxSize={5 * 1024 * 1024} // 5MB
      aspectRatio="square"
    />
  );
}
```

## State Management

### Upload States
```typescript
const [isUploading, setIsUploading] = useState(false);
const [isRemoving, setIsRemoving] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### Error Handling
```typescript
try {
  await onRemove();
  onChange?.('');
  toast.success('Image removed successfully');
} catch (error) {
  const errorMessage = error instanceof Error
    ? error.message
    : 'Failed to remove image';
  setError(errorMessage);
  toast.error(errorMessage);
  onChange?.(value || '');
}
```

## Styling

The component uses Tailwind CSS for styling and supports:
- Custom class names
- Responsive design
- Dark mode
- Loading states
- Error states
- Hover effects

## Best Practices

1. Error Handling
   - Always provide error feedback
   - Implement form state recovery
   - Show loading states
   - Validate file types
   - Check file sizes

2. User Experience
   - Clear upload instructions
   - Visual feedback
   - Loading indicators
   - Success messages
   - Error messages

3. Performance
   - Image size validation
   - Proper aspect ratios
   - Responsive images
   - Loading optimization
   - Error boundaries

4. Accessibility
   - ARIA labels
   - Keyboard navigation
   - Focus management
   - Loading states
   - Error announcements
