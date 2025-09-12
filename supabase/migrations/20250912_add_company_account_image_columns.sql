-- Add columns for company account images if not exist
alter table public.company_accounts
  add column if not exists logo_url text;

alter table public.company_accounts
  add column if not exists image_urls text[] default '{}'::text[];


