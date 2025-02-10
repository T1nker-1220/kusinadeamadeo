# Database Schema Design

## Overview
Comprehensive documentation of the database schema for Kusina de Amadeo, including tables, relationships, and design decisions.

## Core Enums

```sql
-- User Roles
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CUSTOMER');

-- Order Status
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- Payment Status
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- Payment Method
CREATE TYPE "PaymentMethod" AS ENUM ('GCASH', 'CASH');

-- Variant Type
CREATE TYPE "VariantType" AS ENUM ('SIZE', 'FLAVOR');
```

## Table Schemas

### 1. User Table
```sql
CREATE TABLE "User" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");
```

### 2. Category Table
```sql
CREATE TABLE "Category" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT UNIQUE NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX "Category_sortOrder_idx" ON "Category"("sortOrder");
```

### 3. Product Table
```sql
CREATE TABLE "Product" (
    "id" TEXT PRIMARY KEY,
    "categoryId" TEXT NOT NULL REFERENCES "Category"("id"),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "allowsAddons" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "Product_isAvailable_idx" ON "Product"("isAvailable");
CREATE INDEX "Product_basePrice_idx" ON "Product"("basePrice");
```

### 4. Product Variant Table
```sql
CREATE TABLE "ProductVariant" (
    "id" TEXT PRIMARY KEY,
    "productId" TEXT NOT NULL REFERENCES "Product"("id"),
    "type" "VariantType" NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");
CREATE INDEX "ProductVariant_type_idx" ON "ProductVariant"("type");
CREATE INDEX "ProductVariant_price_idx" ON "ProductVariant"("price");
CREATE INDEX "product_variants_stock_idx" ON "ProductVariant"("stock");
CREATE INDEX "product_variants_isAvailable_idx" ON "ProductVariant"("isAvailable");
```

### 5. Global Addon Table
```sql
CREATE TABLE "GlobalAddon" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX "GlobalAddon_isAvailable_idx" ON "GlobalAddon"("isAvailable");
CREATE INDEX "GlobalAddon_price_idx" ON "GlobalAddon"("price");
```

### 6. Order Table
```sql
CREATE TABLE "Order" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id"),
    "receiptId" TEXT UNIQUE NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Order_paymentStatus_idx" ON "Order"("paymentStatus");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
CREATE INDEX "Order_receiptId_idx" ON "Order"("receiptId");
```

### 7. Order Item Table
```sql
CREATE TABLE "OrderItem" (
    "id" TEXT PRIMARY KEY,
    "orderId" TEXT NOT NULL REFERENCES "Order"("id"),
    "productId" TEXT NOT NULL REFERENCES "Product"("id"),
    "productVariantId" TEXT REFERENCES "ProductVariant"("id"),
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");
```

### 8. Order Item Addon Table
```sql
CREATE TABLE "OrderItemAddon" (
    "id" TEXT PRIMARY KEY,
    "orderItemId" TEXT NOT NULL REFERENCES "OrderItem"("id"),
    "addonId" TEXT NOT NULL REFERENCES "GlobalAddon"("id"),
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL
);

-- Indexes
CREATE INDEX "OrderItemAddon_orderItemId_idx" ON "OrderItemAddon"("orderItemId");
CREATE INDEX "OrderItemAddon_addonId_idx" ON "OrderItemAddon"("addonId");
```

### 9. Payment Table
```sql
CREATE TABLE "Payment" (
    "id" TEXT PRIMARY KEY,
    "orderId" TEXT UNIQUE NOT NULL REFERENCES "Order"("id"),
    "amount" DOUBLE PRECISION NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "referenceNumber" TEXT,
    "screenshotUrl" TEXT,
    "verifiedBy" TEXT REFERENCES "User"("id"),
    "verificationTimestamp" TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX "Payment_status_idx" ON "Payment"("status");
CREATE INDEX "Payment_method_idx" ON "Payment"("method");
CREATE INDEX "Payment_referenceNumber_idx" ON "Payment"("referenceNumber");
CREATE INDEX "Payment_verifiedBy_idx" ON "Payment"("verifiedBy");
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");
```

## Entity Relationships

### 1. Core Relationships
- User -> Order (1:N)
- Category -> Product (1:N)
- Product -> ProductVariant (1:N)
- Order -> OrderItem (1:N)
- OrderItem -> OrderItemAddon (1:N)
- Order -> Payment (1:1)

### 2. Validation Rules
- Product prices must be non-negative
- Order quantities must be positive
- Receipt IDs must be unique
- Payment amounts must match order totals
- Stock levels must be non-negative

## Performance Optimizations

### 1. Indexing Strategy
- Primary lookup fields indexed
- Common filter fields indexed
- Join fields indexed
- Sort fields indexed

### 2. Data Types
- TEXT for IDs (UUID compatibility)
- TIMESTAMP for dates
- DOUBLE PRECISION for prices
- INTEGER for quantities
- BOOLEAN for flags

## Storage Considerations

### 1. Image Storage
- Product images stored in Supabase Storage
- Payment screenshots stored in Supabase Storage
- URLs stored in database
- Image optimization handled by Supabase

### 2. Data Growth
- Regular monitoring of table sizes
- Index maintenance plan
- Archival strategy for old orders
- Backup procedures

## Version Information
- Last Updated: January 2024
- Schema Version: 1.0.0
- Status: Production Ready
- Next Review: Pre-Phase 2
