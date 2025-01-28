# Schema Changes Documentation

## Overview

This document details all schema changes implemented during the migration process. These changes are designed to optimize the database structure, improve performance, and enhance data integrity.

## New Functions

### 1. Utility Functions

```sql
-- SQL execution function
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void AS $$
BEGIN
    EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schema validation function
CREATE OR REPLACE FUNCTION validate_schema()
RETURNS json AS $$
-- Function implementation details in setup-migration.sql
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Orphaned variants check
CREATE OR REPLACE FUNCTION check_orphaned_variants()
RETURNS TABLE (variant_id UUID, product_id UUID) AS $$
-- Function implementation details in setup-migration.sql
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Trigger Functions

```sql
-- Update modified timestamp
CREATE OR REPLACE FUNCTION update_product_modified()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update product stock
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET stock = (
        SELECT COALESCE(SUM(stock), 0)
        FROM product_variants
        WHERE product_id = NEW.product_id
    )
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Table Modifications

### 1. Products Table

```sql
ALTER TABLE products
ADD COLUMN image_url TEXT,
ADD COLUMN stock INTEGER DEFAULT 0,
ADD COLUMN is_available BOOLEAN DEFAULT true,
ADD COLUMN metadata JSONB DEFAULT '{}',
ADD CONSTRAINT valid_price CHECK (base_price >= 0);
```

### 2. Product Variants Table

```sql
ALTER TABLE product_variants
ADD COLUMN stock INTEGER DEFAULT 0,
ADD COLUMN is_available BOOLEAN DEFAULT true,
ADD COLUMN sort_order INTEGER,
ADD COLUMN metadata JSONB DEFAULT '{}',
ADD CONSTRAINT valid_price CHECK (price >= 0),
ADD CONSTRAINT valid_stock CHECK (stock >= 0);
```

## Indexes

```sql
-- Product variants lookup
CREATE INDEX idx_product_variants_product_id
ON product_variants(product_id);

-- Category filtering
CREATE INDEX idx_products_category_id
ON products(category_id);

-- Availability filtering
CREATE INDEX idx_products_availability
ON products(is_available);

-- Combined indexes
CREATE INDEX idx_products_category_availability
ON products(category_id, is_available);

CREATE INDEX idx_variants_product_availability
ON product_variants(product_id, is_available);
```

## RLS Policies

### Products Table

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access"
ON products FOR SELECT
USING (true);

-- Admin full access
CREATE POLICY "Admin full access"
ON products FOR ALL
USING (auth.role() = 'admin');
```

### Product Variants Table

```sql
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access"
ON product_variants FOR SELECT
USING (true);

-- Admin full access
CREATE POLICY "Admin full access"
ON product_variants FOR ALL
USING (auth.role() = 'admin');
```

## Triggers

```sql
-- Product modification tracking
CREATE TRIGGER product_modified
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_product_modified();

-- Variant modification tracking
CREATE TRIGGER variant_modified
    BEFORE UPDATE ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_product_modified();

-- Stock updates
CREATE TRIGGER update_product_stock_on_variant_change
    AFTER INSERT OR UPDATE OF stock ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_product_stock();
```

## Views

```sql
CREATE OR REPLACE VIEW product_details AS
SELECT
    p.id,
    p.name,
    p.description,
    p.base_price,
    p.image_url,
    p.stock,
    p.is_available,
    c.name as category_name,
    COUNT(pv.id) as variant_count,
    MIN(pv.price) as min_price,
    MAX(pv.price) as max_price
FROM products p
LEFT JOIN categories c ON c.id = p.category_id
LEFT JOIN product_variants pv ON pv.product_id = p.id
GROUP BY p.id, c.name;
```

## Schema Comments

```sql
COMMENT ON TABLE products IS 'Main products table with base information';
COMMENT ON TABLE product_variants IS 'Product variants with specific attributes';
COMMENT ON COLUMN products.metadata IS 'Additional product attributes in JSONB format';
COMMENT ON COLUMN product_variants.metadata IS 'Additional variant attributes in JSONB format';
```

## Migration Safety

All schema changes are:
1. Wrapped in DO blocks for transaction safety
2. Use IF NOT EXISTS clauses where appropriate
3. Include error handling and logging
4. Preserve existing data
5. Allow rollback if needed

## Performance Considerations

1. Indexes are optimized for common queries
2. JSONB used for flexible metadata
3. Proper constraints ensure data integrity
4. Views optimize common data access patterns
5. Triggers maintain data consistency

## Validation

To verify schema changes:
```sql
SELECT * FROM validate_schema();
SELECT * FROM check_orphaned_variants();
```
