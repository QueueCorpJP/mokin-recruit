import React from 'react';
import NoticeTableClient, { AdminNoticeListItem } from './NoticeTableClient';
import { createServerAdminClient } from '@/lib/supabase/server-admin';

async function fetchAdminNoticeList(
  page: number = 1,
  pageSize: number = 10
): Promise<AdminNoticeListItem[]> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const supabase = createServerAdminClient();
  const { data, error } = await supabase
    .from('notices')
    .select(
      `
      id,
      title,
      slug,
      status,
      published_at,
      created_at,
      updated_at,
      views_count
    `
    )
    .order('updated_at', { ascending: false })
    .range(from, to);
  if (error) {
    throw new Error(error.message);
  }
  return data as unknown as AdminNoticeListItem[];
}

export default async function Notice() {
  const notices = await fetchAdminNoticeList(1, 10);
  return <NoticeTableClient notices={notices} />;
}