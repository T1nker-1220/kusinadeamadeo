# Variant API Documentation

## Variant Image Management

### `DELETE /api/products/[id]/variants/image`

Deletes an image from a variant and updates the database accordingly.

#### Authentication
- Requires authentication
- Admin role required

#### URL Parameters
- `id`: Product ID (UUID)
- `variantId`: Variant ID (UUID) - Query parameter

#### Request
```typescript
DELETE /api/products/[id]/variants/image?variantId=[variantId]
```

#### Response
```typescript
// Success Response (200 OK)
{
  "message": "Image deleted successfully",
  "variant": {
    "id": string,
    "productId": string,
    "type": "SIZE" | "FLAVOR",
    "name": string,
    "price": number,
    "stock": number,
    "isAvailable": boolean,
    "imageUrl": null,
    // ... other variant fields
  }
}

// Error Responses
// 400 Bad Request
{
  "error": "Variant ID is required"
}
// or
{
  "error": "Variant has no image to delete"
}

// 401 Unauthorized
{
  "error": "Unauthorized"
}

// 404 Not Found
{
  "error": "Variant not found"
}

// 500 Internal Server Error
{
  "error": "Failed to delete variant image"
}
```

#### Implementation Details
- Validates user authentication and role
- Verifies variant existence and ownership
- Handles image deletion from storage
- Updates database records
- Implements rollback on failure

#### Error Handling
- Input validation
- Authentication checks
- Database operation errors
- Storage operation errors
- Rollback mechanisms

#### Usage Example
```typescript
const response = await fetch(
  `/api/products/${productId}/variants/image?variantId=${variantId}`,
  {
    method: 'DELETE'
  }
);

const result = await response.json();
```

#### Security Considerations
- Admin-only access
- Data validation
- Safe deletion process
- Error recovery
- Audit logging

## Form State Management

### Variant Form Interactions

The variant form implements comprehensive state management for image operations:

```typescript
// Image Upload State
const [isUploading, setIsUploading] = useState(false);
const [isRemoving, setIsRemoving] = useState(false);

// Form State Management
const form = useForm<VariantFormValues>({
  resolver: zodResolver(variantFormSchema),
  defaultValues: initialData || {
    type: 'SIZE',
    name: '',
    price: 0,
    stock: 0,
    isAvailable: true,
    imageUrl: '',
  },
});
```

### Error Recovery

The form implements robust error recovery mechanisms:

```typescript
try {
  // Operation logic
} catch (error) {
  // Error handling
  const errorMessage = error instanceof Error
    ? error.message
    : 'Operation failed';
  toast.error(errorMessage);

  // State recovery
  form.setValue('imageUrl', currentImageUrl, {
    shouldDirty: false,
    shouldTouch: false,
    shouldValidate: false
  });
}
```

### Loading States

Loading states are properly managed:

```typescript
<Button
  type="submit"
  disabled={isSubmitting || isRemoving || !form.formState.isDirty}
>
  {isSubmitting ? (
    <span className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      {initialData ? 'Updating...' : 'Creating...'}
    </span>
  ) : (
    initialData ? 'Update Variant' : 'Add Variant'
  )}
</Button>
```
