# Kusina de Amadeo - Troubleshooting Guide

## Common Issues and Solutions

### 1. Dashboard Data Fetching Issues

#### Table Name Mismatches
**Problem**: Error messages like "relation 'public.orders' does not exist"
**Solution**:
- Ensure table names use PascalCase in Supabase queries
- Update table references:
  - `orders` → `Order`
  - `products` → `Product`
  - `users` → `User`
  - `categories` → `Category`

#### Column Name Mismatches
**Problem**: Errors like "column Category.isAvailable does not exist"
**Solution**:
- Check actual column names in Supabase schema
- Update column references to match exact names
- Common mappings:
  - `created_at` → `createdAt`
  - `updated_at` → `updatedAt`
  - `total_amount` → `totalAmount`

### 2. Real-time Subscription Issues

#### Connection Problems
**Problem**: Real-time updates not working
**Solution**:
- Check subscription setup in useEffect
- Verify channel names are correct
- Ensure proper cleanup in useEffect return
- Check console for subscription status logs

#### Data Updates
**Problem**: Stale data after updates
**Solution**:
- Implement proper error handling in subscription callbacks
- Use optimistic updates where appropriate
- Implement retry mechanism for failed fetches
- Check real-time enablement in Supabase dashboard

### 3. Type Safety and Interface Issues

#### TypeScript Errors
**Problem**: Type mismatches with Supabase data
**Solution**:
- Update interfaces to match actual database schema
- Use proper types for all columns
- Include all required fields in interfaces
- Handle nullable fields appropriately

#### Data Transformation
**Problem**: Data shape mismatches
**Solution**:
- Transform data at the boundary
- Use proper type casting
- Handle null/undefined cases
- Implement data validation

### 4. Performance Optimization

#### Slow Dashboard Loading
**Problem**: Dashboard metrics take too long to load
**Solution**:
- Implement proper loading states
- Use SWR for data caching
- Optimize database queries
- Implement proper error boundaries

#### Memory Leaks
**Problem**: Memory usage increases over time
**Solution**:
- Clean up subscriptions properly
- Unsubscribe from real-time channels
- Clear intervals and timeouts
- Remove event listeners

### 5. Error Handling

#### Generic Error Messages
**Problem**: Unhelpful error messages
**Solution**:
- Implement detailed error logging
- Add error context and details
- Use proper error boundaries
- Provide user-friendly error messages

#### Failed Queries
**Problem**: Database queries failing
**Solution**:
- Implement retry mechanism
- Add proper error logging
- Check RLS policies
- Verify database permissions

## Best Practices

1. **Development Workflow**
   - Use proper TypeScript types
   - Implement comprehensive error handling
   - Add detailed logging in development
   - Follow naming conventions

2. **Testing**
   - Test error scenarios
   - Verify data transformations
   - Check subscription cleanup
   - Validate error messages

3. **Monitoring**
   - Check console logs
   - Monitor real-time connections
   - Track query performance
   - Watch for error patterns

4. **Maintenance**
   - Keep documentation updated
   - Review error logs regularly
   - Update type definitions
   - Maintain consistent naming

## Debug Mode

To enable detailed debugging:
```typescript
// Add to .env.local
NEXT_PUBLIC_DEBUG_MODE=true

// In your code
if (process.env.NEXT_PUBLIC_DEBUG_MODE) {
  console.debug('Debugging information');
}
```

## Support Resources

1. **Documentation**
   - Supabase Documentation
   - Project README
   - API Documentation
   - Component Documentation

2. **Tools**
   - Browser Developer Tools
   - Supabase Dashboard
   - TypeScript Compiler
   - React Developer Tools
