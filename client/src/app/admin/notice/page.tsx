import { getServerAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import NoticeClient from './NoticeClient';

export default async function NoticePage() {
  const auth = await getServerAuth();
  if (!auth.isAuthenticated || auth.userType !== 'admin') {
    redirect('/admin/auth/login');
  }
  return <NoticeClient />;
}
