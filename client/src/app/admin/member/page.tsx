import { getServerAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import MemberClient from './MemberClient';

export default async function MemberPage() {
  const auth = await getServerAuth();
  if (!auth.isAuthenticated || auth.userType !== 'admin') {
    redirect('/admin/auth/login');
  }
  return <MemberClient />;
}
