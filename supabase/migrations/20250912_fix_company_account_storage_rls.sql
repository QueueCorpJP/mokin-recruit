-- Fix RLS policy for company-account storage bucket
-- The issue is that the upload policy doesn't verify the user is a company user
-- This fixes the "new row violates row-level security policy" error for image uploads

-- Drop the existing simple upload policy
DROP POLICY IF EXISTS "company-account-auth-upload" ON storage.objects;

-- Create a more specific policy that checks if the user is a company user
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

-- Also update the update policy to use the same logic
DROP POLICY IF EXISTS "company-account-auth-update-own" ON storage.objects;

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

-- Update the delete policy as well
DROP POLICY IF EXISTS "company-account-auth-delete-own" ON storage.objects;

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

-- Add comments for documentation
COMMENT ON POLICY "company-account-company-user-upload" ON storage.objects IS 'Only company users can upload to company-account bucket';
COMMENT ON POLICY "company-account-company-user-update" ON storage.objects IS 'Only company users can update files in company-account bucket';
COMMENT ON POLICY "company-account-company-user-delete" ON storage.objects IS 'Only company users can delete files in company-account bucket';
