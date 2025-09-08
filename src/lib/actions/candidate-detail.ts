'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { getCandidateDetailData } from '@/lib/server/candidate/recruitment-queries';

export async function getCandidateDetailAction(candidateId: string) {
  // 認証は一度だけ取得
  const supabase = await getSupabaseServerClient();
  return await getCandidateDetailData(candidateId, supabase);
}
