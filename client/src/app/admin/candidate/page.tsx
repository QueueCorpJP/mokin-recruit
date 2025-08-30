import CandidateClient from './CandidateClient';
import React, { Suspense } from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { unstable_cache } from 'next/cache';

export type CandidateListItem = {
  id: string;
  last_login_at: string | null;
  last_name: string | null;
  first_name: string | null;
  current_position: string | null;
  gender: 'male' | 'female' | 'unspecified' | null;
  birth_date: string | null;
  current_income: string | null;
  phone_number: string | null;
  email: string;
  recent_job_company_name: string | null;
};

const getCachedCandidates = unstable_cache(
  async (): Promise<CandidateListItem[]> => {
    return fetchAdminCandidateList();
  },
  ['admin-candidates'],
  {
    revalidate: 60,
    tags: ['candidates']
  }
);

async function fetchAdminCandidateList(): Promise<CandidateListItem[]> {
  const supabase = getSupabaseAdminClient();
  
  try {
    const { data, error } = await supabase
      .from('candidates')
      .select(
        `
        id,
        last_login_at,
        last_name,
        first_name,
        current_position,
        gender,
        birth_date,
        current_income,
        phone_number,
        email,
        recent_job_company_name
      `
      )
      .order('last_login_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    if (!data) {
      console.error('No data returned from candidates query');
      return [];
    }
    
    return data as unknown as CandidateListItem[];
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="bg-white rounded-lg p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function CandidatePage() {
  try {
    const candidates = await getCachedCandidates();
    return (
      <Suspense fallback={<LoadingState />}>
        <CandidateClient candidates={candidates} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in CandidatePage:', error);
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center mt-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">データの取得に失敗しました</h1>
          <p className="text-gray-600">候補者情報を読み込めませんでした。しばらく時間をおいて再度お試しください。</p>
        </div>
      </div>
    );
  }
}
