# Product Display Issues Troubleshooting Guide

## Common Issues

### 1. Products Not Displaying in Admin Interface

#### Symptoms
- Empty product list despite existing products
- Inconsistent product display
- Missing product data

#### Diagnostic Steps
1. Check Network Requests
   ```typescript
   // Verify request URL and parameters
   const url = `/api/products?${params.toString()}`;
   console.log('Request URL:', url);
   ```

2. Verify API Response
   ```typescript
   // Log API response
   const response = await fetch(url);
   const data = await response.json();
   console.log('API Response:', data);
   ```

3. Check React Query State
   ```typescript
   // Inspect query state
   const { data, isLoading, error } = useQuery({
     queryKey: ['products'],
     queryFn: fetchProducts,
   });
   console.log('Query State:', { data, isLoading, error });
   ```

### 2. Filter and Sort Issues

#### Symptoms
- Filters not working correctly
- Sort order inconsistent
- Category filters not applying

#### Diagnostic Steps
1. Check Filter State
   ```typescript
   // Log filter changes
   useEffect(() => {
     console.log('Column Filters:', columnFilters);
     console.log('Sort State:', sorting);
   }, [columnFilters, sorting]);
   ```

2. Verify Parameter Encoding
   ```typescript
   // Check URL parameter encoding
   columnFilters.forEach((filter) => {
     console.log('Filter:', {
       id: filter.id,
       value: filter.value,
       encoded: encodeURIComponent(filter.value as string)
     });
   });
   ```

3. Monitor State Updates
   ```typescript
   // Track state updates
   const table = useReactTable({
     onColumnFiltersChange: (filters) => {
       console.log('Filters Changed:', filters);
       setColumnFilters(filters);
     },
   });
   ```

### 3. Image Loading Problems

#### Symptoms
- Missing product images
- Placeholder images not loading
- Broken image links

#### Diagnostic Steps
1. Check Image URLs
   ```typescript
   // Verify image URL construction
   const imageUrl = row.getValue('imageUrl') || '/images/placeholder.jpg';
   console.log('Image URL:', imageUrl);
   ```

2. Verify Storage Access
   ```typescript
   // Test storage access
   const { data, error } = await supabase.storage
     .from('images')
     .list('products');
   console.log('Storage List:', { data, error });
   ```

3. Monitor Image Loading
   ```typescript
   // Track image load events
   <Image
     onError={(e) => console.error('Image Load Error:', e)}
     onLoad={() => console.log('Image Loaded Successfully')}
   />
   ```

## Quick Fixes

### 1. Reset Cache and Refetch
```typescript
// Clear query cache and refetch
const queryClient = useQueryClient();
await queryClient.resetQueries(['products']);
await queryClient.refetchQueries(['products']);
```

### 2. Clear Filter State
```typescript
// Reset all filters and sorting
setColumnFilters([]);
setSorting([]);
table.resetColumnFilters();
```

### 3. Verify Data Loading
```typescript
// Force data refresh
const { refetch } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
});
await refetch();
```

## Prevention Steps

### 1. Implement Error Boundaries
```typescript
class ProductErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    console.error('Product Error:', error, info);
    // Log to error tracking service
  }
}
```

### 2. Add Data Validation
```typescript
// Validate product data
const validateProduct = (product: any): product is Product => {
  return (
    typeof product === 'object' &&
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.imageUrl === 'string'
  );
};
```

### 3. Improve Error Handling
```typescript
// Enhanced error handling
try {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  if (!Array.isArray(data.products)) {
    throw new Error('Invalid response format');
  }
} catch (error) {
  console.error('Product fetch error:', error);
  // Handle error appropriately
}
```

## Advanced Debugging

### 1. Network Analysis
- Use browser dev tools Network tab
- Monitor XHR/Fetch requests
- Check response headers and timing

### 2. State Debugging
- Use React Dev Tools
- Monitor component re-renders
- Track state changes

### 3. Performance Profiling
- Use React Profiler
- Monitor component performance
- Track render times

## Common Solutions

### 1. Cache Issues
```typescript
// Configure proper cache behavior
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### 2. Data Fetching
```typescript
// Implement proper error handling
const fetchProducts = async () => {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
```

### 3. State Management
```typescript
// Implement proper state updates
const updateFilters = (newFilters: ColumnFiltersState) => {
  setColumnFilters(newFilters);
  // Reset pagination when filters change
  table.setPageIndex(0);
};
```

## Escalation Process

### 1. Initial Response
- Document the issue
- Gather error logs
- Collect user steps

### 2. Investigation
- Review server logs
- Check client logs
- Analyze network requests

### 3. Resolution
- Apply fixes
- Verify solution
- Update documentation

## Monitoring and Prevention

### 1. Error Tracking
```typescript
// Implement error tracking
window.onerror = function(msg, url, lineNo, columnNo, error) {
  console.error('Global Error:', {
    message: msg,
    url: url,
    line: lineNo,
    column: columnNo,
    error: error
  });
  return false;
};
```

### 2. Performance Monitoring
```typescript
// Track component performance
const ProductList = React.memo(() => {
  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current++;
    console.log('Product List Render Count:', renderCount.current);
  });
  // Component logic
});
```

### 3. Usage Analytics
```typescript
// Track user interactions
const trackProductAction = (action: string, productId: string) => {
  console.log('Product Action:', {
    action,
    productId,
    timestamp: new Date().toISOString()
  });
};
```
