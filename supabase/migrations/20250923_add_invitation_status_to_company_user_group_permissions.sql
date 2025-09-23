-- Add invitation_status column to company_user_group_permissions table
-- This allows tracking of invitation status separately from actual group permissions

-- Add the invitation_status column
ALTER TABLE company_user_group_permissions
ADD COLUMN invitation_status TEXT DEFAULT 'completed' CHECK (invitation_status IN ('invited', 'completed', 'expired'));

-- Create index for better query performance
CREATE INDEX idx_company_user_group_permissions_invitation_status
ON company_user_group_permissions(invitation_status);

-- Add comment to explain the column
COMMENT ON COLUMN company_user_group_permissions.invitation_status IS
'Tracks invitation status: invited (pending), completed (active member), expired (invitation expired)';