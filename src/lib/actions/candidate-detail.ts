'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { getCandidateDetailData } from '@/lib/server/candidate/recruitment-queries';
import { unstable_cache } from 'next/cache';

export async function getCandidateDetailAction(candidateId: string, companyGroupId?: string) {
  // 認証は一度だけ取得
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userIdForCache = user?.id || 'guest';

  const cachedFetch = unstable_cache(
    async () => {
      return await getCandidateDetailData(candidateId, supabase, companyGroupId);
    },
    ['candidate-detail', userIdForCache, candidateId, companyGroupId || 'none'],
    { revalidate: 60 }
  );

  return await cachedFetch();
}