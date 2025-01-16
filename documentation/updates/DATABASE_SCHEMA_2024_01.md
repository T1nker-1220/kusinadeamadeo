# Database Schema Documentation - January 2024

## Overview
This document details the complete database schema implementation for Kusina de Amadeo, including all models, relationships, indexes, and enums.

## Core Models

### User Model
```prisma
model User {
  id          String    @id @default(uuid())
  email       String    @unique
  fullName    String
  phoneNumber String
  address     String
  role        UserRole  @default(CUSTOMER)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  orders      Order[]
  payments    Payment[] @relation("PaymentVerifier")

  @@index([email])
  @@index([role])
}
```

### Category Model
```prisma
model Category {
  id          String    @id @default(uuid())
  name        String    @unique
  description String
  imageUrl    String
  sortOrder   Int
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  products    Product[]

  @@index([sortOrder])
}
```

### Product Model
```prisma
model Product {
  id           String           @id @default(uuid())
  categoryId   String
  name         String
  description  String
  basePrice    Float
  imageUrl     String
  isAvailable  Boolean          @default(true)
  allowsAddons Boolean          @default(false)
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt
  orderItems   OrderItem[]
  category     Category         @relation(fields: [categoryId], references: [id])
  variants     ProductVariant[]

  @@index([categoryId])
  @@index([isAvailable])
  @@index([basePrice])
}
```

### ProductVariant Model
```prisma
model ProductVariant {
  id         String      @id @default(uuid())
  productId  String
  type       VariantType
  name       String
  price      Float
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  orderItems OrderItem[]
  product    Product     @relation(fields: [productId], references: [id])

  @@index([productId])
  @@index([type])
  @@index([price])
}
```

### GlobalAddon Model
```prisma
model GlobalAddon {
  id          String           @id @default(uuid())
  name        String
  price       Float
  isAvailable Boolean          @default(true)
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  orderItems  OrderItemAddon[]

  @@index([isAvailable])
  @@index([price])
}
```

### Order Model
```prisma
model Order {
  id            String        @id @default(uuid())
  userId        String
  receiptId     String        @unique
  status        OrderStatus   @default(PENDING)
  paymentMethod PaymentMethod
  paymentStatus PaymentStatus @default(PENDING)
  totalAmount   Float
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  user          User          @relation(fields: [userId], references: [id])
  items         OrderItem[]
  payment       Payment?

  @@index([userId])
  @@index([status])
  @@index([paymentStatus])
  @@index([createdAt])
  @@index([receiptId])
}
```

### OrderItem Model
```prisma
model OrderItem {
  id               String           @id @default(uuid())
  orderId          String
  productId        String
  quantity         Int
  createdAt        DateTime         @default(now())
  price            Float
  productVariantId String?
  updatedAt        DateTime         @updatedAt
  order            Order            @relation(fields: [orderId], references: [id])
  product          Product          @relation(fields: [productId], references: [id])
  ProductVariant   ProductVariant?  @relation(fields: [productVariantId], references: [id])
  OrderItemAddon   OrderItemAddon[]

  @@index([orderId])
  @@index([productId])
}
```

### OrderItemAddon Model
```prisma
model OrderItemAddon {
  id          String      @id @default(uuid())
  orderItemId String
  addonId     String
  quantity    Int
  unitPrice   Float
  subtotal    Float
  addon       GlobalAddon @relation(fields: [addonId], references: [id])
  orderItem   OrderItem   @relation(fields: [orderItemId], references: [id])

  @@index([orderItemId])
  @@index([addonId])
}
```

### Payment Model
```prisma
model Payment {
  id                    String        @id @default(uuid())
  orderId               String        @unique
  amount                Float
  method                PaymentMethod
  status                PaymentStatus @default(PENDING)
  referenceNumber       String?
  screenshotUrl         String?
  verifiedBy            String?
  verificationTimestamp DateTime?
  notes                 String?
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt
  order                 Order         @relation(fields: [orderId], references: [id])
  verifier              User?         @relation("PaymentVerifier", fields: [verifiedBy], references: [id])

  @@index([status])
  @@index([method])
  @@index([referenceNumber])
  @@index([verifiedBy])
  @@index([createdAt])
}
```

## Enums

### UserRole
```prisma
enum UserRole {
  ADMIN
  CUSTOMER
}
```

### OrderStatus
```prisma
enum OrderStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}
```

### PaymentStatus
```prisma
enum PaymentStatus {
  PENDING
  VERIFIED
  REJECTED
}
```

### PaymentMethod
```prisma
enum PaymentMethod {
  GCASH
  CASH
}
```

### VariantType
```prisma
enum VariantType {
  SIZE
  FLAVOR
}
```

## Performance Optimizations

### Strategic Indexing
- User lookups by email and role
- Category sorting by order
- Product filtering by availability and price
- Order tracking by status and dates
- Payment verification by status and reference

### Relationship Optimization
- Proper foreign key constraints
- Indexed relationship fields
- Optimized query patterns
- Efficient join operations

### Query Performance
- Composite indexes for common queries
- Optimized field ordering
- Strategic denormalization
- Efficient data access patterns

## Security Implementation

### Data Protection
- UUID primary keys
- Role-based access control
- Secure payment handling
- Audit trail timestamps

### RLS Policies
- User data isolation
- Order access control
- Payment verification rules
- Public read access for products

## Future Considerations

### Scalability
1. **Data Growth**
   - Indexed fields for scaling
   - Efficient query patterns
   - Performance monitoring
   - Backup strategies

2. **Feature Expansion**
   - Extensible schema design
   - Flexible relationships
   - Future-proof enums
   - Version control

### Maintenance
1. **Regular Tasks**
   - Index optimization
   - Query monitoring
   - Data cleanup
   - Performance tuning

2. **Documentation**
   - Schema updates
   - Index changes
   - Policy modifications
   - Performance notes

## Version Control
- Last Updated: January 16, 2024
- Schema Version: 1.0.0
- Status: Production Ready
- Next Review: Pre-Phase 2
