# Development Guidelines

## Image Management Guidelines

### 1. Image Upload Implementation

#### Component Structure
```typescript
// Always implement these states
const [isUploading, setIsUploading] = useState(false);
const [isRemoving, setIsRemoving] = useState(false);
const [error, setError] = useState<string | null>(null);

// Always handle loading states
<Button disabled={isUploading || isRemoving}>
  {isUploading ? 'Uploading...' : 'Upload'}
</Button>
```

#### Error Handling
```typescript
try {
  // Operation logic
} catch (error) {
  // Always provide user feedback
  toast.error(error instanceof Error ? error.message : 'Operation failed');

  // Always implement state recovery
  form.reset(previousState);
}
```

### 2. Form State Management

#### Form Implementation
```typescript
// Use Zod for validation
const schema = z.object({
  // Define schema
});

// Use React Hook Form
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {
    // Set defaults
  }
});
```

#### State Updates
```typescript
// Always use form methods
form.setValue('field', value, {
  shouldDirty: true,
  shouldTouch: true,
  shouldValidate: true
});

// Never mutate state directly
// ❌ formData.field = value;
```

## Best Practices

### 1. Image Handling

- Always validate file types
- Always validate file sizes
- Implement proper error handling
- Show loading states
- Provide user feedback
- Implement rollback mechanisms
- Log operations
- Clean up resources

### 2. Form Management

- Use form validation
- Implement state management
- Show loading states
- Handle errors gracefully
- Provide feedback
- Maintain consistency
- Log form actions
- Clean up on unmount

### 3. Error Prevention

- Validate inputs
- Handle edge cases
- Implement boundaries
- Log errors
- Recover gracefully
- Clean up resources
- Handle timeouts
- Manage memory

### 4. Performance

- Optimize images
- Implement caching
- Use proper indexes
- Batch operations
- Monitor performance
- Handle memory
- Clean up resources
- Log metrics

## Code Standards

### 1. Component Structure

```typescript
// Always use TypeScript
interface Props {
  // Define props
}

// Always use proper naming
export function ComponentName({ prop1, prop2 }: Props) {
  // Implementation
}
```

### 2. Error Handling

```typescript
// Always use try-catch
try {
  // Operation
} catch (error) {
  // Handle error
  console.error('Operation failed:', error);
  // Provide feedback
  toast.error('Operation failed');
}
```

### 3. State Management

```typescript
// Always use proper state management
const [state, setState] = useState(initialState);

// Always handle loading states
const [isLoading, setIsLoading] = useState(false);

// Always handle errors
const [error, setError] = useState<Error | null>(null);
```

## Testing Guidelines

### 1. Component Testing

```typescript
describe('Component', () => {
  it('handles image upload', async () => {
    // Test implementation
  });

  it('handles errors', async () => {
    // Test implementation
  });
});
```

### 2. Error Testing

```typescript
it('handles upload errors', async () => {
  // Arrange
  const error = new Error('Upload failed');

  // Act
  await act(async () => {
    // Trigger error
  });

  // Assert
  expect(toast.error).toHaveBeenCalledWith('Upload failed');
});
```

## Documentation Standards

### 1. Code Comments

```typescript
// Always document complex logic
function complexOperation() {
  // Implementation details
}

// Always document error handling
try {
  // Operation
} catch (error) {
  // Error handling strategy
}
```

### 2. Type Definitions

```typescript
// Always document types
interface OperationResult {
  success: boolean;
  data?: any;
  error?: Error;
}

// Always document functions
function handleOperation(): Promise<OperationResult> {
  // Implementation
}
```

## Security Guidelines

### 1. File Validation

```typescript
// Always validate file types
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid file type');
}

// Always validate file size
const maxSize = 5 * 1024 * 1024; // 5MB
if (file.size > maxSize) {
  throw new Error('File too large');
}
```

### 2. Access Control

```typescript
// Always verify authentication
if (!user) {
  throw new Error('Unauthorized');
}

// Always verify authorization
if (user.role !== 'ADMIN') {
  throw new Error('Forbidden');
}
```
