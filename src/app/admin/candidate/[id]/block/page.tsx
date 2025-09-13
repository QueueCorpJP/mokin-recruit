import React, { Suspense } from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { unstable_cache } from 'next/cache';
import BlockedCompanyClient from './BlockedCompanyClient';

export type BlockedCompanyItem = {
  id: string;
  candidate_id: string;
  company_names: string[];
  created_at: string;
  updated_at: string;
};

const getCachedBlockedCompanies = unstable_cache(
  async (candidateId: string): Promise<BlockedCompanyItem[]> => {
    return fetchBlockedCompanies(candidateId);
  },
  ['blocked-companies'],
  {
    revalidate: 60,
    tags: ['blocked-companies']
  }
);

async function fetchBlockedCompanies(candidateId: string): Promise<BlockedCompanyItem[]> {
  const supabase = getSupabaseAdminClient();
  
  try {
    if (process.env.NODE_ENV === 'development') console.log('Fetching blocked companies for candidate_id:', candidateId);
    
    const { data, error } = await supabase
      .from('blocked_companies')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false });
    
    if (error) {
      if (process.env.NODE_ENV === 'development') console.error('Supabase error:', error);
      if (process.env.NODE_ENV === 'development') console.error('Trying with string conversion...');
      
      // Try with string conversion (same as candidate actions)
      const { data: dataStr, error: errorStr } = await supabase
        .from('blocked_companies')
        .select('*')
        .eq('candidate_id', String(candidateId))
        .order('created_at', { ascending: false });
      
      if (errorStr) {
        if (process.env.NODE_ENV === 'development') console.error('String conversion also failed:', errorStr);
        throw new Error(`Database error: ${error.message}`);
      }
      
      if (process.env.NODE_ENV === 'development') console.log('Found blocked companies with string conversion:', dataStr);
      return dataStr as BlockedCompanyItem[] || [];
    }
    
    if (process.env.NODE_ENV === 'development') console.log('Found blocked companies:', data);
    
    if (!data) {
      return [];
    }
    
    return data as BlockedCompanyItem[];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching blocked companies:', error);
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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BlockedCompaniesPage({ params }: PageProps) {
  const { id: candidateId } = await params;
  
  if (!candidateId) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center mt-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">候補者が見つかりません</h1>
          <p className="text-gray-600">候補者IDが指定されていません。</p>
        </div>
      </div>
    );
  }
  
  try {
    const blockedCompanies = await getCachedBlockedCompanies(candidateId);
    return (
      <Suspense fallback={<LoadingState />}>
        <BlockedCompanyClient 
          blockedCompanies={blockedCompanies} 
          candidateId={candidateId}
        />
      </Suspense>
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error in BlockedCompaniesPage:', error);
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center mt-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">データの取得に失敗しました</h1>
          <p className="text-gray-600">ブロック企業情報を読み込めませんでした。しばらく時間をおいて再度お試しください。</p>
        </div>
      </div>
    );
  }
}