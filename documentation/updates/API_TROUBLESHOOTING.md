# API Troubleshooting Guide

## Common Issues and Solutions

### Authentication Issues

#### 1. "Unauthorized" Error
**Symptoms:**
- 401 status code
- "Unauthorized" error message

**Solutions:**
1. Check if the authentication token is included in the request header
```typescript
const response = await fetch('/api/products', {
  headers: {
    'Authorization': `Bearer ${session?.access_token}`
  }
});
```
2. Verify token expiration
3. Ensure proper login flow

#### 2. "Forbidden" Error
**Symptoms:**
- 403 status code
- "Forbidden" error message

**Solutions:**
1. Verify user has ADMIN role
2. Check role assignment in Supabase dashboard
3. Ensure proper role validation

### Product Management Issues

#### 1. Product Creation Fails
**Symptoms:**
- 400 status code
- Validation errors

**Solutions:**
1. Verify request body format:
```typescript
const product = {
  name: string,        // 3-50 chars
  description: string, // 10-200 chars
  basePrice: number,   // positive
  categoryId: string,  // valid UUID
  imageUrl: string,    // valid URL
  isAvailable: boolean,
  allowsAddons: boolean
};
```
2. Check all required fields are present
3. Validate field constraints

#### 2. Image Upload Issues
**Symptoms:**
- Upload fails
- Invalid file type error
- File size error

**Solutions:**
1. Check file type (PNG, JPG, JPEG, WebP only)
2. Verify file size limits:
```typescript
const maxSizes = {
  product: 5 * 1024 * 1024,  // 5MB
  category: 3 * 1024 * 1024, // 3MB
  variant: 2 * 1024 * 1024   // 2MB
};
```
3. Ensure proper FormData format:
```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('type', 'product');
```

### Category Management Issues

#### 1. Category Sorting Problems
**Symptoms:**
- Categories in wrong order
- Duplicate sort orders

**Solutions:**
1. Ensure unique sortOrder values
2. Update existing categories when inserting new ones
3. Reorder categories when needed:
```typescript
const updateOrder = async (categories: Category[]) => {
  return Promise.all(
    categories.map((cat, index) =>
      fetch('/api/categories', {
        method: 'PATCH',
        body: JSON.stringify({
          id: cat.id,
          sortOrder: index + 1
        })
      })
    )
  );
};
```

### Product Variant Issues

#### 1. Variant Creation Fails
**Symptoms:**
- 400 status code
- Type validation error

**Solutions:**
1. Verify variant type is valid:
```typescript
type VariantType = 'SIZE' | 'FLAVOR';
const variant = {
  type: 'SIZE',           // must be SIZE or FLAVOR
  name: string,           // 1-50 chars
  price: number,          // positive
  imageUrl?: string       // optional
};
```
2. Check price is positive
3. Validate name length

### Performance Issues

#### 1. Slow Product Listings
**Symptoms:**
- Long loading times
- Timeout errors

**Solutions:**
1. Use pagination:
```typescript
const fetchProducts = async (page = 1, limit = 10) => {
  const response = await fetch(
    `/api/products?page=${page}&limit=${limit}`
  );
  return response.json();
};
```
2. Implement caching
3. Use proper indexes

#### 2. Image Loading Performance
**Symptoms:**
- Slow image loading
- High bandwidth usage

**Solutions:**
1. Use appropriate image sizes
2. Implement lazy loading
3. Use WebP format
4. Implement CDN caching

### Data Consistency Issues

#### 1. Missing Related Data
**Symptoms:**
- Incomplete product data
- Missing category information

**Solutions:**
1. Check include parameters:
```typescript
const product = await prisma.product.findUnique({
  where: { id },
  include: {
    category: true,
    variants: true
  }
});
```
2. Verify foreign key relationships
3. Check cascade delete settings

## Advanced Debugging

### Network Debugging
1. Use browser developer tools
2. Check request/response headers
3. Verify payload format
4. Monitor network timing

### Database Debugging
1. Check Prisma query logs
2. Verify index usage
3. Monitor query performance
4. Check connection pool

### Image Processing Debugging
1. Verify sharp configuration
2. Check image metadata
3. Monitor processing time
4. Validate output formats

## Error Logging

### Client-Side Logging
```typescript
const logError = async (error: Error, context: object) => {
  console.error('API Error:', {
    message: error.message,
    stack: error.stack,
    context
  });
  // Send to error tracking service
};
```

### Server-Side Logging
```typescript
const logServerError = async (error: Error, req: Request) => {
  console.error('Server Error:', {
    message: error.message,
    stack: error.stack,
    path: req.url,
    method: req.method
  });
  // Log to monitoring service
};
```

## Prevention Best Practices

1. Input Validation
```typescript
const validateProduct = (data: unknown): Product => {
  return ProductSchema.parse(data);
};
```

2. Error Handling
```typescript
try {
  const response = await api.call();
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
} catch (error) {
  // Handle error appropriately
  logError(error, { context: 'API call' });
}
```

3. Rate Limiting
```typescript
const api = {
  async call(endpoint: string) {
    await this.checkRateLimit();
    return fetch(endpoint);
  },

  async checkRateLimit() {
    // Implement rate limiting logic
  }
};
```

## Monitoring and Alerts

1. Performance Monitoring
- Track response times
- Monitor error rates
- Check resource usage

2. Error Alerts
- Set up alert thresholds
- Monitor critical endpoints
- Track error patterns

3. Usage Monitoring
- Track API usage
- Monitor rate limits
- Check resource utilization

## Support Escalation Process

1. Level 1: Basic Troubleshooting
- Check documentation
- Verify request format
- Validate input data

2. Level 2: Technical Investigation
- Review error logs
- Check database queries
- Analyze performance metrics

3. Level 3: Developer Support
- Code-level debugging
- Performance optimization
- Security analysis
```
