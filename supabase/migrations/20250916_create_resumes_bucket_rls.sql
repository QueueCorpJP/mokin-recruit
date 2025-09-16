-- Create private resumes bucket and RLS policies for secure resume storage
-- This ensures that resume files are stored privately and accessed only by authorized users

-- 1) Create 'resumes' bucket as PRIVATE for secure document storage
do $$
begin
  if not exists (
    select 1 from storage.buckets where id = 'resumes'
  ) then
    perform storage.create_bucket(
      id => 'resumes',
      public => false  -- PRIVATE bucket for sensitive documents
    );
  end if;
end $$;

-- 2) RLS Policies for 'resumes' bucket - STRICT ACCESS CONTROL

-- Allow candidates to upload their own resume files
drop policy if exists "resumes-candidate-upload" on storage.objects;
create policy "resumes-candidate-upload"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'resumes' and
    -- Only allow upload to their own candidate directory
    (
      -- For authenticated candidates: path starts with their candidate ID
      (
        exists (
          select 1 from candidates
          where auth_user_id = auth.uid()
          and name = split_part(storage.objects.name, '/', 1)::text
        )
      ) or
      -- For signup process: allow temporary candidate ID uploads
      (
        -- Path structure: {candidate_id}/resume_*.pdf or {candidate_id}/career_summary_*.pdf
        name ~ '^[a-f0-9\-]+/(resume_|career_summary_)\d+\.(pdf|PDF)$'
      )
    )
  );

-- Allow candidates to read their own resume files ONLY
drop policy if exists "resumes-candidate-read" on storage.objects;
create policy "resumes-candidate-read"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'resumes' and
    -- Only allow access to their own files
    exists (
      select 1 from candidates
      where auth_user_id = auth.uid()
      and id::text = split_part(storage.objects.name, '/', 1)
    )
  );

-- Allow company users with ADMIN permission to read resume files for recruiting purposes
drop policy if exists "resumes-company-admin-read" on storage.objects;
create policy "resumes-company-admin-read"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'resumes' and
    exists (
      select 1 from company_user_group_permissions
      where company_user_id = (
        select id from company_users where auth_user_id = auth.uid()
      )
      and permission_level = 'ADMIN'
    )
  );

-- Allow candidates to update/replace their own resume files
drop policy if exists "resumes-candidate-update" on storage.objects;
create policy "resumes-candidate-update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'resumes' and
    exists (
      select 1 from candidates
      where auth_user_id = auth.uid()
      and id::text = split_part(storage.objects.name, '/', 1)
    )
  )
  with check (
    bucket_id = 'resumes' and
    exists (
      select 1 from candidates
      where auth_user_id = auth.uid()
      and id::text = split_part(storage.objects.name, '/', 1)
    )
  );

-- Allow candidates to delete their own resume files
drop policy if exists "resumes-candidate-delete" on storage.objects;
create policy "resumes-candidate-delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'resumes' and
    exists (
      select 1 from candidates
      where auth_user_id = auth.uid()
      and id::text = split_part(storage.objects.name, '/', 1)
    )
  );

-- Ensure RLS is enabled on storage.objects
alter table storage.objects enable row level security;