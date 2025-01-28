-- Add new columns to ProductVariant table
ALTER TABLE "ProductVariant"
ADD COLUMN IF NOT EXISTS "stock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "isAvailable" BOOLEAN NOT NULL DEFAULT true;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "product_variants_stock_idx" ON "ProductVariant"("stock");
CREATE INDEX IF NOT EXISTS "product_variants_isAvailable_idx" ON "ProductVariant"("isAvailable");

-- Add cascade delete to product variants
ALTER TABLE "ProductVariant"
DROP CONSTRAINT IF EXISTS "ProductVariant_productId_fkey",
ADD CONSTRAINT "ProductVariant_productId_fkey"
  FOREIGN KEY ("productId")
  REFERENCES "Product"("id")
  ON DELETE CASCADE;

-- Update RLS policies for variants
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
