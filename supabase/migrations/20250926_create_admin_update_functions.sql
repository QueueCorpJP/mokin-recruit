-- Admin functions for updating company data without trigger restrictions
-- This allows admin operations to bypass user authentication checks

-- Function to update company plan as admin
CREATE OR REPLACE FUNCTION public.update_company_plan_admin(
  p_company_id UUID,
  p_new_plan TEXT
)
RETURNS TABLE(
  id UUID,
  company_name TEXT,
  plan TEXT,
  updated_at TIMESTAMPTZ
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Temporarily disable any triggers that check for admin_user
  -- Note: This requires SECURITY DEFINER to work properly

  -- Update the company plan directly
  RETURN QUERY
  UPDATE company_accounts
  SET
    plan = p_new_plan,
    updated_at = NOW()
  WHERE company_accounts.id = p_company_id
  RETURNING
    company_accounts.id,
    company_accounts.company_name,
    company_accounts.plan,
    company_accounts.updated_at;

  -- Check if update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Company not found: %', p_company_id;
  END IF;
END;
$$;

-- Grant execute permission to service role (used by admin functions)
GRANT EXECUTE ON FUNCTION public.update_company_plan_admin(UUID, TEXT) TO service_role;

-- Add comment for documentation
COMMENT ON FUNCTION public.update_company_plan_admin IS 'Admin function to update company plan without trigger restrictions';