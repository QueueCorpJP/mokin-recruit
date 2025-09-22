-- Remove legacy check_signup_rate_limit function that references non-existent signup_rate_limits table
-- This function is causing errors during candidate creation as it tries to access a table that doesn't exist

-- Drop the check_signup_rate_limit function if it exists
DROP FUNCTION IF EXISTS public.check_signup_rate_limit(p_email text, p_table_name text);

-- Also remove the update_signup_progress_updated_at trigger function if it's not needed
-- (This appears to be a standard updated_at trigger, so we'll keep it for now)

-- Clean up any remaining references to signup_rate_limits in policies (already handled by previous migrations)
-- This migration ensures that no orphaned functions reference non-existent tables

-- Log the cleanup
SELECT 'check_signup_rate_limit function removed successfully' as cleanup_result;


