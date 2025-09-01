-- Company notification settings table
-- Similar structure to candidate notification_settings table
CREATE TABLE IF NOT EXISTS public.company_notification_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_user_id uuid NOT NULL UNIQUE,
  application_notification character varying NOT NULL DEFAULT 'receive'::character varying CHECK (application_notification::text = ANY (ARRAY['receive'::character varying, 'not-receive'::character varying]::text[])),
  message_notification character varying NOT NULL DEFAULT 'receive'::character varying CHECK (message_notification::text = ANY (ARRAY['receive'::character varying, 'not-receive'::character varying]::text[])),
  system_notification character varying NOT NULL DEFAULT 'receive'::character varying CHECK (system_notification::text = ANY (ARRAY['receive'::character varying, 'not-receive'::character varying]::text[])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT company_notification_settings_pkey PRIMARY KEY (id),
  CONSTRAINT company_notification_settings_company_user_id_fkey FOREIGN KEY (company_user_id) REFERENCES public.company_users(id) ON DELETE CASCADE
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_company_notification_settings_company_user_id ON public.company_notification_settings(company_user_id);

-- Enable RLS
ALTER TABLE public.company_notification_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies can be added here if needed
-- For now, using admin client so RLS policies not strictly required