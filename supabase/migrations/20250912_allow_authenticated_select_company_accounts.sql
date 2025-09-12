-- Allow any authenticated user to SELECT from company_accounts
-- Context: Candidate-facing search needs company name visibility without loosening job_postings RLS.

-- Ensure RLS is enabled (no-op if already enabled)
ALTER TABLE public.company_accounts ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can view company accounts
-- Note: This grants row-level SELECT on all rows to any authenticated user.
-- If column-level restrictions are desired, consider exposing a view instead.
CREATE POLICY "Authenticated users can view company accounts"
  ON public.company_accounts
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Optional note:
-- If you later want to scope visibility to published companies only,
-- replace the USING clause with a more restrictive predicate.


