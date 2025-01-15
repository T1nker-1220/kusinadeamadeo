# Database Setup Guide

## Prerequisites
- Node.js 18+ installed
- pnpm package manager
- Supabase account and project
- PostgreSQL database (provided by Supabase)

## Environment Setup

1. **Configure Environment Variables**
```env
# Supabase Database Configuration
DATABASE_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Supabase Project Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

2. **Install Dependencies**
```bash
# Install Prisma and its dependencies
pnpm add -D prisma
pnpm add @prisma/client

# Initialize Prisma
pnpm prisma init
```

## Database Schema

1. **Core Models**
- User: Authentication and profile management
- Category: Product categorization
- Product: Core product information
- ProductVariant: Size and flavor variations
- GlobalAddon: Reusable add-ons
- Order: Order management
- Payment: Payment processing

2. **Schema Location**
- Main schema file: `prisma/schema.prisma`
- Migration files: `prisma/migrations/`

## Development Workflow

1. **Making Schema Changes**
```bash
# After modifying schema.prisma
pnpm prisma format  # Format the schema file
pnpm prisma validate  # Validate changes
pnpm prisma migrate dev --name [migration_name]  # Create migration
```

2. **Generating Types**
```bash
# After schema changes or migrations
pnpm prisma generate  # Update Prisma Client
```

3. **Database Reset (Development)**
```bash
pnpm prisma migrate reset  # Reset database (CAUTION: Deletes all data)
```

## Using Prisma Client

1. **Singleton Implementation**
```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

2. **Type-Safe Queries**
```typescript
// Example usage
import { prisma } from '@/lib/prisma'

// Create user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    fullName: 'John Doe',
    phoneNumber: '+1234567890',
    address: '123 Main St'
  }
})

// Find user with orders
const userWithOrders = await prisma.user.findUnique({
  where: { id: userId },
  include: { orders: true }
})
```

## Type Definitions

1. **Location**
- Type definitions: `src/types/database.ts`
- Generated types: `node_modules/.prisma/client/index.d.ts`

2. **Usage**
```typescript
import type { User, Order, Product } from '@/types/database'

async function getUserOrders(userId: string): Promise<Order[]> {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
          addons: true
        }
      }
    }
  })
}
```

## Performance Considerations

1. **Indexes**
- Implemented on frequently queried fields
- Composite indexes for common query patterns
- Consider query patterns when adding new indexes

2. **Relations**
- Use appropriate inclusion levels
- Avoid over-fetching data
- Consider using select to limit returned fields

## Security Implementation

1. **Row Level Security**
```sql
-- Example RLS policy for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can only view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);
```

2. **Data Validation**
- Implement Zod schemas for input validation
- Use Prisma's built-in validation
- Add custom validation where needed

## Maintenance

1. **Regular Tasks**
- Monitor query performance
- Update indexes as needed
- Review and optimize relations
- Keep schema documentation updated

2. **Backup Strategy**
- Regular database backups
- Migration history maintenance
- Production deployment planning

## Troubleshooting

1. **Common Issues**
- Migration conflicts
- Type generation errors
- Connection issues
- Query performance problems

2. **Solutions**
- Check migration history
- Regenerate Prisma Client
- Verify environment variables
- Review query patterns

## Next Steps

1. **Implementation**
- Complete authentication system
- Set up API routes
- Implement CRUD operations
- Add data validation

2. **Security**
- Configure RLS policies
- Implement rate limiting
- Set up error handling
- Add request validation
