-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.applications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL,
  job_posting_id uuid NOT NULL,
  company_group_id uuid NOT NULL,
  application_message text,
  resume_file_path text,
  status text DEFAULT 'APPLIED'::text CHECK (status = ANY (ARRAY['APPLIED'::text, 'SCREENING'::text, 'INTERVIEW'::text, 'OFFER'::text, 'HIRED'::text, 'REJECTED'::text, 'WITHDRAWN'::text])),
  applied_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT applications_pkey PRIMARY KEY (id),
  CONSTRAINT applications_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id),
  CONSTRAINT applications_job_posting_id_fkey FOREIGN KEY (job_posting_id) REFERENCES public.job_postings(id),
  CONSTRAINT applications_company_group_id_fkey FOREIGN KEY (company_group_id) REFERENCES public.company_groups(id)
);
CREATE TABLE public.candidates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  last_name text NOT NULL,
  first_name text NOT NULL,
  phone_number text,
  current_residence text,
  current_salary text,
  desired_salary text,
  skills ARRAY DEFAULT '{}'::text[],
  experience_years integer DEFAULT 0,
  desired_industries ARRAY DEFAULT '{}'::text[],
  desired_job_types ARRAY DEFAULT '{}'::text[],
  desired_locations ARRAY DEFAULT '{}'::text[],
  scout_reception_enabled boolean DEFAULT true,
  status text DEFAULT 'ACTIVE'::text CHECK (status = ANY (ARRAY['ACTIVE'::text, 'INACTIVE'::text, 'SUSPENDED'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  last_login_at timestamp with time zone,
  CONSTRAINT candidates_pkey PRIMARY KEY (id)
);
CREATE TABLE public.company_accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  industry text NOT NULL,
  headquarters_address text,
  representative_name text,
  company_overview text,
  status text DEFAULT 'ACTIVE'::text CHECK (status = ANY (ARRAY['ACTIVE'::text, 'INACTIVE'::text, 'SUSPENDED'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT company_accounts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.company_groups (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_account_id uuid NOT NULL,
  group_name text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT company_groups_pkey PRIMARY KEY (id),
  CONSTRAINT company_groups_company_account_id_fkey FOREIGN KEY (company_account_id) REFERENCES public.company_accounts(id)
);
CREATE TABLE public.company_user_group_permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_user_id uuid NOT NULL,
  company_group_id uuid NOT NULL,
  permission_level text NOT NULL CHECK (permission_level = ANY (ARRAY['SCOUT_STAFF'::text, 'ADMINISTRATOR'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT company_user_group_permissions_pkey PRIMARY KEY (id),
  CONSTRAINT company_user_group_permissions_company_user_id_fkey FOREIGN KEY (company_user_id) REFERENCES public.company_users(id),
  CONSTRAINT company_user_group_permissions_company_group_id_fkey FOREIGN KEY (company_group_id) REFERENCES public.company_groups(id)
);
CREATE TABLE public.company_users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_account_id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  position_title text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  last_login_at timestamp with time zone,
  CONSTRAINT company_users_pkey PRIMARY KEY (id),
  CONSTRAINT company_users_company_account_id_fkey FOREIGN KEY (company_account_id) REFERENCES public.company_accounts(id)
);
CREATE TABLE public.job_postings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_account_id uuid,
  company_group_id uuid NOT NULL,
  title text NOT NULL,
  job_description text NOT NULL,
  required_skills ARRAY DEFAULT '{}'::text[],
  preferred_skills ARRAY DEFAULT '{}'::text[],
  salary_min integer,
  salary_max integer,
  employment_type text NOT NULL CHECK (employment_type = ANY (ARRAY['FULL_TIME'::text, 'PART_TIME'::text, 'CONTRACT'::text, 'INTERN'::text])),
  work_location text NOT NULL,
  remote_work_available boolean DEFAULT false,
  job_type text NOT NULL,
  industry text NOT NULL,
  status text DEFAULT 'DRAFT'::text CHECK (status = ANY (ARRAY['DRAFT'::text, 'PUBLISHED'::text, 'CLOSED'::text])),
  application_deadline timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  published_at timestamp with time zone,
  CONSTRAINT job_postings_pkey PRIMARY KEY (id),
  CONSTRAINT job_postings_company_group_id_fkey FOREIGN KEY (company_group_id) REFERENCES public.company_users(id)
);
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sender_type text NOT NULL CHECK (sender_type = ANY (ARRAY['CANDIDATE'::text, 'COMPANY_USER'::text])),
  sender_candidate_id uuid,
  sender_company_user_id uuid,
  receiver_type text NOT NULL CHECK (receiver_type = ANY (ARRAY['CANDIDATE'::text, 'COMPANY_USER'::text])),
  receiver_candidate_id uuid,
  receiver_company_user_id uuid,
  message_type text NOT NULL CHECK (message_type = ANY (ARRAY['SCOUT'::text, 'APPLICATION'::text, 'GENERAL'::text])),
  related_job_posting_id uuid,
  company_group_id uuid,
  subject text,
  content text NOT NULL,
  status text DEFAULT 'SENT'::text CHECK (status = ANY (ARRAY['SENT'::text, 'READ'::text, 'REPLIED'::text])),
  sent_at timestamp with time zone DEFAULT now(),
  read_at timestamp with time zone,
  replied_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_related_job_posting_id_fkey FOREIGN KEY (related_job_posting_id) REFERENCES public.job_postings(id),
  CONSTRAINT messages_company_group_id_fkey FOREIGN KEY (company_group_id) REFERENCES public.company_groups(id),
  CONSTRAINT messages_sender_candidate_id_fkey FOREIGN KEY (sender_candidate_id) REFERENCES public.candidates(id),
  CONSTRAINT messages_sender_company_user_id_fkey FOREIGN KEY (sender_company_user_id) REFERENCES public.company_users(id),
  CONSTRAINT messages_receiver_candidate_id_fkey FOREIGN KEY (receiver_candidate_id) REFERENCES public.candidates(id),
  CONSTRAINT messages_receiver_company_user_id_fkey FOREIGN KEY (receiver_company_user_id) REFERENCES public.company_users(id)
);