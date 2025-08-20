import { redirect } from 'next/navigation';
import { requireCandidateAuth } from '@/lib/auth/server';
import { CandidateDashboardClient } from './CandidateDashboardClient';
// 追加: サーバーサイドで求人を取得するためのリポジトリとSupabaseクライアント
import { CandidateRepository } from '@/lib/server/infrastructure/database/CandidateRepository';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

// おすすめ求人取得用の関数
async function getRecommendedJobs(candidateId: string) {
  const candidateRepo = new CandidateRepository();
  const candidate = await candidateRepo.findById(candidateId);

  if (!candidate) return [];

  const client = getSupabaseAdminClient();
  const { data, error } = await client
    .from('job_postings')
    .select('*')
    .overlaps('job_type', candidate.desired_job_types)
    .overlaps('work_location', candidate.desired_locations)
    .overlaps('industry', candidate.desired_industries)
    .eq('status', 'PUBLISHED')
    .limit(10);

  if (error) {
    return [];
  }
  return data || [];
}

export default async function CandidateDashboard() {
  const user = await requireCandidateAuth();

  if (!user) {
    redirect('/candidate/auth/login');
  }

  // サーバーサイドでおすすめ求人を取得
  const jobs = await getRecommendedJobs(user.id);

  return <CandidateDashboardClient user={user} jobs={jobs} />;
}
