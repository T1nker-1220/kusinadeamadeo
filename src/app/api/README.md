# API Implementation Architecture

## API Directory Structure
```
src/
  app/
    api/
      auth/
        [...nextauth]/
          route.ts      # Authentication endpoints
      products/
        route.ts        # Product management
        [id]/
          route.ts      # Single product operations
      categories/
        route.ts        # Category management
        [id]/
          route.ts      # Single category operations
      orders/
        route.ts        # Order management
        [id]/
          route.ts      # Single order operations
      payments/
        gcash/
          route.ts      # GCash payment processing
        verify/
          route.ts      # Payment verification
      upload/
        route.ts        # Image upload handling
```

## Implementation Examples

### 1. Product API
```typescript:src/app/api/products/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ProductSchema } from '@/lib/validations/product'
import { getServerSession } from 'next-auth'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const products = await db.product.findMany({
      where: category ? { categoryId: category } : {},
      include: {
        variants: true,
        addons: true,
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = ProductSchema.parse(body)

    const product = await db.product.create({
      data: validatedData
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
```

### 2. Order API
```typescript:src/app/api/orders/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { OrderSchema } from '@/lib/validations/order'
import { generateOrderId } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = OrderSchema.parse(body)

    const order = await db.order.create({
      data: {
        ...validatedData,
        orderId: generateOrderId(), // AE20 format
        userId: session.user.id,
        status: 'PENDING'
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
```

### 3. Payment Verification API
```typescript:src/app/api/payments/verify/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { PaymentSchema } from '@/lib/validations/payment'
import { uploadPaymentProof } from '@/lib/upload'

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const paymentProof = formData.get('paymentProof') as File
    const reference = formData.get('reference') as string

    // Upload payment proof
    const imageUrl = await uploadPaymentProof(paymentProof)

    // Update payment record
    const payment = await db.payment.update({
      where: { reference },
      data: {
        proofUrl: imageUrl,
        status: 'PENDING_VERIFICATION'
      }
    })

    return NextResponse.json(payment)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
```

### 4. Category API
```typescript:src/app/api/categories/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { CategorySchema } from '@/lib/validations/category'

export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
```

## API Utilities

### 1. Validation Schemas
```typescript:src/lib/validations/product.ts
import { z } from 'zod'

export const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  categoryId: z.string().uuid(),
  variants: z.array(z.object({
    name: z.string(),
    price: z.number()
  })).optional(),
  addons: z.array(z.string()).optional()
})
```

### 2. Error Handling
```typescript:src/lib/api-utils.ts
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
  }
}

export const handleAPIError = (error: unknown) => {
  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }

  return NextResponse.json(
    { error: 'Internal Server Error' },
    { status: 500 }
  )
}
```

## API Best Practices

1. **Security**
   - Implement proper authentication checks
   - Validate all inputs with Zod
   - Use proper CORS configuration
   - Implement rate limiting
   - Sanitize all outputs

2. **Performance**
   - Optimize database queries
   - Implement proper caching
   - Use edge functions where appropriate
   - Minimize response payload size
   - Handle concurrent requests properly

3. **Error Handling**
   - Implement consistent error responses
   - Log errors properly
   - Provide meaningful error messages
   - Handle edge cases
   - Implement retry mechanisms

4. **Documentation**
   - Document all endpoints
   - Provide request/response examples
   - Document error codes
   - Keep documentation updated
   - Include authentication requirements
