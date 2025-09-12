-- Fix RLS policy for company_accounts table
-- The issue was comparing company_users.id with auth.uid() instead of company_users.auth_user_id
-- This fixes "new row violates row-level security policy" error in company/account/edit

-- Drop the existing incorrect UPDATE policy
DROP POLICY IF EXISTS "Company users can update their company account" ON public.company_accounts;

-- Create the corrected UPDATE policy using auth_user_id instead of id
CREATE POLICY "Company users can update their company account"
  ON public.company_accounts 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.company_users 
      WHERE company_users.company_account_id = company_accounts.id 
      AND company_users.auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.company_users 
      WHERE company_users.company_account_id = company_accounts.id 
      AND company_users.auth_user_id = auth.uid()
    )
  );

-- Also fix the SELECT policy for consistency
DROP POLICY IF EXISTS "Company users can view their company account" ON public.company_accounts;

CREATE POLICY "Company users can view their company account"
  ON public.company_accounts 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.company_users 
      WHERE company_users.company_account_id = company_accounts.id 
      AND company_users.auth_user_id = auth.uid()
    )
  );

-- Add comment for documentation
COMMENT ON POLICY "Company users can update their company account" ON public.company_accounts IS 'Fixed: Use auth_user_id instead of id for RLS comparison';
COMMENT ON POLICY "Company users can view their company account" ON public.company_accounts IS 'Fixed: Use auth_user_id instead of id for RLS comparison';
