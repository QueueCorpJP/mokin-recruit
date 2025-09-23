import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { AdminPageTitle } from '@/components/admin/AdminPageTitle';
import AddNGKeywordButton from './AddNGKeywordButton';
import NGKeywordListClient from './NGKeywordListClient';

export const dynamic = 'force-dynamic';

// NGキーワード型
interface NGKeywordItem {
  id: string;
  created_at: string;
  keyword: string;
}

// NGキーワード一覧取得
async function fetchNGKeywords(): Promise<NGKeywordItem[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('ng_keywords')
    .select('id, created_at, keyword')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching NG keywords:', error);
    return [];
  }
  return data || [];
}

export default async function NGWordPage() {
  const ngKeywords = await fetchNGKeywords();

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='bg-white rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <NGKeywordListClient ngKeywords={ngKeywords} />
        </div>
      </div>
      <AddNGKeywordButton />
    </div>
  );
}
