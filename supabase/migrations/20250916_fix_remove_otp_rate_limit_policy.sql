-- Remove legacy rate-limit dependency from signup_verification_codes RLS
-- This migration drops a policy that referenced check_signup_rate_limit()
-- and ensures simple anon/authenticated policies without function dependencies.

-- Enable RLS (idempotent)
ALTER TABLE public.signup_verification_codes ENABLE ROW LEVEL SECURITY;

-- Drop legacy policy that referenced check_signup_rate_limit
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'signup_verification_codes'
      AND policyname = 'anonymous_signup_verification_signup'
  ) THEN
    DROP POLICY "anonymous_signup_verification_signup" ON public.signup_verification_codes;
  END IF;
END
$$;

-- Ensure INSERT policy exists (without function dependency)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'signup_verification_codes'
      AND policyname = 'signup_verification_codes_insert_policy'
  ) THEN
    CREATE POLICY "signup_verification_codes_insert_policy" ON public.signup_verification_codes
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
  END IF;
END
$$;

-- Ensure SELECT policy exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'signup_verification_codes'
      AND policyname = 'signup_verification_codes_select_policy'
  ) THEN
    CREATE POLICY "signup_verification_codes_select_policy" ON public.signup_verification_codes
    FOR SELECT
    TO anon, authenticated
    USING (true);
  END IF;
END
$$;

-- Ensure UPDATE policy exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'signup_verification_codes'
      AND policyname = 'signup_verification_codes_update_policy'
  ) THEN
    CREATE POLICY "signup_verification_codes_update_policy" ON public.signup_verification_codes
    FOR UPDATE
    TO anon, authenticated
    USING (true);
  END IF;
END
$$;

-- Ensure DELETE policy exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'signup_verification_codes'
      AND policyname = 'signup_verification_codes_delete_policy'
  ) THEN
    CREATE POLICY "signup_verification_codes_delete_policy" ON public.signup_verification_codes
    FOR DELETE
    TO anon, authenticated
    USING (true);
  END IF;
END
$$;


