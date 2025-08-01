-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.application (
  resume_url text,
  career_history_url text,
  company_account_id uuid NOT NULL,
  company_group_id uuid NOT NULL,
  company_user_id uuid NOT NULL,
  candidate_id uuid NOT NULL,
  job_posting_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  status text DEFAULT 'SENT'::text CHECK (status = ANY (ARRAY['SENT'::text, 'READ'::text, 'RESPONDED'::text, 'REJECTED'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  application_message text,
  CONSTRAINT application_pkey PRIMARY KEY (id),
  CONSTRAINT application_company_account_id_fkey FOREIGN KEY (company_account_id) REFERENCES public.company_accounts(id),
  CONSTRAINT application_company_group_id_fkey FOREIGN KEY (company_group_id) REFERENCES public.company_groups(id),
  CONSTRAINT application_company_user_id_fkey FOREIGN KEY (company_user_id) REFERENCES public.company_users(id),
  CONSTRAINT application_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id),
  CONSTRAINT application_job_posting_id_fkey FOREIGN KEY (job_posting_id) REFERENCES public.job_postings(id)
);
CREATE TABLE public.applications (
  candidate_id uuid NOT NULL,
  job_posting_id uuid NOT NULL,
  company_group_id uuid NOT NULL,
  application_message text,
  resume_file_path text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  status text DEFAULT 'APPLIED'::text CHECK (status = ANY (ARRAY['APPLIED'::text, 'SCREENING'::text, 'INTERVIEW'::text, 'OFFER'::text, 'HIRED'::text, 'REJECTED'::text, 'WITHDRAWN'::text])),
  applied_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT applications_pkey PRIMARY KEY (id),
  CONSTRAINT applications_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id),
  CONSTRAINT applications_job_posting_id_fkey FOREIGN KEY (job_posting_id) REFERENCES public.job_postings(id),
  CONSTRAINT applications_company_group_id_fkey FOREIGN KEY (company_group_id) REFERENCES public.company_groups(id)
);
CREATE TABLE public.candidates (
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  last_name text NOT NULL,
  first_name text NOT NULL,
  phone_number text,
  current_residence text,
  current_salary text,
  desired_salary text,
  last_login_at timestamp with time zone,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  skills ARRAY DEFAULT '{}'::text[],
  experience_years integer DEFAULT 0,
  desired_industries ARRAY DEFAULT '{}'::text[],
  desired_job_types ARRAY DEFAULT '{}'::text[],
  desired_locations ARRAY DEFAULT '{}'::text[],
  scout_reception_enabled boolean DEFAULT true,
  status text DEFAULT 'ACTIVE'::text CHECK (status = ANY (ARRAY['ACTIVE'::text, 'INACTIVE'::text, 'SUSPENDED'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT candidates_pkey PRIMARY KEY (id)
);
CREATE TABLE public.company_accounts (
  company_name text NOT NULL,
  industry text NOT NULL,
  headquarters_address text,
  representative_name text,
  company_overview text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  status text DEFAULT 'ACTIVE'::text CHECK (status = ANY (ARRAY['ACTIVE'::text, 'INACTIVE'::text, 'SUSPENDED'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT company_accounts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.company_groups (
  company_account_id uuid NOT NULL,
  group_name text NOT NULL,
  description text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT company_groups_pkey PRIMARY KEY (id),
  CONSTRAINT company_groups_company_account_id_fkey FOREIGN KEY (company_account_id) REFERENCES public.company_accounts(id)
);
CREATE TABLE public.company_user_group_permissions (
  company_user_id uuid NOT NULL,
  company_group_id uuid NOT NULL,
  permission_level text NOT NULL CHECK (permission_level = ANY (ARRAY['SCOUT_STAFF'::text, 'ADMINISTRATOR'::text])),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT company_user_group_permissions_pkey PRIMARY KEY (id),
  CONSTRAINT company_user_group_permissions_company_user_id_fkey FOREIGN KEY (company_user_id) REFERENCES public.company_users(id),
  CONSTRAINT company_user_group_permissions_company_group_id_fkey FOREIGN KEY (company_group_id) REFERENCES public.company_groups(id)
);
CREATE TABLE public.company_users (
  company_account_id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  position_title text,
  last_login_at timestamp with time zone,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT company_users_pkey PRIMARY KEY (id),
  CONSTRAINT company_users_company_account_id_fkey FOREIGN KEY (company_account_id) REFERENCES public.company_accounts(id)
);
CREATE TABLE public.favorites (
  candidate_id uuid NOT NULL,
  job_posting_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT favorites_pkey PRIMARY KEY (id),
  CONSTRAINT favorites_job_posting_id_fkey FOREIGN KEY (job_posting_id) REFERENCES public.job_postings(id),
  CONSTRAINT favorites_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id)
);
CREATE TABLE public.job_postings (
  company_account_id uuid,
  company_group_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  job_description text NOT NULL,
  salary_min integer,
  salary_max integer,
  employment_type text NOT NULL CHECK (employment_type = ANY (ARRAY['FULL_TIME'::text, 'PART_TIME'::text, 'CONTRACT'::text, 'INTERN'::text])),
  application_deadline timestamp with time zone,
  published_at timestamp with time zone,
  remote_work_available boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'PENDING_APPROVAL'::text CHECK (status = ANY (ARRAY['DRAFT'::text, 'PENDING_APPROVAL'::text, 'PUBLISHED'::text, 'CLOSED'::text])),
  position_summary text,
  salary_note text,
  required_skills text,
  location_note text,
  employment_type_note text,
  working_hours text,
  overtime_info text,
  holidays text,
  selection_process text,
  appeal_points ARRAY DEFAULT '{}'::text[],
  smoking_policy text,
  smoking_policy_note text,
  required_documents ARRAY DEFAULT '{}'::text[],
  internal_memo text,
  publication_type text DEFAULT 'public'::text CHECK (publication_type = ANY (ARRAY['public'::text, 'members'::text, 'scout'::text])),
  preferred_skills text,
  work_location ARRAY,
  job_type ARRAY,
  industry ARRAY,
  image_urls ARRAY DEFAULT '{}'::text[],
  CONSTRAINT job_postings_pkey PRIMARY KEY (id),
  CONSTRAINT job_postings_company_group_id_fkey FOREIGN KEY (company_group_id) REFERENCES public.company_users(id)
);
CREATE TABLE public.messages (
  room_id uuid NOT NULL,
  sender_type text NOT NULL CHECK (sender_type = ANY (ARRAY['CANDIDATE'::text, 'COMPANY_USER'::text])),
  sender_candidate_id uuid,
  sender_company_user_id uuid,
  message_type text NOT NULL CHECK (message_type = ANY (ARRAY['SCOUT'::text, 'APPLICATION'::text, 'GENERAL'::text])),
  subject text,
  content text NOT NULL,
  read_at timestamp with time zone,
  replied_at timestamp with time zone,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'SENT'::text CHECK (status = ANY (ARRAY['SENT'::text, 'READ'::text, 'REPLIED'::text])),
  sent_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id),
  CONSTRAINT messages_sender_candidate_id_fkey FOREIGN KEY (sender_candidate_id) REFERENCES public.candidates(id),
  CONSTRAINT messages_sender_company_user_id_fkey FOREIGN KEY (sender_company_user_id) REFERENCES public.company_users(id)
);
CREATE TABLE public.messages_backup (
  id uuid,
  sender_type text,
  sender_candidate_id uuid,
  sender_company_user_id uuid,
  receiver_type text,
  receiver_candidate_id uuid,
  receiver_company_user_id uuid,
  message_type text,
  related_job_posting_id uuid,
  company_group_id uuid,
  subject text,
  content text,
  status text,
  sent_at timestamp with time zone,
  read_at timestamp with time zone,
  replied_at timestamp with time zone,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);
CREATE TABLE public.password_reset_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  used boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  email text NOT NULL,
  user_type text NOT NULL CHECK (user_type = ANY (ARRAY['candidate'::text, 'company'::text])),
  token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id)
);
CREATE TABLE public.room_participants (
  room_id uuid NOT NULL,
  participant_type text NOT NULL CHECK (participant_type = ANY (ARRAY['CANDIDATE'::text, 'COMPANY_USER'::text])),
  candidate_id uuid,
  company_user_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  joined_at timestamp with time zone DEFAULT now(),
  CONSTRAINT room_participants_pkey PRIMARY KEY (id),
  CONSTRAINT room_participants_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id),
  CONSTRAINT room_participants_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id),
  CONSTRAINT room_participants_company_user_id_fkey FOREIGN KEY (company_user_id) REFERENCES public.company_users(id)
);
CREATE TABLE public.rooms (
  related_job_posting_id uuid,
  company_group_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'direct'::text CHECK (type = ANY (ARRAY['direct'::text, 'group'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT rooms_pkey PRIMARY KEY (id),
  CONSTRAINT rooms_related_job_posting_id_fkey FOREIGN KEY (related_job_posting_id) REFERENCES public.job_postings(id),
  CONSTRAINT rooms_company_group_id_fkey FOREIGN KEY (company_group_id) REFERENCES public.company_groups(id)
);