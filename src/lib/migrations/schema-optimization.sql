-- Create functions first
DO $$
BEGIN

-- Create validation functions
CREATE OR REPLACE FUNCTION check_orphaned_variants()
RETURNS TABLE (variant_id UUID, product_id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT pv.id::UUID, pv.product_id::UUID
    FROM product_variants pv
    LEFT JOIN products p ON p.id = pv.product_id
    WHERE p.id IS NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_invalid_prices()
RETURNS TABLE (table_name TEXT, record_id UUID, price DECIMAL) AS $$
BEGIN
    RETURN QUERY
    SELECT 'products'::TEXT, id::UUID, base_price
    FROM products
    WHERE base_price < 0
    UNION ALL
    SELECT 'product_variants'::TEXT, id::UUID, price
    FROM product_variants
    WHERE price < 0;
END;
$$ LANGUAGE plpgsql;

-- Create trigger functions
CREATE OR REPLACE FUNCTION update_product_modified()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- Create cleanup function
CREATE OR REPLACE FUNCTION cleanup_unused_images()
RETURNS TABLE (bucket TEXT, path TEXT) AS $$
BEGIN
    -- Implementation will depend on storage bucket structure
    -- This is a placeholder for the cleanup logic
    RETURN QUERY
    SELECT 'products'::TEXT, 'path'::TEXT
    WHERE FALSE;
END;
$$ LANGUAGE plpgsql;

END $$;

-- Enable Row Level Security
DO $$
BEGIN
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
    ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error enabling RLS: %', SQLERRM;
END $$;

-- Add RLS Policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public read access" ON products;
    CREATE POLICY "Public read access" ON products
        FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Admin full access" ON products;
    CREATE POLICY "Admin full access" ON products
        FOR ALL USING (auth.role() = 'admin');

    DROP POLICY IF EXISTS "Public read access" ON product_variants;
    CREATE POLICY "Public read access" ON product_variants
        FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Admin full access" ON product_variants;
    CREATE POLICY "Admin full access" ON product_variants
        FOR ALL USING (auth.role() = 'admin');
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error creating policies: %', SQLERRM;
END $$;

-- Enhance Products Table
DO $$
BEGIN
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS image_url TEXT,
    ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

    ALTER TABLE products
    ADD CONSTRAINT IF NOT EXISTS valid_price
    CHECK (base_price >= 0);
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error modifying products table: %', SQLERRM;
END $$;

-- Enhance Product Variants Table
DO $$
BEGIN
    ALTER TABLE product_variants
    ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS sort_order INTEGER,
    ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

    ALTER TABLE product_variants
    ADD CONSTRAINT IF NOT EXISTS valid_price
    CHECK (price >= 0),
    ADD CONSTRAINT IF NOT EXISTS valid_stock
    CHECK (stock >= 0);
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error modifying product_variants table: %', SQLERRM;
END $$;

-- Add Performance Indexes
DO $$
BEGIN
    CREATE INDEX IF NOT EXISTS idx_product_variants_product_id
    ON product_variants(product_id);

    CREATE INDEX IF NOT EXISTS idx_products_category_id
    ON products(category_id);

    CREATE INDEX IF NOT EXISTS idx_products_availability
    ON products(is_available);

    CREATE INDEX IF NOT EXISTS idx_product_variants_availability
    ON product_variants(is_available);

    CREATE INDEX IF NOT EXISTS idx_products_category_availability
    ON products(category_id, is_available);

    CREATE INDEX IF NOT EXISTS idx_variants_product_availability
    ON product_variants(product_id, is_available);
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error creating indexes: %', SQLERRM;
END $$;

-- Create Triggers
DO $$
BEGIN
    DROP TRIGGER IF EXISTS product_modified ON products;
    CREATE TRIGGER product_modified
        BEFORE UPDATE ON products
        FOR EACH ROW
        EXECUTE FUNCTION update_product_modified();

    DROP TRIGGER IF EXISTS variant_modified ON product_variants;
    CREATE TRIGGER variant_modified
        BEFORE UPDATE ON product_variants
        FOR EACH ROW
        EXECUTE FUNCTION update_product_modified();

    DROP TRIGGER IF EXISTS update_product_stock_on_variant_change ON product_variants;
    CREATE TRIGGER update_product_stock_on_variant_change
        AFTER INSERT OR UPDATE OF stock ON product_variants
        FOR EACH ROW
        EXECUTE FUNCTION update_product_stock();
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error creating triggers: %', SQLERRM;
END $$;

-- Create View
DO $$
BEGIN
    DROP VIEW IF EXISTS product_details;
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
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error creating view: %', SQLERRM;
END $$;

-- Add Comments
DO $$
BEGIN
    COMMENT ON TABLE products IS 'Main products table with base information';
    COMMENT ON TABLE product_variants IS 'Product variants with specific attributes';
    COMMENT ON COLUMN products.metadata IS 'Additional product attributes in JSONB format';
    COMMENT ON COLUMN product_variants.metadata IS 'Additional variant attributes in JSONB format';
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error adding comments: %', SQLERRM;
END $$;
