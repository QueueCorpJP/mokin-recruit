-- Create saved_candidates table for companies to save candidates
CREATE TABLE IF NOT EXISTS public.saved_candidates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_user_id uuid NOT NULL,
  company_group_id uuid NOT NULL,
  candidate_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT saved_candidates_pkey PRIMARY KEY (id),
  CONSTRAINT saved_candidates_company_user_id_fkey FOREIGN KEY (company_user_id) REFERENCES public.company_users(id) ON DELETE CASCADE,
  CONSTRAINT saved_candidates_company_group_id_fkey FOREIGN KEY (company_group_id) REFERENCES public.company_groups(id) ON DELETE CASCADE,
  CONSTRAINT saved_candidates_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ON DELETE CASCADE,
  -- Unique constraint to prevent duplicate saves
  CONSTRAINT saved_candidates_unique UNIQUE (company_user_id, company_group_id, candidate_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_saved_candidates_company_user_id ON public.saved_candidates(company_user_id);
CREATE INDEX IF NOT EXISTS idx_saved_candidates_company_group_id ON public.saved_candidates(company_group_id);
CREATE INDEX IF NOT EXISTS idx_saved_candidates_candidate_id ON public.saved_candidates(candidate_id);

-- Enable RLS
ALTER TABLE public.saved_candidates ENABLE ROW LEVEL SECURITY;

-- RLS policies can be added here if needed
-- For now, using admin client so RLS policies not strictly required