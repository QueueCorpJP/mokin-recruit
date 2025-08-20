import { getServerAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import CandidateClient from './CandidateClient';

export default async function CandidatePage() {
  const auth = await getServerAuth();
  if (!auth.isAuthenticated || auth.userType !== 'admin') {
    redirect('/admin/auth/login');
  }
  return <CandidateClient />;
}
