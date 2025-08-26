-- Add approval status column to messages table
ALTER TABLE public.messages 
ADD COLUMN approval_status text DEFAULT '未対応' 
CHECK (approval_status = ANY (ARRAY['未対応', '承認', '非承認']));

-- Create index for better query performance
CREATE INDEX idx_messages_approval_status ON public.messages(approval_status);

-- Update existing messages to have default status
UPDATE public.messages 
SET approval_status = '未対応' 
WHERE approval_status IS NULL;