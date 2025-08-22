import { getServerAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import MemberClient from './MemberClient';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export type AdminUserEntity = {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
};

async function fetchAdminUserList(): Promise<AdminUserEntity[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, email, name, created_at, updated_at, last_login_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as AdminUserEntity[];
}

export default async function MemberPage() {
  const auth = await getServerAuth();
  if (!auth.isAuthenticated || auth.userType !== 'admin') {
    redirect('/admin/auth/login');
  }
  const members = await fetchAdminUserList();
  return <MemberClient members={members} />;
}
