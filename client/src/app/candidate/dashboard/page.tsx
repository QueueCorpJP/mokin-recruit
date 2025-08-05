import { redirect } from 'next/navigation';
import { requireCandidateAuth } from '@/lib/auth/server';
import { CandidateDashboardClient } from './CandidateDashboardClient';

export default async function CandidateDashboard() {
  const user = await requireCandidateAuth();

  if (!user) {
    redirect('/candidate/auth/login');
  }

  return <CandidateDashboardClient user={user} />;
}