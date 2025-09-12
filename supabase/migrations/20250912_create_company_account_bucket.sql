-- Create public storage bucket for company account assets
-- Bucket: company-account (public)

-- 1) Create bucket if it does not exist
do $$
begin
  if not exists (
    select 1 from storage.buckets where id = 'company-account'
  ) then
    perform storage.create_bucket(
      id => 'company-account',
      public => true
    );
  end if;
end $$;

-- 2) Policies on storage.objects for bucket `company-account`
-- Allow public read (anon + authenticated)
drop policy if exists "company-account-public-read" on storage.objects;
create policy "company-account-public-read"
  on storage.objects
  for select
  using (
    bucket_id = 'company-account'
  );

-- Allow authenticated users to upload to this bucket
drop policy if exists "company-account-auth-upload" on storage.objects;
create policy "company-account-auth-upload"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'company-account'
  );

-- Allow authenticated users to update their own files in this bucket
drop policy if exists "company-account-auth-update-own" on storage.objects;
create policy "company-account-auth-update-own"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'company-account' and owner = auth.uid()
  )
  with check (
    bucket_id = 'company-account' and owner = auth.uid()
  );

-- Allow authenticated users to delete their own files in this bucket
drop policy if exists "company-account-auth-delete-own" on storage.objects;
create policy "company-account-auth-delete-own"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'company-account' and owner = auth.uid()
  );


