# Database Schema Optimization Plan

## Version Control
- Current Version: 1.1.6
- Last Updated: 2024-01-29
- Status: Phase 2 Complete, Phase 4 In Progress

## Current State Analysis
✅ Completed:
- Products table with optimized structure
- Supabase storage integration
- Basic RLS policies
- Core indexes implementation
- Image migration to Supabase
- Variant system core implementation
- Stock management system
- Availability controls
- Performance indexes
- Image management system
- Form interaction improvements
- Storage cleanup system
- Error prevention mechanisms

🔄 In Progress:
- Advanced variant features
- Add-ons schema implementation
- Order system enhancements
- User profile extensions
- Performance optimization

## Phase 1: Storage Migration (✅ COMPLETED)

### 1.1 Storage Setup (✅ COMPLETED)
- [x] Supabase storage policies implemented
- [x] Directory structure created
- [x] Access controls configured
- [x] Backup system established

### 1.2 Image Migration (✅ COMPLETED)
- [x] Product images migrated
- [x] Category images migrated
- [x] URLs updated in database
- [x] Verification completed

## Phase 2: Schema Enhancement (✅ 85% Complete)

### 2.1 Products Table Optimization (✅ COMPLETED)
```sql
-- Existing optimizations implemented
ALTER TABLE products
ADD COLUMN image_url TEXT,
ADD COLUMN stock INTEGER DEFAULT 0,
ADD COLUMN is_available BOOLEAN DEFAULT true,
ADD COLUMN metadata JSONB DEFAULT '{}',
ADD CONSTRAINT valid_price CHECK (base_price >= 0);
```

### 2.2 Variants System (✅ 70% Complete)
```sql
-- Implemented variant system schema
CREATE TABLE "ProductVariant" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES "Product"(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    CONSTRAINT valid_price CHECK (price >= 0),
    CONSTRAINT valid_stock CHECK (stock >= 0)
);

-- Performance indexes
CREATE INDEX idx_product_variants_product_id ON "ProductVariant"(product_id);
CREATE INDEX idx_product_variants_type ON "ProductVariant"(type);
CREATE INDEX idx_product_variants_stock ON "ProductVariant"(stock);
CREATE INDEX idx_product_variants_is_available ON "ProductVariant"(is_available);

-- RLS Policies
ALTER TABLE "ProductVariant" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for variants"
  ON "ProductVariant"
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin full access for variants"
  ON "ProductVariant"
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "User"
      WHERE "User".id::text = auth.uid()::text
      AND "User".role = 'ADMIN'
    )
  );
```

### 2.3 Add-ons System (🔄 30% Complete)
```sql
-- Add-ons table structure
CREATE TABLE product_addons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category_id UUID REFERENCES categories(id),
    is_available BOOLEAN DEFAULT true,
    sort_order INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Add-ons relationship table
CREATE TABLE product_addon_availability (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    addon_id UUID REFERENCES product_addons(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, addon_id)
);
```

### 2.4 Order System Enhancement (🔄 75% Complete)
```sql
-- Order status enum
CREATE TYPE order_status AS ENUM (
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'completed',
    'cancelled'
);

-- Orders table enhancement
ALTER TABLE orders
ADD COLUMN status order_status DEFAULT 'pending',
ADD COLUMN payment_status VARCHAR(50),
ADD COLUMN delivery_type VARCHAR(50),
ADD COLUMN metadata JSONB DEFAULT '{}';
```

### 2.5 Image Management Enhancement (✅ COMPLETED)
```sql
-- Enhanced variant image handling
ALTER TABLE "ProductVariant"
ADD CONSTRAINT valid_image_url CHECK (
    image_url IS NULL OR
    image_url ~ '^https?://.*\.(png|jpg|jpeg|webp)$'
);

-- Improved tracking for image operations
CREATE TABLE "ImageOperationLog" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    operation_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Index for faster image operation lookups
CREATE INDEX idx_image_operations_entity ON "ImageOperationLog"(entity_type, entity_id);
```

## Phase 3: Data Validation (✅ COMPLETED)

### 3.1 Data Integrity (✅ COMPLETED)
- [x] Orphaned records check
- [x] Price validation
- [x] Image URL verification
- [x] Relationship integrity
- [x] Stock validation
- [x] Availability status checks

### 3.2 RLS Policies (✅ COMPLETED)
```sql
-- Implemented policies for:
-- - Products
-- - Categories
-- - Orders
-- - User profiles
-- - Variants
-- - Add-ons
```

## Phase 4: Performance Optimization (🔄 60% Complete)

### 4.1 Query Optimization
- [x] Basic indexes
- [x] Common query optimization
- [x] Variant-specific indexes
- [x] Image operation tracking
- [ ] Advanced indexing strategy
- [ ] Materialized views

### 4.2 Monitoring
- [x] Basic performance tracking
- [x] Storage monitoring
- [x] Stock level tracking
- [x] Image operation monitoring
- [ ] Advanced metrics
- [ ] Automated alerts

## Implementation Priority

1. Complete Performance Optimization
   - Query performance tuning
   - Storage optimization
   - Cache implementation
   - Monitoring enhancement

2. Implement Add-ons System
3. Enhance Order System
4. Extend User Profiles
5. Advanced Variant Features

## Success Metrics
- Query performance < 100ms
- Zero orphaned records
- 100% data integrity
- All constraints active
- Complete audit logs
- Proper error handling
- Stock accuracy 100%
- Real-time availability updates
- Image operations success rate > 99%
- Form interaction success rate > 99%

## Rollback Procedures
1. Automated backups in place
2. Point-in-time recovery ready
3. Migration rollback scripts prepared
4. Emergency procedures documented

## Next Steps
1. Implement bulk stock updates
2. Add stock alerts system
3. Implement sales tracking
4. Deploy monitoring system
5. Optimize query performance

## Recent Achievements
1. Enhanced image management system
2. Improved form interactions
3. Storage cleanup implementation
4. Error prevention mechanisms
5. Performance optimization progress
6. Enhanced monitoring capabilities
