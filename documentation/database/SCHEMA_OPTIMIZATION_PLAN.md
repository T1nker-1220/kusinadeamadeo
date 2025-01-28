# Database Schema Optimization Plan

## Current State Analysis
✅ Existing Structure:
- Products table with 27 entries
- Product variants with FLAVOR and SIZE types
- Local image storage for products and categories
- Basic relationships established

❌ Issues Identified:
1. Images stored locally instead of Supabase storage
2. Some variant images missing (NULL values)
3. Storage buckets exist but are empty
4. Image paths need updating after migration

## Phase 1: Storage Migration

### 1.1 Storage Setup
- [ ] Configure Supabase storage policies
  ```sql
  CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'products' OR bucket_id = 'categories');

  CREATE POLICY "Admin Insert" ON storage.objects
    FOR INSERT WITH CHECK (auth.role() = 'admin');
  ```
- [ ] Create directory structure:
  - /products/{productId}/main.png
  - /products/{productId}/variants/{variantId}.png
  - /categories/{categoryId}.png

### 1.2 Image Migration
- [ ] Create migration script for products:
  ```typescript
  // Migration steps
  1. Upload product images to Supabase storage
  2. Update product table with new URLs
  3. Verify image accessibility
  4. Keep local images until verification
  ```
- [ ] Create migration script for variants:
  ```typescript
  // Migration steps
  1. Upload variant images to Supabase storage
  2. Update variant table with new URLs
  3. Handle NULL image cases
  4. Verify all variant images
  ```

## Phase 2: Schema Enhancement

### 2.1 Products Table Optimization
```sql
ALTER TABLE products
ADD COLUMN image_url TEXT,
ADD COLUMN stock INTEGER DEFAULT 0,
ADD COLUMN is_available BOOLEAN DEFAULT true,
ADD COLUMN metadata JSONB DEFAULT '{}',
ADD CONSTRAINT valid_price CHECK (base_price >= 0);
```

### 2.2 Variants Table Optimization
```sql
ALTER TABLE product_variants
ADD COLUMN stock INTEGER DEFAULT 0,
ADD COLUMN is_available BOOLEAN DEFAULT true,
ADD COLUMN sort_order INTEGER,
ADD COLUMN metadata JSONB DEFAULT '{}',
ADD CONSTRAINT valid_price CHECK (price >= 0),
ADD CONSTRAINT valid_stock CHECK (stock >= 0);
```

### 2.3 Add Indexes
```sql
-- For faster variant lookups
CREATE INDEX idx_product_variants_product_id
ON product_variants(product_id);

-- For category filtering
CREATE INDEX idx_products_category_id
ON products(category_id);

-- For availability filtering
CREATE INDEX idx_products_availability
ON products(is_available);
```

## Phase 3: Data Validation

### 3.1 Data Integrity Checks
```sql
-- Check for orphaned variants
SELECT pv.* FROM product_variants pv
LEFT JOIN products p ON p.id = pv.product_id
WHERE p.id IS NULL;

-- Check for invalid prices
SELECT * FROM products WHERE base_price < 0;
SELECT * FROM product_variants WHERE price < 0;

-- Check for missing images
SELECT * FROM products WHERE image_url IS NULL;
SELECT * FROM product_variants WHERE image_url IS NULL;
```

### 3.2 RLS Policies
```sql
-- Products table policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Admin full access"
  ON products FOR ALL
  USING (auth.role() = 'admin');

-- Similar policies for variants table
```

## Phase 4: Performance Optimization

### 4.1 Query Optimization
- [ ] Add composite indexes for common queries
- [ ] Implement caching strategy
- [ ] Optimize JOIN operations
- [ ] Add materialized views if needed

### 4.2 Monitoring Setup
- [ ] Set up query performance monitoring
- [ ] Configure storage usage alerts
- [ ] Implement error tracking
- [ ] Add performance dashboards

## Implementation Steps

1. Backup Current Data
```bash
# Backup steps
1. Export all current data
2. Take snapshot of local images
3. Document current schema
4. Create rollback plan
```

2. Storage Migration
```bash
# Migration sequence
1. Set up storage buckets
2. Upload images
3. Update database records
4. Verify migrations
```

3. Schema Updates
```bash
# Update sequence
1. Apply schema changes
2. Update indexes
3. Verify constraints
4. Test queries
```

4. Validation
```bash
# Validation steps
1. Run integrity checks
2. Verify image access
3. Test performance
4. Document changes
```

## Success Criteria
1. All images migrated to Supabase storage
2. Zero NULL image URLs (unless intentional)
3. All constraints passing
4. Improved query performance
5. Complete data integrity
6. Working image access
7. Proper error handling

## Rollback Plan
```bash
# Rollback steps if needed
1. Restore database backup
2. Revert schema changes
3. Return to local images
4. Document issues
```

## Future Considerations
1. Image optimization pipeline
2. CDN integration
3. Backup automation
4. Performance monitoring
5. Auto-scaling storage
6. Cache invalidation
7. Disaster recovery
```
