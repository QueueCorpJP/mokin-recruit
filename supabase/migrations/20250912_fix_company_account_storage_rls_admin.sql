-- Fix RLS policy for company-account storage bucket (Admin version)
-- Run this with Service Role Key or as superuser
-- This fixes the "new row violates row-level security policy" error for image uploads

-- First, check if policies exist and get their names
SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- Drop existing policies (if they exist)
DO $$
BEGIN
    -- Drop upload policy
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'company-account-auth-upload' AND tablename = 'objects' AND schemaname = 'storage') THEN
        DROP POLICY "company-account-auth-upload" ON storage.objects;
    END IF;
    
    -- Drop update policy
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'company-account-auth-update-own' AND tablename = 'objects' AND schemaname = 'storage') THEN
        DROP POLICY "company-account-auth-update-own" ON storage.objects;
    END IF;
    
    -- Drop delete policy
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'company-account-auth-delete-own' AND tablename = 'objects' AND schemaname = 'storage') THEN
        DROP POLICY "company-account-auth-delete-own" ON storage.objects;
    END IF;
END $$;

-- Create new policies with proper company user verification
CREATE POLICY "company-account-company-user-upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'company-account' AND
    EXISTS (
      SELECT 1 FROM public.company_users cu
      WHERE cu.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "company-account-company-user-update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'company-account' AND
    EXISTS (
      SELECT 1 FROM public.company_users cu
      WHERE cu.auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    bucket_id = 'company-account' AND
    EXISTS (
      SELECT 1 FROM public.company_users cu
      WHERE cu.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "company-account-company-user-delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'company-account' AND
    EXISTS (
      SELECT 1 FROM public.company_users cu
      WHERE cu.auth_user_id = auth.uid()
    )
  );

-- Add comments
COMMENT ON POLICY "company-account-company-user-upload" ON storage.objects IS 'Only company users can upload to company-account bucket';
COMMENT ON POLICY "company-account-company-user-update" ON storage.objects IS 'Only company users can update files in company-account bucket';
COMMENT ON POLICY "company-account-company-user-delete" ON storage.objects IS 'Only company users can delete files in company-account bucket';
