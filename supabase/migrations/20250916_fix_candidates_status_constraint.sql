-- Fix candidates table status constraint to include all required status values
-- This migration addresses the issue where withdrawal and signup processes fail
-- due to status constraint not allowing 'withdrawn', 'temporary', and 'official' values

-- First, drop the existing constraint if it exists
ALTER TABLE public.candidates
DROP CONSTRAINT IF EXISTS candidates_status_check;

-- Add the updated constraint with all required status values
ALTER TABLE public.candidates
ADD CONSTRAINT candidates_status_check
CHECK (status = ANY (ARRAY[
  'ACTIVE'::text,      -- アクティブ状態
  'INACTIVE'::text,    -- 非アクティブ状態
  'SUSPENDED'::text,   -- 停止状態
  'temporary'::text,   -- 仮登録状態 (signup process)
  'official'::text,    -- 本登録状態 (after signup completion)
  'withdrawn'::text    -- 退会状態 (withdrawal process)
]));

-- Add comment to document the constraint
COMMENT ON CONSTRAINT candidates_status_check ON public.candidates IS
'Allows all candidate status values: ACTIVE, INACTIVE, SUSPENDED (legacy), temporary (provisional signup), official (completed signup), withdrawn (user withdrawal)';