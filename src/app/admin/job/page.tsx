import JobTableClient, { AdminJobListItem } from './JobTableClient';
import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

async function fetchAdminJobList(
  page: number = 1,
  pageSize: number = 10
): Promise<AdminJobListItem[]> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('job_postings')
    .select(
      `
      id,
      updated_at,
      status,
      publication_type,
      job_type,
      title,
      company_accounts (
        company_name
      )
    `
    )
    .order('updated_at', { ascending: false })
    .range(from, to);
  if (error) {
    throw new Error(error.message);
  }
  return data as unknown as AdminJobListItem[];
}

export default async function Job() {
  const jobs = await fetchAdminJobList(1, 10);
  return <JobTableClient jobs={jobs} />;
}
