# Storage API Documentation

## Storage Cleanup Endpoint

### `POST /api/storage/cleanup`

Triggers a cleanup process for orphaned images in storage. This endpoint is restricted to admin users only.

#### Authentication
- Requires authentication
- Admin role required

#### Request
```typescript
POST /api/storage/cleanup
```

#### Response
```typescript
// Success Response (200 OK)
{
  "message": "Storage cleanup completed successfully"
}

// Error Responses
// 401 Unauthorized
{
  "error": "Unauthorized"
}

// 403 Forbidden
{
  "error": "Forbidden"
}

// 500 Internal Server Error
{
  "error": "Failed to cleanup storage"
}
```

#### Implementation Details
- Scans storage for orphaned images
- Verifies image references in database
- Deletes unreferenced images
- Maintains data consistency
- Implements error recovery

#### Error Handling
- Authentication validation
- Role-based access control
- Storage operation errors
- Database consistency checks
- Cleanup operation logging

#### Usage Example
```typescript
const response = await fetch('/api/storage/cleanup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
});

const result = await response.json();
```

#### Security Considerations
- Admin-only access
- Audit logging
- Safe deletion verification
- Error recovery mechanisms
- Rate limiting recommended
