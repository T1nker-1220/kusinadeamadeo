# API Documentation

## Authentication
All admin endpoints require authentication using Supabase Auth. The user must have an ADMIN role to access protected endpoints.

## Base URL
All API endpoints are relative to: `/api`

## Response Format
All responses follow this general format:
```json
{
  "data": {},      // Success response data
  "error": "",     // Error message if applicable
  "details": [],   // Additional error details
  "status": 200    // HTTP status code
}
```

## Endpoints

### Products API

#### GET /products
Fetches a paginated list of products.

**Query Parameters:**
- `categoryId` (string, optional): Filter by category UUID
- `isAvailable` (boolean, optional): Filter by availability
- `search` (string, optional): Search in name/description
- `sortBy` (string, optional): Field to sort by (name, basePrice, createdAt)
- `sortOrder` (string, optional): Sort direction (asc, desc)
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Response:**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "basePrice": "number",
      "imageUrl": "string",
      "categoryId": "uuid",
      "isAvailable": "boolean",
      "allowsAddons": "boolean",
      "createdAt": "string",
      "updatedAt": "string",
      "category": {
        "id": "uuid",
        "name": "string"
      },
      "variants": [
        {
          "id": "uuid",
          "type": "SIZE|FLAVOR",
          "name": "string",
          "price": "number",
          "imageUrl": "string"
        }
      ]
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number",
  "totalPages": "number"
}
```

#### GET /products/[id]
Fetches a single product by ID.

**Parameters:**
- `id` (string): Product UUID

**Response:**
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "basePrice": "number",
  "imageUrl": "string",
  "categoryId": "uuid",
  "isAvailable": "boolean",
  "allowsAddons": "boolean",
  "category": {
    "id": "uuid",
    "name": "string"
  },
  "variants": [
    {
      "id": "uuid",
      "type": "SIZE|FLAVOR",
      "name": "string",
      "price": "number",
      "imageUrl": "string"
    }
  ]
}
```

#### POST /products
Creates a new product. Requires ADMIN role.

**Request Body:**
```json
{
  "name": "string (3-50 chars)",
  "description": "string (10-200 chars)",
  "basePrice": "number (positive)",
  "imageUrl": "string (URL)",
  "categoryId": "string (UUID)",
  "isAvailable": "boolean",
  "allowsAddons": "boolean",
  "variants": [
    {
      "type": "SIZE|FLAVOR",
      "name": "string (1-50 chars)",
      "price": "number (positive)",
      "imageUrl": "string (URL, optional)"
    }
  ]
}
```

#### PATCH /products/[id]
Updates an existing product. Requires ADMIN role.

**Parameters:**
- `id` (string): Product UUID

**Request Body:**
All fields are optional
```json
{
  "name": "string (3-50 chars)",
  "description": "string (10-200 chars)",
  "basePrice": "number (positive)",
  "imageUrl": "string (URL)",
  "categoryId": "string (UUID)",
  "isAvailable": "boolean",
  "allowsAddons": "boolean"
}
```

#### DELETE /products/[id]
Deletes a product and its variants. Requires ADMIN role.

**Parameters:**
- `id` (string): Product UUID

### Product Variants API

#### GET /products/[id]/variants
Fetches variants for a specific product.

**Parameters:**
- `id` (string): Product UUID

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "SIZE|FLAVOR",
    "name": "string",
    "price": "number",
    "imageUrl": "string",
    "productId": "uuid"
  }
]
```

#### POST /products/[id]/variants
Creates a new variant for a product. Requires ADMIN role.

**Parameters:**
- `id` (string): Product UUID

**Request Body:**
```json
{
  "type": "SIZE|FLAVOR",
  "name": "string (1-50 chars)",
  "price": "number (positive)",
  "imageUrl": "string (URL, optional)"
}
```

#### PATCH /products/[id]/variants
Updates a product variant. Requires ADMIN role.

**Parameters:**
- `id` (string): Product UUID
- `variantId` (string): Variant UUID (in request body)

**Request Body:**
```json
{
  "variantId": "string (UUID)",
  "type": "SIZE|FLAVOR (optional)",
  "name": "string (optional)",
  "price": "number (optional)",
  "imageUrl": "string (optional)"
}
```

#### DELETE /products/[id]/variants
Deletes a product variant. Requires ADMIN role.

**Parameters:**
- `id` (string): Product UUID
- `variantId` (string): Variant UUID (in query params)

### Categories API

#### GET /categories
Fetches all categories, sorted by sortOrder.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "imageUrl": "string",
    "sortOrder": "number"
  }
]
```

#### POST /categories
Creates a new category. Requires ADMIN role.

**Request Body:**
```json
{
  "name": "string (3-50 chars)",
  "description": "string (10-200 chars)",
  "imageUrl": "string (URL)",
  "sortOrder": "number (min: 1)"
}
```

#### PATCH /categories
Updates an existing category. Requires ADMIN role.

**Request Body:**
```json
{
  "id": "string (UUID)",
  "name": "string (optional)",
  "description": "string (optional)",
  "imageUrl": "string (optional)",
  "sortOrder": "number (optional)"
}
```

#### DELETE /categories
Deletes a category. Requires ADMIN role.

**Query Parameters:**
- `id` (string): Category UUID

### Image Upload API

#### POST /upload
Uploads and processes an image. Requires ADMIN role.

**Request Body (FormData):**
- `file`: Image file (PNG, JPG, JPEG, WebP)
- `type`: "category" | "product" | "variant"

**Response:**
```json
{
  "url": "string (CDN URL)",
  "path": "string (Storage path)"
}
```

**Image Processing:**
- Category: 800x600px, 80% quality
- Product: 1200x800px, 85% quality
- Variant: 600x400px, 80% quality
- All images converted to WebP format

#### DELETE /upload
Deletes an image from storage. Requires ADMIN role.

**Query Parameters:**
- `path` (string): Storage path of the image

## Error Codes

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

### Common Error Messages
- "Unauthorized": User not authenticated
- "Forbidden": User not authorized (not ADMIN)
- "Invalid request data": Validation failed
- "Not found": Resource doesn't exist
- "Failed to [action]": Server error during operation

## Rate Limiting
- Default: 100 requests per minute per IP
- Upload endpoints: 20 requests per minute per IP

## Best Practices
1. Always include error handling
2. Validate input before making requests
3. Use proper authentication headers
4. Handle pagination for large datasets
5. Implement retry logic for failed requests
```
