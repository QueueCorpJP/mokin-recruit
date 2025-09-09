-- Candidate notification settings table
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL UNIQUE,
  scout_notification character varying NOT NULL DEFAULT 'receive'::character varying CHECK (scout_notification::text = ANY (ARRAY['receive'::character varying, 'not-receive'::character varying]::text[])),
  message_notification character varying NOT NULL DEFAULT 'receive'::character varying CHECK (message_notification::text = ANY (ARRAY['receive'::character varying, 'not-receive'::character varying]::text[])),
  recommendation_notification character varying NOT NULL DEFAULT 'receive'::character varying CHECK (recommendation_notification::text = ANY (ARRAY['receive'::character varying, 'not-receive'::character varying]::text[])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notification_settings_pkey PRIMARY KEY (id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_notification_settings_candidate_id ON public.notification_settings(candidate_id);

-- Enable RLS
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for candidates to access their own settings
CREATE POLICY "Candidates can view their own notification settings" ON public.notification_settings
  FOR SELECT USING (candidate_id = auth.uid());

CREATE POLICY "Candidates can insert their own notification settings" ON public.notification_settings
  FOR INSERT WITH CHECK (candidate_id = auth.uid());

CREATE POLICY "Candidates can update their own notification settings" ON public.notification_settings
  FOR UPDATE USING (candidate_id = auth.uid());

CREATE POLICY "Candidates can delete their own notification settings" ON public.notification_settings
  FOR DELETE USING (candidate_id = auth.uid());