# Form Handling Best Practices

## React Form Management

### Form References
- Always use `useRef` for form references to maintain stability during async operations
- Store form reference before async operations to prevent null pointer issues
- Use TypeScript for proper type safety with form references

```typescript
const formRef = useRef<HTMLFormElement>(null);
```

### Form Reset Handling
- Store form reference in a local variable before async operations
- Use the stored reference for form reset
- Implement proper error handling for form operations

```typescript
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const form = event.currentTarget;

  try {
    // ... async operations
    form.reset(); // Safe form reset
  } catch (error) {
    // Error handling
  }
};
```

### API Integration
- Handle API responses properly
- Show appropriate toast notifications
- Preserve form state until successful submission
- Clear form only after successful operations

```typescript
// API response handling
const response = await fetch("/api/endpoint");
const data = await response.json();

if (!response.ok) {
  throw new Error(data.error || "Operation failed");
}

// Success handling
toast({ title: "Success", description: "Operation completed" });
form.reset();
```

### Error Handling
- Implement proper error boundaries
- Show meaningful error messages
- Preserve form state on error
- Allow retry operations
- Handle network errors gracefully

### State Management
- Use React state for form data when needed
- Implement proper loading states
- Handle form submission states
- Manage async operation states

### Form Validation
- Implement client-side validation
- Handle server-side validation errors
- Show validation feedback
- Prevent double submission

### Best Practices
1. Always use TypeScript for form handling
2. Implement proper error boundaries
3. Handle async operations safely
4. Maintain form state consistency
5. Use proper type definitions
6. Handle edge cases
7. Implement proper cleanup

### Common Pitfalls to Avoid
- Avoid using form references after async operations without proper checks
- Don't reset forms before successful API responses
- Prevent form submission during loading states
- Handle form cleanup on component unmount
