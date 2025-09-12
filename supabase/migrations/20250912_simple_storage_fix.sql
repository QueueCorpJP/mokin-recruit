-- Simple fix for company-account storage RLS
-- This approach creates new policies with different names to avoid permission issues

-- Create new upload policy with company user check
CREATE POLICY "company_account_upload_v2"
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

-- Create new update policy
CREATE POLICY "company_account_update_v2"
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

-- Create new delete policy
CREATE POLICY "company_account_delete_v2"
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
