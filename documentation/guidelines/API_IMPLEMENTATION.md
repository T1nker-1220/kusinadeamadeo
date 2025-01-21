# API Implementation Details

## Payment Processing

### GCash Payment Flow
```typescript
interface GCashPayment {
  orderId: string;
  amount: number;
  referenceNumber: string;
  screenshot: File;
  timestamp: Date;
}

interface PaymentVerification {
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verificationTimestamp?: Date;
  notes?: string;
}
```

#### Implementation Steps:
1. **Payment Submission**
   ```typescript
   async function submitGCashPayment(payment: GCashPayment): Promise<PaymentResponse> {
     try {
       // Upload screenshot to Supabase Storage
       const { data, error } = await supabase.storage
         .from('payment-proofs')
         .upload(`${payment.orderId}/${payment.referenceNumber}`, payment.screenshot);

       if (error) throw new Error('Screenshot upload failed');

       // Create payment record
       const paymentRecord = await prisma.payment.create({
         data: {
           orderId: payment.orderId,
           amount: payment.amount,
           referenceNumber: payment.referenceNumber,
           screenshotUrl: data.path,
           status: 'pending'
         }
       });

       return { success: true, paymentId: paymentRecord.id };
     } catch (error) {
       handlePaymentError(error);
       return { success: false, error: error.message };
     }
   }
   ```

2. **Payment Verification**
   ```typescript
   async function verifyGCashPayment(paymentId: string, adminId: string): Promise<VerificationResponse> {
     try {
       const payment = await prisma.payment.update({
         where: { id: paymentId },
         data: {
           status: 'verified',
           verifiedBy: adminId,
           verificationTimestamp: new Date()
         }
       });

       await sendPaymentConfirmation(payment.orderId);
       return { success: true };
     } catch (error) {
       handleVerificationError(error);
       return { success: false, error: error.message };
     }
   }
   ```

### Cash Payment Flow
```typescript
interface CashPayment {
  orderId: string;
  amount: number;
  receivedBy: string;
  timestamp: Date;
}
```

## Error Handling

### Global Error Types
```typescript
enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  ORDER_ERROR = 'ORDER_ERROR',
  SYSTEM_ERROR = 'SYSTEM_ERROR'
}

interface AppError extends Error {
  type: ErrorType;
  code: string;
  details?: Record<string, unknown>;
  userMessage?: string;
}
```

### Error Handling Implementation
```typescript
class ErrorHandler {
  static handle(error: AppError): ErrorResponse {
    // Log error for monitoring
    logger.error({
      type: error.type,
      code: error.code,
      message: error.message,
      details: error.details
    });

    // Return user-friendly response
    return {
      success: false,
      error: {
        message: error.userMessage || 'An unexpected error occurred',
        code: error.code
      }
    };
  }

  static handlePaymentError(error: Error): ErrorResponse {
    const appError: AppError = {
      type: ErrorType.PAYMENT_ERROR,
      code: 'PAYMENT_FAILED',
      message: error.message,
      userMessage: 'Payment processing failed. Please try again.'
    };
    return this.handle(appError);
  }
}
```

## Rate Limiting Configuration

### Global Rate Limits
```typescript
const rateLimits = {
  api: {
    window: '15m',
    max: 100
  },
  auth: {
    window: '5m',
    max: 5
  },
  payment: {
    window: '1h',
    max: 10
  }
};

// Implementation using Upstash
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '15m'),
  analytics: true,
});
```

## API Endpoints Documentation

### Authentication Endpoints

#### `POST /api/auth/google`
```typescript
/**
 * @api {post} /api/auth/google Google OAuth Authentication
 * @apiName GoogleAuth
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 * @apiPermission public
 *
 * @apiParam {string} token Google OAuth token
 *
 * @apiSuccess {string} accessToken JWT access token
 * @apiSuccess {User} user User profile information
 *
 * @apiError {string} error Error message
 */
interface GoogleAuthRequest {
  token: string;
}

interface GoogleAuthResponse {
  accessToken: string;
  user: User;
}
```

### Order Endpoints

#### `POST /api/orders`
```typescript
/**
 * @api {post} /api/orders Create Order
 * @apiName CreateOrder
 * @apiGroup Orders
 * @apiVersion 1.0.0
 * @apiPermission authenticated
 *
 * @apiParam {OrderItem[]} items Order items
 * @apiParam {string} paymentMethod Payment method
 *
 * @apiSuccess {string} orderId Created order ID
 * @apiSuccess {string} receiptId Generated receipt ID
 *
 * @apiError {string} error Error message
 */
interface CreateOrderRequest {
  items: OrderItem[];
  paymentMethod: 'gcash' | 'cash';
}

interface CreateOrderResponse {
  orderId: string;
  receiptId: string;
  totalAmount: number;
}
```

### Payment Endpoints

#### `POST /api/payments/gcash`
```typescript
/**
 * @api {post} /api/payments/gcash Submit GCash Payment
 * @apiName SubmitGCashPayment
 * @apiGroup Payments
 * @apiVersion 1.0.0
 * @apiPermission authenticated
 *
 * @apiParam {string} orderId Order ID
 * @apiParam {number} amount Payment amount
 * @apiParam {string} referenceNumber GCash reference number
 * @apiParam {File} screenshot Payment screenshot
 *
 * @apiSuccess {boolean} success Payment submission status
 * @apiSuccess {string} paymentId Created payment ID
 *
 * @apiError {string} error Error message
 */
```

### Rate Limiting Headers
```typescript
interface RateLimitHeaders {
  'X-RateLimit-Limit': number;
  'X-RateLimit-Remaining': number;
  'X-RateLimit-Reset': number;
}
```

## Error Response Formats

### Validation Errors
```typescript
interface ValidationError {
  code: 'VALIDATION_ERROR';
  message: string;
  fields: {
    [field: string]: {
      message: string;
      type: string;
    };
  };
}
```

### Authentication Errors
```typescript
interface AuthError {
  code: 'AUTH_ERROR';
  message: string;
  details?: {
    reason: string;
    action?: string;
  };
}
```

### Payment Errors
```typescript
interface PaymentError {
  code: 'PAYMENT_ERROR';
  message: string;
  details?: {
    reason: string;
    paymentId?: string;
    referenceNumber?: string;
  };
}
```

# API Implementation Status

## Current Endpoints

### Product Management

#### Product CRUD Operations
```typescript
interface ProductEndpoints {
  // GET /api/products
  list: {
    status: 'implemented',
    caching: 'needs-improvement',
    filtering: 'basic',
    pagination: 'implemented'
  };

  // GET /api/products/[id]
  detail: {
    status: 'implemented',
    caching: 'needs-improvement',
    validation: 'basic'
  };

  // POST /api/products
  create: {
    status: 'implemented',
    validation: 'needs-enhancement',
    imageHandling: 'working'
  };

  // PATCH /api/products/[id]
  update: {
    status: 'implemented',
    validation: 'needs-enhancement',
    cacheInvalidation: 'needs-fix'
  };

  // DELETE /api/products/[id]
  delete: {
    status: 'implemented',
    cacheInvalidation: 'needs-fix',
    cleanup: 'implemented'
  }
}
```

#### Category Management
```typescript
interface CategoryEndpoints {
  // GET /api/categories
  list: {
    status: 'implemented',
    caching: 'working',
    ordering: 'implemented'
  };

  // GET /api/categories/[id]
  detail: {
    status: 'implemented',
    caching: 'working'
  };

  // POST /api/categories
  create: {
    status: 'implemented',
    validation: 'needs-enhancement',
    limitEnforcement: 'pending'
  };

  // PATCH /api/categories/[id]
  update: {
    status: 'implemented',
    validation: 'basic',
    orderUpdate: 'implemented'
  };

  // DELETE /api/categories/[id]
  delete: {
    status: 'implemented',
    cleanup: 'implemented'
  }
}
```

### Known Issues

1. **Cache Invalidation**
```typescript
interface CacheIssues {
  products: {
    listInvalidation: 'needs-fix',
    detailInvalidation: 'needs-fix',
    updateTriggers: 'incomplete'
  };
  categories: {
    orderingCache: 'needs-optimization',
    limitTracking: 'not-implemented'
  }
}
```

2. **Validation**
```typescript
interface ValidationIssues {
  products: {
    imageValidation: 'basic',
    variantValidation: 'needs-enhancement',
    priceValidation: 'needs-rules'
  };
  categories: {
    limitValidation: 'not-implemented',
    orderValidation: 'basic'
  }
}
```

3. **Error Handling**
```typescript
interface ErrorHandling {
  current: {
    validation: 'basic-zod',
    http: 'basic-try-catch',
    database: 'basic-prisma'
  };
  needed: {
    customErrors: true,
    errorBoundaries: true,
    retryLogic: true,
    logging: true
  }
}
```

## Implementation Priorities

### Immediate Fixes
1. Cache Invalidation
   ```typescript
   const cacheStrategy = {
     products: {
       onCreate: ['list'],
       onUpdate: ['list', 'detail'],
       onDelete: ['list']
     },
     categories: {
       onCreate: ['list'],
       onUpdate: ['list', 'detail'],
       onDelete: ['list']
     }
   };
   ```

2. Validation Enhancement
   ```typescript
   const validationStrategy = {
     products: {
       image: ['size', 'format', 'dimensions'],
       variants: ['price', 'availability', 'options'],
       category: ['existence', 'availability']
     },
     categories: {
       limit: ['max-4', 'active-only'],
       order: ['unique', 'sequential']
     }
   };
   ```

3. Error Handling
   ```typescript
   const errorStrategy = {
     validation: {
       implementation: 'zod',
       messages: 'user-friendly',
       recovery: 'suggested-actions'
     },
     http: {
       status: 'appropriate-codes',
       messages: 'detailed-errors',
       logging: 'structured'
     },
     database: {
       constraints: 'proper-handling',
       uniqueness: 'clear-messages',
       foreign: 'cascading-actions'
     }
   };
   ```

## Future Endpoints

### Phase 2 Endpoints
```typescript
interface Phase2Endpoints {
  userProfile: {
    fields: ['phone', 'address'],
    validation: 'comprehensive',
    privacy: 'gdpr-compliant'
  };

  orderSystem: {
    delivery: {
      options: ['pickup', 'delivery'],
      validation: 'address-based',
      pricing: 'zone-based'
    },
    payment: {
      methods: ['gcash', 'cash'],
      verification: 'manual',
      status: 'real-time'
    }
  };

  addOns: {
    management: 'crud-operations',
    pricing: 'flexible',
    availability: 'toggleable'
  };

  storeHours: {
    operations: 'crud',
    special: 'holiday-hours',
    validation: 'overlap-check'
  }
}
```

## Testing Requirements

```typescript
interface TestingStrategy {
  unit: {
    validation: 'jest',
    logic: 'jest',
    coverage: '80%'
  };
  integration: {
    api: 'supertest',
    flow: 'end-to-end',
    scenarios: 'comprehensive'
  };
  performance: {
    load: 'k6',
    stress: 'needed',
    monitoring: 'needed'
  }
}
```

## Documentation TODOs

1. API Reference
   - Complete endpoint documentation
   - Add request/response examples
   - Document error codes
   - Add validation rules

2. Integration Guides
   - Add authentication flow
   - Document caching strategy
   - Explain error handling
   - Provide testing guides

3. Monitoring Setup
   - Add performance metrics
   - Set up error tracking
   - Implement logging
   - Configure alerts
