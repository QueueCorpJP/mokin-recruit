-- Create storage buckets and RLS policies for image uploads
-- This fixes "new row violates row-level security policy" errors

-- 1) Create 'blog' bucket for admin content images
do $$
begin
  if not exists (
    select 1 from storage.buckets where id = 'blog'
  ) then
    perform storage.create_bucket(
      id => 'blog',
      public => true
    );
  end if;
end $$;

-- 2) Create 'job-images' bucket for company job posting images
do $$
begin
  if not exists (
    select 1 from storage.buckets where id = 'job-images'
  ) then
    perform storage.create_bucket(
      id => 'job-images',
      public => true
    );
  end if;
end $$;

-- 3) RLS Policies for 'blog' bucket
-- Allow public read access
drop policy if exists "blog-public-read" on storage.objects;
create policy "blog-public-read"
  on storage.objects
  for select
  using (
    bucket_id = 'blog'
  );

-- Allow users with admin permission in any group to upload
drop policy if exists "blog-auth-upload" on storage.objects;
create policy "blog-auth-upload"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'blog' and
    exists (
      select 1 from company_user_group_permissions
      where company_user_id = (
        select id from company_users where auth_user_id = auth.uid()
      )
      and permission_level = 'ADMIN'
    )
  );

-- Allow users with admin permission in any group to update files
drop policy if exists "blog-auth-update" on storage.objects;
create policy "blog-auth-update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'blog' and
    exists (
      select 1 from company_user_group_permissions
      where company_user_id = (
        select id from company_users where auth_user_id = auth.uid()
      )
      and permission_level = 'ADMIN'
    )
  )
  with check (
    bucket_id = 'blog' and
    exists (
      select 1 from company_user_group_permissions
      where company_user_id = (
        select id from company_users where auth_user_id = auth.uid()
      )
      and permission_level = 'ADMIN'
    )
  );

-- Allow users with admin permission in any group to delete files
drop policy if exists "blog-auth-delete" on storage.objects;
create policy "blog-auth-delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'blog' and
    exists (
      select 1 from company_user_group_permissions
      where company_user_id = (
        select id from company_users where auth_user_id = auth.uid()
      )
      and permission_level = 'ADMIN'
    )
  );

-- 4) RLS Policies for 'job-images' bucket
-- Allow public read access
drop policy if exists "job-images-public-read" on storage.objects;
create policy "job-images-public-read"
  on storage.objects
  for select
  using (
    bucket_id = 'job-images'
  );

-- Allow users with admin permission in any group to upload
drop policy if exists "job-images-auth-upload" on storage.objects;
create policy "job-images-auth-upload"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'job-images' and
    exists (
      select 1 from company_user_group_permissions
      where company_user_id = (
        select id from company_users where auth_user_id = auth.uid()
      )
      and permission_level = 'ADMIN'
    )
  );

-- Allow users with admin permission in any group to update files
drop policy if exists "job-images-auth-update" on storage.objects;
create policy "job-images-auth-update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'job-images' and
    exists (
      select 1 from company_user_group_permissions
      where company_user_id = (
        select id from company_users where auth_user_id = auth.uid()
      )
      and permission_level = 'ADMIN'
    )
  )
  with check (
    bucket_id = 'job-images' and
    exists (
      select 1 from company_user_group_permissions
      where company_user_id = (
        select id from company_users where auth_user_id = auth.uid()
      )
      and permission_level = 'ADMIN'
    )
  );

-- Allow users with admin permission in any group to delete files
drop policy if exists "job-images-auth-delete" on storage.objects;
create policy "job-images-auth-delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'job-images' and
    exists (
      select 1 from company_user_group_permissions
      where company_user_id = (
        select id from company_users where auth_user_id = auth.uid()
      )
      and permission_level = 'ADMIN'
    )
  );
