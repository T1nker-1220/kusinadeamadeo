# Database Schema Implementation - January 2024

## Overview
This document details the implementation of the core database schema for Kusina de Amadeo using Prisma with Supabase PostgreSQL.

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
  // Relations
  orders      Order[]
  payments    Payment[]
}
```
- Primary user model for both customers and admins
- Role-based access control using UserRole enum
- Indexed fields: email, role
- Tracks order history and payment verifications

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
  // Relations
  products    Product[]
}
```
- Product category management
- Sortable categories using sortOrder
- Unique category names
- Image storage support

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
  // Relations
  category     Category         @relation(fields: [categoryId], references: [id])
  variants     ProductVariant[]
  orderItems   OrderItem[]
}
```
- Core product information
- Category relationship
- Support for variants and add-ons
- Availability tracking

### Order System Models

#### Order
```prisma
model Order {
  id            String        @id @default(uuid())
  userId        String
  receiptId     String        @unique // AE20 format
  status        OrderStatus   @default(PENDING)
  paymentMethod PaymentMethod
  paymentStatus PaymentStatus @default(PENDING)
  totalAmount   Float
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  // Relations
  user          User          @relation(fields: [userId], references: [id])
  items         OrderItem[]
  payment       Payment?
}
```
- Comprehensive order tracking
- Unique receipt ID system (AE20 format)
- Multiple status tracking (order and payment)
- Full payment integration

#### OrderItem & OrderItemAddon
- Detailed order item tracking
- Support for variants and add-ons
- Price and quantity tracking
- Subtotal calculations

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
  createdAt            DateTime       @default(now())
  updatedAt            DateTime       @updatedAt
  // Relations
  order                Order         @relation(fields: [orderId], references: [id])
  verifier             User?         @relation(fields: [verifiedBy], references: [id])
}
```
- Complete payment tracking
- Support for GCash and Cash payments
- Payment verification system
- Audit trail for verifications

## Enums

### UserRole
- ADMIN: Full system access
- CUSTOMER: Limited access to ordering features

### OrderStatus
- PENDING: Initial order state
- CONFIRMED: Order verified and processing
- COMPLETED: Order fulfilled
- CANCELLED: Order cancelled

### PaymentStatus
- PENDING: Awaiting verification
- VERIFIED: Payment confirmed
- REJECTED: Payment rejected

### PaymentMethod
- GCASH: Online payment via GCash
- CASH: Cash payment on pickup

### VariantType
- SIZE: Size variations (e.g., for beverages)
- FLAVOR: Flavor variations

## Performance Optimizations

### Indexes
- User: email, role
- Category: sortOrder
- Product: categoryId, isAvailable
- Order: userId, status, paymentStatus, createdAt
- Payment: status, referenceNumber

### Relations
- All relations properly defined with foreign keys
- Cascading deletes where appropriate
- Optional relations handled properly

## Type Safety
- Full TypeScript integration
- Generated types for all models
- Type-safe query building
- Strict enum typing

## Future Considerations
1. **Scalability**
   - Indexed fields for common queries
   - Efficient relationship structure
   - Support for future features

2. **Maintenance**
   - Clear model separation
   - Comprehensive documentation
   - Easy schema evolution

3. **Security**
   - Role-based access
   - Payment verification system
   - Audit trails

4. **Performance**
   - Strategic indexing
   - Optimized relationships
   - Query-friendly structure
