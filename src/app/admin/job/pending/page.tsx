import PendingTableClient, { PendingJobListItem } from './PendingTableClient';
import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

async function fetchPendingJobList(
  page: number = 1,
  pageSize: number = 20
): Promise<PendingJobListItem[]> {
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
    .eq('status', 'PENDING_APPROVAL')
    .order('updated_at', { ascending: false })
    .range(from, to);
  if (error) {
    throw new Error(error.message);
  }
  return data as unknown as PendingJobListItem[];
}

export default async function PendingPage() {
  const jobs = await fetchPendingJobList(1, 20);
  return <PendingTableClient jobs={jobs} />;
}