import { getServerAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import NoticeClient from './NoticeClient';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export type NoticeItem = {
  id: string;
  status: string;
  updated_at: string;
  title: string;
};

async function fetchNoticeList(): Promise<NoticeItem[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('notices')
    .select('id, status, updated_at, title')
    .order('updated_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as NoticeItem[];
}

export default async function NoticePage() {
  const auth = await getServerAuth();
  if (!auth.isAuthenticated || auth.userType !== 'admin') {
    redirect('/admin/auth/login');
  }
  const notices = await fetchNoticeList();
  return <NoticeClient notices={notices} />;
}
