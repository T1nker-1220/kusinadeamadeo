-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for the images bucket
CREATE POLICY "Public Access to Images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'images'
  AND storage.foldername(name) IN (ARRAY['products', 'variants', 'categories'])
);

-- Only authenticated users can upload images
CREATE POLICY "Authenticated Users can Upload Images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images'
  AND auth.role() = 'authenticated'
  AND storage.foldername(name) IN (ARRAY['products', 'variants', 'categories'])
);

-- Only admin users can delete images
CREATE POLICY "Admin Users can Delete Images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images'
  AND EXISTS (
    SELECT 1 FROM "User"
    WHERE id::text = auth.uid()::text
    AND role = 'ADMIN'
  )
);

-- Only admin users can update images
CREATE POLICY "Admin Users can Update Images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images'
  AND EXISTS (
    SELECT 1 FROM "User"
    WHERE id::text = auth.uid()::text
    AND role = 'ADMIN'
  )
);
