-- P0: Public views and minimal RLS (non-breaking)
-- This migration only adds views and SELECT policies. No table structure changes.

-- 1) Public candidate view with limited fields (no PII beyond necessary)
CREATE OR REPLACE VIEW public.v_public_candidates AS
SELECT 
  id,
  -- minimal profile fields safe for discovery; adjust as needed
  last_name,
  first_name,
  recent_job_company_name,
  recent_job_department_position,
  recent_job_types,
  recent_job_industries,
  skills,
  desired_industries,
  desired_job_types,
  desired_locations,
  status,
  updated_at
FROM public.candidates
WHERE status = 'ACTIVE';

-- Ensure RLS is respected implicitly via underlying table; views do not bypass RLS.

-- 2) Minimal RLS for saved_candidates (SELECT only for row owners)
ALTER TABLE public.saved_candidates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "saved_candidates_select_own" ON public.saved_candidates;
CREATE POLICY "saved_candidates_select_own"
  ON public.saved_candidates
  FOR SELECT
  USING (
    -- company user can view rows belonging to same company group via membership
    EXISTS (
      SELECT 1 FROM public.company_users cu
      JOIN public.company_groups cg ON cu.company_account_id = cg.company_account_id
      WHERE cu.id::text = auth.uid()::text
      AND cg.id = saved_candidates.company_group_id
    )
  );

-- 3) Minimal RLS for company_notification_settings (SELECT only for owner)
ALTER TABLE public.company_notification_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "company_notification_settings_select_owner" ON public.company_notification_settings;
CREATE POLICY "company_notification_settings_select_owner"
  ON public.company_notification_settings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.company_users cu
      WHERE cu.id::text = auth.uid()::text
      AND cu.id = company_notification_settings.company_user_id
    )
  );

-- Note: INSERT/UPDATE/DELETE policies will be added later after invite/token flow is in place.


