-- Fix storage policies to ensure public images are accessible

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them with correct logic
DROP POLICY IF EXISTS "Users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own product images" ON storage.objects;

-- Recreate policies with correct permissions

-- Allow authenticated users to upload images
CREATE POLICY "Users can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
);

-- Allow public access to view ALL images in products bucket
-- This is the critical policy for making images publicly accessible
CREATE POLICY "Public can view product images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'products'
);

-- Allow users to delete their own uploaded images
-- Updated to match the filename pattern: product-{userid}-{timestamp}-{random}.{ext}
CREATE POLICY "Users can delete their own product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'products'
  AND (storage.foldername(name))[1] = 'product'
  AND auth.uid()::text = (
    string_to_array((storage.filename(name)), '-')
  )[2]
);

-- Ensure the bucket is public
UPDATE storage.buckets 
SET public = true
WHERE id = 'products';

-- Verify the configuration
SELECT 'Bucket configuration:' as check_type;
SELECT id, name, public FROM storage.buckets WHERE id = 'products';

SELECT 'RLS status:' as check_type;
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename = 'objects' AND schemaname = 'storage';

SELECT 'Storage policies:' as check_type;
SELECT policyname, cmd, qual FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;
