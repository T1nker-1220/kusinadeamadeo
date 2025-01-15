# Error Handling & Edge Cases Documentation

## Error Categories

### 1. Validation Errors
```typescript
// Input Validation
const inputValidation = {
  order: {
    minItems: 1,
    maxItems: 50,
    minAmount: 35, // Minimum order amount (₱)
    maxAmount: 10000 // Maximum order amount (₱)
  },
  payment: {
    screenshot: {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
    },
    referenceNumber: {
      pattern: /^[0-9]{10,15}$/ // GCash reference number pattern
    }
  }
};

// Validation Error Responses
const validationErrors = {
  ORDER_EMPTY: 'Order must contain at least one item',
  ORDER_TOO_LARGE: 'Order exceeds maximum allowed items',
  AMOUNT_TOO_LOW: 'Order amount is below minimum required',
  AMOUNT_TOO_HIGH: 'Order amount exceeds maximum allowed',
  INVALID_REFERENCE: 'Invalid GCash reference number format',
  INVALID_SCREENSHOT: 'Invalid screenshot format or size'
};
```

### 2. Business Logic Errors
```typescript
// Business Rules
const businessRules = {
  orderHours: {
    start: '08:00',
    end: '22:00',
    timezone: 'Asia/Manila'
  },
  paymentVerification: {
    maxAttempts: 3,
    timeoutMinutes: 30
  },
  inventory: {
    lowStockThreshold: 10,
    outOfStockBehavior: 'DISABLE_ITEM'
  }
};

// Business Error Responses
const businessErrors = {
  OUTSIDE_HOURS: 'Orders can only be placed during business hours',
  PAYMENT_TIMEOUT: 'Payment verification timeout exceeded',
  ITEM_UNAVAILABLE: 'One or more items are no longer available',
  PRICE_CHANGED: 'Item prices have been updated'
};
```

### 3. System Errors
```typescript
// System Error Types
const systemErrors = {
  DATABASE_ERROR: 'Database operation failed',
  STORAGE_ERROR: 'File storage operation failed',
  NETWORK_ERROR: 'Network request failed',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded'
};

// Error Recovery Strategies
const errorRecovery = {
  database: {
    maxRetries: 3,
    backoffMs: 1000
  },
  storage: {
    maxRetries: 2,
    backoffMs: 2000
  },
  network: {
    maxRetries: 2,
    timeoutMs: 5000
  }
};
```

## Edge Cases Handling

### 1. Order Processing
```typescript
// Order Edge Cases
const orderEdgeCases = {
  // Concurrent Order Processing
  handleConcurrentOrders: async (orderId: string) => {
    await prisma.$transaction(async (tx) => {
      // Lock order for processing
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: { id: true, status: true },
        forUpdate: true
      });

      // Verify stock availability
      const stockAvailable = await verifyStock(tx, order.items);
      if (!stockAvailable) {
        throw new Error(businessErrors.ITEM_UNAVAILABLE);
      }

      // Update stock and process order
      await updateStock(tx, order.items);
      await processOrder(tx, order);
    });
  },

  // Partial Order Fulfillment
  handlePartialFulfillment: async (orderId: string, availableItems: string[]) => {
    // Notify user of partial fulfillment
    // Offer options: proceed with available items, cancel, or modify order
  }
};
```

### 2. Payment Processing
```typescript
// Payment Edge Cases
const paymentEdgeCases = {
  // Duplicate Payment Detection
  handleDuplicatePayment: async (payment: Payment) => {
    const existing = await prisma.payment.findFirst({
      where: {
        orderId: payment.orderId,
        referenceNumber: payment.referenceNumber,
        status: { in: ['pending', 'verified'] }
      }
    });

    if (existing) {
      throw new Error('Duplicate payment detected');
    }
  },

  // Payment Timeout
  handlePaymentTimeout: async (orderId: string) => {
    const timeoutMinutes = businessRules.paymentVerification.timeoutMinutes;

    await prisma.order.update({
      where: {
        id: orderId,
        status: 'pending',
        createdAt: {
          lt: new Date(Date.now() - timeoutMinutes * 60000)
        }
      },
      data: {
        status: 'cancelled',
        cancellationReason: 'PAYMENT_TIMEOUT'
      }
    });
  }
};
```

### 3. Inventory Management
```typescript
// Inventory Edge Cases
const inventoryEdgeCases = {
  // Race Condition Prevention
  handleStockUpdate: async (productId: string, quantity: number) => {
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { id: true, stock: true },
        forUpdate: true
      });

      if (product.stock < quantity) {
        throw new Error('Insufficient stock');
      }

      await tx.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity } }
      });
    });
  },

  // Low Stock Notification
  handleLowStock: async (productId: string) => {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (product.stock <= businessRules.inventory.lowStockThreshold) {
      await notifyAdmin({
        type: 'LOW_STOCK',
        productId,
        currentStock: product.stock
      });
    }
  }
};
```

## Error Recovery Procedures

### 1. Transaction Rollback
```typescript
// Transaction Rollback Strategy
const transactionRollback = {
  order: async (orderId: string) => {
    await prisma.$transaction(async (tx) => {
      // Restore inventory
      await restoreInventory(tx, orderId);
      // Cancel order
      await cancelOrder(tx, orderId);
      // Refund payment if applicable
      await handleRefund(tx, orderId);
    });
  }
};
```

### 2. Data Consistency Checks
```typescript
// Data Consistency Verification
const consistencyChecks = {
  verifyOrderTotal: async (orderId: string) => {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    const calculatedTotal = calculateOrderTotal(order.items);
    if (order.totalAmount !== calculatedTotal) {
      await handleTotalMismatch(order);
    }
  }
};
```

### 3. Automatic Retry Logic
```typescript
// Retry Strategy Implementation
const retryLogic = {
  withRetry: async (operation: () => Promise<any>, config: RetryConfig) => {
    let lastError;
    for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (attempt < config.maxRetries) {
          await sleep(config.backoffMs * attempt);
          continue;
        }
      }
    }
    throw lastError;
  }
};
```
