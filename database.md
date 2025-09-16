-- WARNING: This schema is for context only and is not meant to be run. -- Table order and
constraints may not be valid for execution.

CREATE TABLE public.admin_users ( id uuid NOT NULL DEFAULT gen_random_uuid(), email text NOT NULL
UNIQUE, password_hash text NOT NULL, name text NOT NULL, created_at timestamp with time zone NOT
NULL DEFAULT now(), updated_at timestamp with time zone NOT NULL DEFAULT now(), CONSTRAINT
admin_users_pkey PRIMARY KEY (id) ); CREATE TABLE public.application ( id uuid NOT NULL DEFAULT
gen_random_uuid(), company_account_id uuid NOT NULL, company_group_id uuid NOT NULL, company_user_id
uuid NOT NULL, candidate_id uuid NOT NULL, job_posting_id uuid, application_message text, status
text DEFAULT 'SENT'::text CHECK (status = ANY (ARRAY['SENT'::text, 'READ'::text, 'RESPONDED'::text,
'REJECTED'::text])), created_at timestamp with time zone DEFAULT now(), updated_at timestamp with
time zone DEFAULT now(), resume_url text, career_history_url text, CONSTRAINT application_pkey
PRIMARY KEY (id), CONSTRAINT application_company_group_id_fkey FOREIGN KEY (company_group_id)
REFERENCES public.company_groups(id), CONSTRAINT application_company_account_id_fkey FOREIGN KEY
(company_account_id) REFERENCES public.company_accounts(id), CONSTRAINT
application_job_posting_id_fkey FOREIGN KEY (job_posting_id) REFERENCES public.job_postings(id),
CONSTRAINT application_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES
public.candidates(id), CONSTRAINT application_company_user_id_fkey FOREIGN KEY (company_user_id)
REFERENCES public.company_users(id) ); CREATE TABLE public.article_categories ( id uuid NOT NULL
DEFAULT gen_random_uuid(), name text NOT NULL UNIQUE, description text, created_at timestamp with
time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), CONSTRAINT
article_categories_pkey PRIMARY KEY (id) ); CREATE TABLE public.article_category_relations ( id uuid
NOT NULL DEFAULT gen_random_uuid(), article_id uuid NOT NULL, category_id uuid NOT NULL, created_at
timestamp with time zone DEFAULT now(), CONSTRAINT article_category_relations_pkey PRIMARY KEY (id),
CONSTRAINT article_category_relations_category_id_fkey FOREIGN KEY (category_id) REFERENCES
public.article_categories(id), CONSTRAINT article_category_relations_article_id_fkey FOREIGN KEY
(article_id) REFERENCES public.articles(id) ); CREATE TABLE public.article_tag_relations ( id uuid
NOT NULL DEFAULT gen_random_uuid(), article_id uuid NOT NULL, tag_id uuid NOT NULL, created_at
timestamp with time zone DEFAULT now(), CONSTRAINT article_tag_relations_pkey PRIMARY KEY (id),
CONSTRAINT article_tag_relations_article_id_fkey FOREIGN KEY (article_id) REFERENCES
public.articles(id), CONSTRAINT article_tag_relations_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES
public.article_tags(id) ); CREATE TABLE public.article_tags ( id uuid NOT NULL DEFAULT
gen_random_uuid(), name text NOT NULL UNIQUE, created_at timestamp with time zone DEFAULT now(),
CONSTRAINT article_tags_pkey PRIMARY KEY (id) ); CREATE TABLE public.articles ( id uuid NOT NULL
DEFAULT gen_random_uuid(), title text NOT NULL, slug text NOT NULL UNIQUE, content text NOT NULL,
excerpt text, thumbnail_url text, status text NOT NULL DEFAULT 'DRAFT'::text CHECK (status = ANY
(ARRAY['DRAFT'::text, 'PUBLISHED'::text, 'ARCHIVED'::text])), published_at timestamp with time zone,
created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT
now(), views_count integer DEFAULT 0, meta_title text, meta_description text, CONSTRAINT
articles_pkey PRIMARY KEY (id) ); CREATE TABLE public.blocked_companies ( id uuid NOT NULL DEFAULT
gen_random_uuid(), candidate_id uuid NOT NULL, company_names ARRAY NOT NULL DEFAULT '{}'::text[],
created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT
now(), CONSTRAINT blocked_companies_pkey PRIMARY KEY (id) ); CREATE TABLE public.candidates ( id
uuid NOT NULL DEFAULT gen_random_uuid(), email text NOT NULL UNIQUE, last_name text, first_name
text, phone_number text, current_residence text, current_salary text, desired_salary text, skills
ARRAY DEFAULT '{}'::text[], experience_years integer DEFAULT 0, desired_industries ARRAY DEFAULT
'{}'::text[], desired_job_types ARRAY DEFAULT '{}'::text[], desired_locations ARRAY DEFAULT
'{}'::text[], scout_reception_enabled boolean DEFAULT true, status text DEFAULT 'ACTIVE'::text CHECK
(status = ANY (ARRAY['ACTIVE'::text, 'INACTIVE'::text, 'SUSPENDED'::text])), created_at timestamp
with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), last_login_at
timestamp with time zone, current_company text, current_position text, last_name_kana text,
first_name_kana text, gender text CHECK (gender = ANY (ARRAY['male'::text, 'female'::text,
'unspecified'::text])), birth_date date, prefecture text, current_income text, has_career_change
text, job_change_timing text, current_activity_status text, career_status_updated_at timestamp with
time zone, recent_job_company_name text, recent_job_department_position text, recent_job_start_year
text, recent_job_start_month text, recent_job_end_year text, recent_job_end_month text,
recent_job_is_currently_working boolean, recent_job_industries jsonb, recent_job_types jsonb,
recent_job_description text, recent_job_updated_at timestamp with time zone, resume_url text,
resume_filename text, resume_uploaded_at timestamp with time zone, job_summary text, self_pr text,
password_hash text, management_experience_count integer DEFAULT 0, interested_work_styles ARRAY
DEFAULT '{}'::text[], CONSTRAINT candidates_pkey PRIMARY KEY (id) ); CREATE TABLE
public.career_status_entries ( id uuid NOT NULL DEFAULT gen_random_uuid(), candidate_id uuid NOT
NULL, is_private boolean DEFAULT false, industries jsonb, company_name text, department text,
progress_status text, decline_reason text, created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(), CONSTRAINT career_status_entries_pkey PRIMARY KEY
(id), CONSTRAINT career_status_entries_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES
public.candidates(id) ); CREATE TABLE public.company_accounts ( id uuid NOT NULL DEFAULT
gen_random_uuid(), company_name text NOT NULL, industry text NOT NULL, headquarters_address text,
representative_name text, company_overview text, status text DEFAULT 'ACTIVE'::text CHECK (status =
ANY (ARRAY['ACTIVE'::text, 'INACTIVE'::text, 'SUSPENDED'::text])), created_at timestamp with time
zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), plan text NOT NULL DEFAULT
'basic'::text CHECK (plan = ANY (ARRAY['basic'::text, 'standard'::text])), scout_limit integer
DEFAULT 10 CHECK (scout_limit >= 1 AND scout_limit <= 1000), company_urls jsonb DEFAULT '[]'::jsonb,
icon_image_url text, representative_position text, established_year integer, capital_amount integer,
capital_unit text CHECK (capital_unit IS NULL OR (capital_unit = ANY (ARRAY['万円'::text,
'億円'::text]))), employees_count integer, industries jsonb DEFAULT '[]'::jsonb, business_content
text, prefecture text, address text, company_phase text CHECK (company_phase IS NULL OR
(company_phase = ANY (ARRAY['スタートアップ（創業初期・社員数50名規模）'::text,
'スタートアップ（成長中・シリーズB以降）'::text, 'メガベンチャー（急成長・未上場）'::text,
'上場ベンチャー（マザーズ等上場済）'::text, '中堅企業（~1000名規模）'::text,
'上場企業（プライム・スタンダード等）'::text, '大企業（グローバル展開・数千名規模）'::text]))),
company_images ARRAY DEFAULT ARRAY[]::text[], company_attractions jsonb DEFAULT '[]'::jsonb,
CONSTRAINT company_accounts_pkey PRIMARY KEY (id) ); CREATE TABLE public.company_groups ( id uuid
NOT NULL DEFAULT gen_random_uuid(), company_account_id uuid NOT NULL, group_name text NOT NULL,
description text, created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time
zone DEFAULT now(), CONSTRAINT company_groups_pkey PRIMARY KEY (id), CONSTRAINT
company_groups_company_account_id_fkey FOREIGN KEY (company_account_id) REFERENCES
public.company_accounts(id) ); CREATE TABLE public.company_notification_settings ( id uuid NOT NULL
DEFAULT gen_random_uuid(), company_user_id uuid NOT NULL UNIQUE, application_notification character
varying NOT NULL DEFAULT 'receive'::character varying CHECK (application_notification::text = ANY
(ARRAY['receive'::character varying::text, 'not-receive'::character varying::text])),
message_notification character varying NOT NULL DEFAULT 'receive'::character varying CHECK
(message_notification::text = ANY (ARRAY['receive'::character varying::text,
'not-receive'::character varying::text])), system_notification character varying NOT NULL DEFAULT
'receive'::character varying CHECK (system_notification::text = ANY (ARRAY['receive'::character
varying::text, 'not-receive'::character varying::text])), created_at timestamp with time zone NOT
NULL DEFAULT now(), updated_at timestamp with time zone NOT NULL DEFAULT now(), CONSTRAINT
company_notification_settings_pkey PRIMARY KEY (id), CONSTRAINT
company_notification_settings_company_user_id_fkey FOREIGN KEY (company_user_id) REFERENCES
public.company_users(id) ); CREATE TABLE public.company_user_group_permissions ( id uuid NOT NULL
DEFAULT gen_random_uuid(), company_user_id uuid NOT NULL, company_group_id uuid NOT NULL,
permission_level text NOT NULL CHECK (permission_level = ANY (ARRAY['SCOUT_STAFF'::text,
'ADMINISTRATOR'::text, 'ADMIN'::text])), created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(), CONSTRAINT company_user_group_permissions_pkey
PRIMARY KEY (id), CONSTRAINT company_user_group_permissions_company_user_id_fkey FOREIGN KEY
(company_user_id) REFERENCES public.company_users(id), CONSTRAINT
company_user_group_permissions_company_group_id_fkey FOREIGN KEY (company_group_id) REFERENCES
public.company_groups(id) ); CREATE TABLE public.company_users ( id uuid NOT NULL DEFAULT
gen_random_uuid(), company_account_id uuid NOT NULL, email text NOT NULL UNIQUE, password_hash text
NOT NULL, full_name text NOT NULL, position_title text, created_at timestamp with time zone DEFAULT
now(), updated_at timestamp with time zone DEFAULT now(), last_login_at timestamp with time zone,
auth_user_id uuid, CONSTRAINT company_users_pkey PRIMARY KEY (id), CONSTRAINT
company_users_company_account_id_fkey FOREIGN KEY (company_account_id) REFERENCES
public.company_accounts(id) ); CREATE TABLE public.decline_reasons ( id uuid NOT NULL DEFAULT
gen_random_uuid(), candidate_id uuid, company_user_id uuid, job_posting_id uuid, room_id uuid,
reason text NOT NULL, created_at timestamp with time zone DEFAULT now(), updated_at timestamp with
time zone DEFAULT now(), CONSTRAINT decline_reasons_pkey PRIMARY KEY (id), CONSTRAINT
decline_reasons_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id),
CONSTRAINT decline_reasons_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id),
CONSTRAINT decline_reasons_company_user_id_fkey FOREIGN KEY (company_user_id) REFERENCES
public.company_users(id), CONSTRAINT decline_reasons_job_posting_id_fkey FOREIGN KEY
(job_posting_id) REFERENCES public.job_postings(id) ); CREATE TABLE public.education ( id uuid NOT
NULL DEFAULT gen_random_uuid(), candidate_id uuid, final_education text NOT NULL, school_name text,
department text, graduation_year integer, graduation_month integer, created_at timestamp with time
zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), CONSTRAINT education_pkey
PRIMARY KEY (id), CONSTRAINT education_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES
public.candidates(id) ); CREATE TABLE public.email_verification_codes ( id uuid NOT NULL DEFAULT
gen_random_uuid(), candidate_id uuid NOT NULL UNIQUE, email character varying NOT NULL, code
character varying NOT NULL, created_at timestamp with time zone DEFAULT now(), expires_at timestamp
with time zone NOT NULL, used boolean DEFAULT false, CONSTRAINT email_verification_codes_pkey
PRIMARY KEY (id), CONSTRAINT email_verification_codes_candidate_id_fkey FOREIGN KEY (candidate_id)
REFERENCES public.candidates(id) ); CREATE TABLE public.expectations ( id uuid NOT NULL DEFAULT
gen_random_uuid(), candidate_id uuid, desired_income text NOT NULL, desired_industries jsonb DEFAULT
'[]'::jsonb, desired_job_types jsonb DEFAULT '[]'::jsonb, desired_work_locations jsonb DEFAULT
'[]'::jsonb, desired_work_styles jsonb DEFAULT '[]'::jsonb, created_at timestamp with time zone
DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), CONSTRAINT expectations_pkey
PRIMARY KEY (id), CONSTRAINT expectations_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES
public.candidates(id) ); CREATE TABLE public.favorites ( id uuid NOT NULL DEFAULT gen_random_uuid(),
candidate_id uuid NOT NULL, job_posting_id uuid NOT NULL, created_at timestamp with time zone
DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), CONSTRAINT favorites_pkey PRIMARY
KEY (id), CONSTRAINT favorites_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES
public.candidates(id), CONSTRAINT favorites_job_posting_id_fkey FOREIGN KEY (job_posting_id)
REFERENCES public.job_postings(id) ); CREATE TABLE public.hidden_candidates ( id uuid NOT NULL
DEFAULT gen_random_uuid(), company_user_id uuid NOT NULL, company_group_id uuid NOT NULL,
candidate_id uuid NOT NULL, is_hidden boolean NOT NULL DEFAULT true, search_query jsonb, hidden_at
timestamp with time zone NOT NULL DEFAULT now(), created_at timestamp with time zone NOT NULL
DEFAULT now(), updated_at timestamp with time zone NOT NULL DEFAULT now(), CONSTRAINT
hidden_candidates_pkey PRIMARY KEY (id), CONSTRAINT hidden_candidates_company_group_id_fkey FOREIGN
KEY (company_group_id) REFERENCES public.company_groups(id), CONSTRAINT
hidden_candidates_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id),
CONSTRAINT hidden_candidates_company_user_id_fkey FOREIGN KEY (company_user_id) REFERENCES
public.company_users(id) ); CREATE TABLE public.job_postings ( id uuid NOT NULL DEFAULT
gen_random_uuid(), company_account_id uuid, company_group_id uuid NOT NULL, title text NOT NULL,
job_description text NOT NULL, salary_min integer, salary_max integer, employment_type text NOT NULL
CHECK (employment_type = ANY (ARRAY['FULL_TIME'::text, 'PART_TIME'::text, 'CONTRACT'::text,
'INTERN'::text])), remote_work_available boolean DEFAULT false, status text DEFAULT
'PENDING_APPROVAL'::text CHECK (status = ANY (ARRAY['DRAFT'::text, 'PENDING_APPROVAL'::text,
'PUBLISHED'::text, 'CLOSED'::text])), application_deadline timestamp with time zone, created_at
timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(),
published_at timestamp with time zone, position_summary text, salary_note text, location_note text,
employment_type_note text, working_hours text, overtime_info text, holidays text, selection_process
text, appeal_points ARRAY DEFAULT '{}'::text[], smoking_policy text, smoking_policy_note text,
required_documents ARRAY DEFAULT '{}'::text[], internal_memo text, publication_type text DEFAULT
'public'::text CHECK (publication_type = ANY (ARRAY['public'::text, 'members'::text,
'scout'::text])), image_urls ARRAY DEFAULT '{}'::text[], required_skills text, preferred_skills
text, work_location ARRAY, job_type ARRAY, industry ARRAY, overtime text CHECK ((overtime = ANY
(ARRAY['あり'::text, 'なし'::text])) OR overtime IS NULL), approval_reason text, approval_comment
text, approved_at timestamp with time zone, rejection_reason text, rejection_comment text,
rejected_at timestamp with time zone, CONSTRAINT job_postings_pkey PRIMARY KEY (id), CONSTRAINT
fk_job_postings_company_accounts FOREIGN KEY (company_account_id) REFERENCES
public.company_accounts(id), CONSTRAINT job_postings_company_group_id_fkey FOREIGN KEY
(company_group_id) REFERENCES public.company_groups(id) ); CREATE TABLE public.job_summary ( id uuid
NOT NULL DEFAULT gen_random_uuid(), candidate_id uuid, job_summary text, self_pr text, created_at
timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(),
CONSTRAINT job_summary_pkey PRIMARY KEY (id), CONSTRAINT job_summary_candidate_id_fkey FOREIGN KEY
(candidate_id) REFERENCES public.candidates(id) ); CREATE TABLE public.job_type_experience ( id uuid
NOT NULL DEFAULT gen_random_uuid(), candidate_id uuid, job_type_id text NOT NULL, job_type_name text
NOT NULL, experience_years integer NOT NULL, created_at timestamp with time zone DEFAULT now(),
updated_at timestamp with time zone DEFAULT now(), CONSTRAINT job_type_experience_pkey PRIMARY KEY
(id), CONSTRAINT job_type_experience_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES
public.candidates(id) ); CREATE TABLE public.message_templates ( id uuid NOT NULL DEFAULT
gen_random_uuid(), company_id uuid NOT NULL, group_id uuid NOT NULL, template_name character varying
NOT NULL, body text NOT NULL, created_at timestamp with time zone DEFAULT now(), updated_at
timestamp with time zone DEFAULT now(), CONSTRAINT message_templates_pkey PRIMARY KEY (id),
CONSTRAINT message_templates_group_id_fkey FOREIGN KEY (group_id) REFERENCES
public.company_groups(id), CONSTRAINT message_templates_company_id_fkey FOREIGN KEY (company_id)
REFERENCES public.company_accounts(id) ); CREATE TABLE public.messages ( id uuid NOT NULL DEFAULT
gen_random_uuid(), room_id uuid NOT NULL, sender_type text NOT NULL CHECK (sender_type = ANY
(ARRAY['CANDIDATE'::text, 'COMPANY_USER'::text])), sender_candidate_id uuid, message_type text NOT
NULL CHECK (message_type = ANY (ARRAY['SCOUT'::text, 'APPLICATION'::text, 'GENERAL'::text])),
subject text, content text NOT NULL, status text NOT NULL DEFAULT 'SENT'::text CHECK (status = ANY
(ARRAY['SENT'::text, 'READ'::text, 'REPLIED'::text])), sent_at timestamp with time zone DEFAULT
now(), read_at timestamp with time zone, replied_at timestamp with time zone, created_at timestamp
with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(),
sender_company_group_id uuid, file_urls jsonb DEFAULT '[]'::jsonb, approval_status text DEFAULT
'未対応'::text CHECK (approval_status = ANY (ARRAY['未対応'::text, '承認'::text, '非承認'::text])),
approval_reason text, approval_comment text, CONSTRAINT messages_pkey PRIMARY KEY (id), CONSTRAINT
messages_sender_candidate_id_fkey FOREIGN KEY (sender_candidate_id) REFERENCES
public.candidates(id), CONSTRAINT messages_sender_company_group_id_fkey FOREIGN KEY
(sender_company_group_id) REFERENCES public.company_groups(id), CONSTRAINT messages_room_id_fkey
FOREIGN KEY (room_id) REFERENCES public.rooms(id) ); CREATE TABLE public.ng_keywords ( id uuid NOT
NULL DEFAULT gen_random_uuid(), keyword text NOT NULL UNIQUE, category text DEFAULT 'general'::text,
is_active boolean DEFAULT true, created_at timestamp with time zone NOT NULL DEFAULT
timezone('utc'::text, now()), updated_at timestamp with time zone NOT NULL DEFAULT
timezone('utc'::text, now()), created_by uuid, description text, CONSTRAINT ng_keywords_pkey PRIMARY
KEY (id), CONSTRAINT ng_keywords_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
); CREATE TABLE public.notice_categories ( id uuid NOT NULL DEFAULT uuid_generate_v4(), name text
NOT NULL UNIQUE, description text, created_at timestamp with time zone DEFAULT now(), updated_at
timestamp with time zone DEFAULT now(), CONSTRAINT notice_categories_pkey PRIMARY KEY (id) ); CREATE
TABLE public.notice_category_relations ( id uuid NOT NULL DEFAULT uuid_generate_v4(), notice_id uuid
NOT NULL, category_id uuid NOT NULL, created_at timestamp with time zone DEFAULT now(), CONSTRAINT
notice_category_relations_pkey PRIMARY KEY (id), CONSTRAINT notice_category_relations_notice_id_fkey
FOREIGN KEY (notice_id) REFERENCES public.notices(id), CONSTRAINT
notice_category_relations_category_id_fkey FOREIGN KEY (category_id) REFERENCES
public.notice_categories(id) ); CREATE TABLE public.notices ( id uuid NOT NULL DEFAULT
uuid_generate_v4(), title text NOT NULL, slug text NOT NULL UNIQUE, content text, excerpt text,
status text DEFAULT 'DRAFT'::text CHECK (status = ANY (ARRAY['DRAFT'::text, 'PUBLISHED'::text,
'ARCHIVED'::text])), thumbnail_url text, published_at timestamp with time zone, views_count integer
DEFAULT 0, content_images jsonb DEFAULT '[]'::jsonb, created_at timestamp with time zone DEFAULT
now(), updated_at timestamp with time zone DEFAULT now(), CONSTRAINT notices_pkey PRIMARY KEY (id)
); CREATE TABLE public.notification_settings ( id uuid NOT NULL DEFAULT gen_random_uuid(),
candidate_id uuid NOT NULL UNIQUE, scout_notification character varying NOT NULL DEFAULT
'receive'::character varying CHECK (scout_notification::text = ANY (ARRAY['receive'::character
varying, 'not-receive'::character varying]::text[])), message_notification character varying NOT
NULL DEFAULT 'receive'::character varying CHECK (message_notification::text = ANY
(ARRAY['receive'::character varying, 'not-receive'::character varying]::text[])),
recommendation_notification character varying NOT NULL DEFAULT 'receive'::character varying CHECK
(recommendation_notification::text = ANY (ARRAY['receive'::character varying,
'not-receive'::character varying]::text[])), created_at timestamp with time zone NOT NULL DEFAULT
now(), updated_at timestamp with time zone NOT NULL DEFAULT now(), CONSTRAINT
notification_settings_pkey PRIMARY KEY (id), CONSTRAINT notification_settings_candidate_id_fkey
FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ); CREATE TABLE
public.password_reset_tokens ( id uuid NOT NULL DEFAULT gen_random_uuid(), email text NOT NULL,
user_type text NOT NULL CHECK (user_type = ANY (ARRAY['candidate'::text, 'company'::text])), token
text NOT NULL UNIQUE, expires_at timestamp with time zone NOT NULL, used boolean DEFAULT false,
created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT
now(), CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id) ); CREATE TABLE public.rooms ( id uuid
NOT NULL DEFAULT gen_random_uuid(), type text NOT NULL DEFAULT 'direct'::text CHECK (type = ANY
(ARRAY['direct'::text, 'group'::text])), related_job_posting_id uuid, company_group_id uuid,
created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT
now(), candidate_id uuid, participating_company_users ARRAY DEFAULT ARRAY[]::text[], CONSTRAINT
rooms_pkey PRIMARY KEY (id), CONSTRAINT rooms_related_job_posting_id_fkey FOREIGN KEY
(related_job_posting_id) REFERENCES public.job_postings(id), CONSTRAINT rooms_company_group_id_fkey
FOREIGN KEY (company_group_id) REFERENCES public.company_groups(id), CONSTRAINT
rooms_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ); CREATE TABLE
public.saved_candidates ( id uuid NOT NULL DEFAULT gen_random_uuid(), company_user_id uuid NOT NULL,
company_group_id uuid NOT NULL, candidate_id uuid NOT NULL, created_at timestamp with time zone NOT
NULL DEFAULT now(), updated_at timestamp with time zone NOT NULL DEFAULT now(), CONSTRAINT
saved_candidates_pkey PRIMARY KEY (id), CONSTRAINT saved_candidates_company_group_id_fkey FOREIGN
KEY (company_group_id) REFERENCES public.company_groups(id), CONSTRAINT
saved_candidates_company_user_id_fkey FOREIGN KEY (company_user_id) REFERENCES
public.company_users(id), CONSTRAINT saved_candidates_candidate_id_fkey FOREIGN KEY (candidate_id)
REFERENCES public.candidates(id) ); CREATE TABLE public.scout_sends ( id uuid NOT NULL DEFAULT
gen_random_uuid(), company_account_id uuid NOT NULL, company_group_id uuid NOT NULL,
sender_company_user_id uuid NOT NULL, sender_name text NOT NULL, candidate_id uuid NOT NULL,
candidate_email text NOT NULL, candidate_name text NOT NULL, job_posting_id uuid, job_title text,
subject text NOT NULL, message_content text NOT NULL, template_id uuid, status text NOT NULL DEFAULT
'sent'::text CHECK (status = ANY (ARRAY['sent'::text, 'read'::text, 'replied'::text,
'failed'::text])), sent_at timestamp with time zone DEFAULT now(), read_at timestamp with time zone,
replied_at timestamp with time zone, search_query jsonb, query_source text, created_at timestamp
with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), CONSTRAINT
scout_sends_pkey PRIMARY KEY (id), CONSTRAINT scout_sends_company_account_id_fkey FOREIGN KEY
(company_account_id) REFERENCES public.company_accounts(id), CONSTRAINT
scout_sends_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id),
CONSTRAINT scout_sends_job_posting_id_fkey FOREIGN KEY (job_posting_id) REFERENCES
public.job_postings(id), CONSTRAINT scout_sends_template_id_fkey FOREIGN KEY (template_id)
REFERENCES public.search_templates(id), CONSTRAINT scout_sends_company_group_id_fkey FOREIGN KEY
(company_group_id) REFERENCES public.company_groups(id), CONSTRAINT
scout_sends_sender_company_user_id_fkey FOREIGN KEY (sender_company_user_id) REFERENCES
public.company_users(id) ); CREATE TABLE public.scout_settings ( id uuid NOT NULL DEFAULT
gen_random_uuid(), candidate_id text NOT NULL UNIQUE, scout_status text NOT NULL CHECK (scout_status
= ANY (ARRAY['receive'::text, 'not-receive'::text])), created_at timestamp with time zone DEFAULT
now(), updated_at timestamp with time zone DEFAULT now(), CONSTRAINT scout_settings_pkey PRIMARY KEY
(id) ); CREATE TABLE public.search_history ( id uuid NOT NULL DEFAULT gen_random_uuid(), searcher_id
uuid NOT NULL, searcher_name text NOT NULL, group_id uuid NOT NULL, group_name text NOT NULL,
search_conditions jsonb NOT NULL DEFAULT '{}'::jsonb, search_title text NOT NULL, is_saved boolean
NOT NULL DEFAULT false, searched_at timestamp with time zone NOT NULL DEFAULT now(), created_at
timestamp with time zone NOT NULL DEFAULT now(), updated_at timestamp with time zone NOT NULL
DEFAULT now(), CONSTRAINT search_history_pkey PRIMARY KEY (id) ); CREATE TABLE
public.search_templates ( id uuid NOT NULL DEFAULT gen_random_uuid(), company_id uuid NOT NULL,
group_id uuid NOT NULL, template_name character varying NOT NULL, created_at timestamp with time
zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), target_job_posting_id uuid,
subject text, body text, is_saved boolean DEFAULT false, CONSTRAINT search_templates_pkey PRIMARY
KEY (id), CONSTRAINT fk_search_templates_group_id FOREIGN KEY (group_id) REFERENCES
public.company_groups(id), CONSTRAINT search_templates_target_job_posting_id_fkey FOREIGN KEY
(target_job_posting_id) REFERENCES public.job_postings(id), CONSTRAINT
fk_search_templates_company_id FOREIGN KEY (company_id) REFERENCES public.company_accounts(id) );
CREATE TABLE public.selection_progress ( id uuid NOT NULL DEFAULT gen_random_uuid(), application_id
uuid, scout_send_id uuid, candidate_id uuid NOT NULL, company_group_id uuid NOT NULL, job_posting_id
uuid, document_screening_result text CHECK (document_screening_result = ANY (ARRAY['pending'::text,
'pass'::text, 'fail'::text])), document_screening_date timestamp with time zone,
first_interview_result text CHECK (first_interview_result = ANY (ARRAY['pending'::text,
'pass'::text, 'fail'::text])), first_interview_date timestamp with time zone,
secondary_interview_result text CHECK (secondary_interview_result = ANY (ARRAY['pending'::text,
'pass'::text, 'fail'::text])), secondary_interview_date timestamp with time zone,
final_interview_result text CHECK (final_interview_result = ANY (ARRAY['pending'::text,
'pass'::text, 'fail'::text])), final_interview_date timestamp with time zone, offer_result text
CHECK (offer_result = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text])), offer_date
timestamp with time zone, decline_reason text, internal_memo text, created_at timestamp with time
zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), joining_date date, CONSTRAINT
selection_progress_pkey PRIMARY KEY (id), CONSTRAINT selection_progress_scout_send_id_fkey FOREIGN
KEY (scout_send_id) REFERENCES public.scout_sends(id), CONSTRAINT
selection_progress_job_posting_id_fkey FOREIGN KEY (job_posting_id) REFERENCES
public.job_postings(id), CONSTRAINT selection_progress_application_id_fkey FOREIGN KEY
(application_id) REFERENCES public.application(id), CONSTRAINT
selection_progress_company_group_id_fkey FOREIGN KEY (company_group_id) REFERENCES
public.company_groups(id), CONSTRAINT selection_progress_candidate_id_fkey FOREIGN KEY
(candidate_id) REFERENCES public.candidates(id) ); CREATE TABLE public.signup_progress ( id uuid NOT
NULL DEFAULT gen_random_uuid(), candidate_id uuid UNIQUE, current_step text NOT NULL,
completed_steps jsonb NOT NULL DEFAULT '[]'::jsonb, step_data jsonb NOT NULL DEFAULT '{}'::jsonb,
created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT
now(), CONSTRAINT signup_progress_pkey PRIMARY KEY (id), CONSTRAINT
signup_progress_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) );
CREATE TABLE public.signup_verification_codes ( id uuid NOT NULL DEFAULT gen_random_uuid(), email
character varying NOT NULL, verification_code character varying NOT NULL, expires_at timestamp with
time zone NOT NULL, used_at timestamp with time zone, created_at timestamp with time zone DEFAULT
now(), updated_at timestamp with time zone DEFAULT now(), CONSTRAINT signup_verification_codes_pkey
PRIMARY KEY (id) ); CREATE TABLE public.skills ( id uuid NOT NULL DEFAULT gen_random_uuid(),
candidate_id uuid, english_level text NOT NULL, other_languages jsonb DEFAULT '[]'::jsonb,
skills_list ARRAY DEFAULT ARRAY[]::text[], qualifications text, created_at timestamp with time zone
DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), CONSTRAINT skills_pkey PRIMARY KEY
(id), CONSTRAINT skills_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES
public.candidates(id) ); CREATE TABLE public.unread_notifications ( id uuid NOT NULL DEFAULT
gen_random_uuid(), candidate_id uuid NOT NULL, message_id uuid NOT NULL, task_type text NOT NULL,
created_at timestamp with time zone NOT NULL DEFAULT now(), read_at timestamp with time zone,
CONSTRAINT unread_notifications_pkey PRIMARY KEY (id), CONSTRAINT
unread_notifications_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id),
CONSTRAINT unread_notifications_message_id_fkey FOREIGN KEY (message_id) REFERENCES
public.messages(id) ); CREATE TABLE public.withdrawn_candidates ( id uuid NOT NULL DEFAULT
gen_random_uuid(), candidate_id text NOT NULL, candidate_name text NOT NULL, email text NOT NULL,
withdrawal_reason text NOT NULL, withdrawal_reason_label text, withdrawn_at timestamp with time zone
DEFAULT now(), created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time
zone DEFAULT now(), CONSTRAINT withdrawn_candidates_pkey PRIMARY KEY (id) ); CREATE TABLE
public.work_experience ( id uuid NOT NULL DEFAULT gen_random_uuid(), candidate_id uuid, industry_id
text NOT NULL, industry_name text NOT NULL, experience_years integer NOT NULL, created_at timestamp
with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), CONSTRAINT
work_experience_pkey PRIMARY KEY (id), CONSTRAINT work_experience_candidate_id_fkey FOREIGN KEY
(candidate_id) REFERENCES public.candidates(id) );
