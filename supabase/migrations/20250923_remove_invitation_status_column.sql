-- Remove invitation_status column from company_user_group_permissions table
-- Reverting back to simple structure without invitation status tracking

-- Drop the index first
DROP INDEX IF EXISTS idx_company_user_group_permissions_invitation_status;

-- Remove the invitation_status column
ALTER TABLE company_user_group_permissions
DROP COLUMN IF EXISTS invitation_status;

-- Add comment to explain the change
COMMENT ON TABLE company_user_group_permissions IS
'Group member permissions table - simplified structure without invitation status tracking';