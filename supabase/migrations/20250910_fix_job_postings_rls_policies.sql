-- Fix RLS policies for job_postings table to use correct column name
-- The job_postings table has a column named 'company_account_id', not 'company_id'

-- Drop existing policies that reference the wrong column
DROP POLICY IF EXISTS "Company users can manage their job postings" ON public.job_postings;
DROP POLICY IF EXISTS "Participants can view applications" ON public.applications;

-- Recreate with correct column references
CREATE POLICY "Company users can manage their job postings"
  ON public.job_postings 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.company_users cu
      JOIN public.company_accounts ca ON cu.company_account_id = ca.id
      WHERE cu.id::text = auth.uid()::text
      AND ca.id = job_postings.company_account_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.company_users cu
      JOIN public.company_accounts ca ON cu.company_account_id = ca.id
      WHERE cu.id::text = auth.uid()::text
      AND ca.id = job_postings.company_account_id
    )
  );

-- Recreate applications policy with correct column reference
CREATE POLICY "Participants can view applications"
  ON public.applications 
  FOR SELECT 
  USING (
    candidate_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM public.job_postings jp
      JOIN public.company_users cu ON jp.company_account_id = cu.company_account_id
      WHERE cu.id::text = auth.uid()::text
      AND jp.id = applications.job_posting_id
    )
  );