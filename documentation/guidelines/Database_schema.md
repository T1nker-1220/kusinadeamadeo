# Kusina de Amadeo - Database Schema Documentation

## Table Structure

### Order
- `id` (uuid, primary key)
- `userId` (uuid, foreign key)
- `receiptId` (text)
- `paymentMethod` (PaymentMethod)
- `totalAmount` (float8)
- `updatedAt` (timestamp)
- `status` (OrderStatus)
- `paymentStatus` (PaymentStatus)
- `createdAt` (timestamp)

### Product
- `id` (uuid, primary key)
- `categoryId` (uuid, foreign key)
- `name` (text)
- `description` (text)
- `basePrice` (float8)
- `imageUrl` (text)
- `updatedAt` (timestamp)
- `isAvailable` (bool)
- `allowsAddons` (bool)
- `createdAt` (timestamp)

### User
- `id` (uuid, primary key)
- `email` (text)
- `fullName` (text)
- `phoneNumber` (text)
- `address` (text)
- `updatedAt` (timestamp)
- `role` (UserRole)
- `createdAt` (timestamp)

### Category
- `id` (uuid, primary key)
- `name` (text)
- `description` (text)
- `imageUrl` (text)
- `sortOrder` (int4)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### GlobalAddon
- `id` (uuid, primary key)
- `name` (text)
- `price` (float8)
- `updatedAt` (timestamp)
- `isAvailable` (bool)
- `createdAt` (timestamp)

### OrderItem
- `id` (uuid, primary key)
- `orderId` (uuid, foreign key)
- `productId` (uuid, foreign key)
- `quantity` (int4)
- `price` (float8)
- `productVariantId` (uuid, foreign key)
- `updatedAt` (timestamp)
- `createdAt` (timestamp)

### OrderItemAddon
- `id` (uuid, primary key)
- `orderItemId` (uuid, foreign key)
- `addonId` (uuid, foreign key)
- `quantity` (int4)
- `unitPrice` (float8)
- `subtotal` (float8)

### ProductVariant
- `id` (uuid, primary key)
- `productId` (uuid, foreign key)
- `type` (VariantType)
- `name` (text)
- `price` (float8)
- `imageUrl` (text)
- `updatedAt` (timestamp)
- `createdAt` (timestamp)

## Enumerated Types

### UserRole
- `ADMIN`
- `CUSTOMER`

### OrderStatus
- `PENDING`
- `CONFIRMED`
- `COMPLETED`
- `CANCELLED`

### PaymentStatus
- `PENDING`
- `VERIFIED`
- `REJECTED`

### PaymentMethod
- `GCASH`
- `CASH`

### VariantType
- `SIZE`
- `FLAVOR`

## Relationships

1. Order
   - Belongs to one User
   - Has many OrderItems
   - Has one Payment

2. Product
   - Belongs to one Category
   - Has many ProductVariants
   - Has many OrderItems

3. Category
   - Has many Products
   - Independent entity

4. OrderItem
   - Belongs to one Order
   - Belongs to one Product
   - Has many OrderItemAddons
   - Belongs to one ProductVariant (optional)

5. GlobalAddon
   - Has many OrderItemAddons
   - Independent entity

6. User
   - Has many Orders
   - Independent entity

## Notes for Developers

1. **Table Naming**
   - All tables use PascalCase naming
   - Follow Supabase naming conventions
   - Maintain consistency in column naming

2. **Data Types**
   - Use appropriate PostgreSQL types
   - Timestamps include timezone information
   - UUIDs for all primary keys

3. **Relationships**
   - Implement proper foreign key constraints
   - Maintain referential integrity
   - Use cascade delete where appropriate

4. **Indexes**
   - Primary keys are automatically indexed
   - Foreign keys should be indexed
   - Consider additional indexes for frequent queries

5. **RLS Policies**
   - Implement row-level security
   - Consider user roles in policies
   - Maintain strict access control
