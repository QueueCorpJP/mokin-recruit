import { redirect } from 'next/navigation';
import { getCachedCandidateUser } from '@/lib/auth/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import ProfileEditForm from './ProfileEditForm';


// 候補者データの型定義
interface CandidateData {
  id: string;
  email: string;
  last_name?: string;
  first_name?: string;
  last_name_kana?: string;
  first_name_kana?: string;
  phone_number?: string;
  current_residence?: string;
  prefecture?: string;
  gender?: string;
  birth_date?: string;
  current_income?: string;
}

// 候補者データを取得する関数
async function getCandidateData(candidateId: string): Promise<CandidateData | null> {
  try {
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('candidates')
      .select(`
        id,
        email,
        last_name,
        first_name,
        last_name_kana,
        first_name_kana,
        phone_number,
        current_residence,
        prefecture,
        gender,
        birth_date,
        current_income
      `)
      .eq('id', candidateId)
      .single();

    if (error) {
      console.error('候補者データの取得に失敗しました:', error);
      return null;
    }

    return data as CandidateData;
  } catch (error) {
    console.error('データベースエラー:', error);
    return null;
  }
}

export default async function ProfileEditPage() {
  // 認証チェック
  const user = await getCachedCandidateUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  if (!user) {
    redirect('/candidate/auth/login');
  }

  // 候補者データを取得
  const candidateData = await getCandidateData(user.id);
  if (!candidateData) {
    redirect('/candidate/auth/login');
  }

  return (
    <ProfileEditForm candidateData={candidateData} />
  );
}

export const dynamic = 'force-dynamic';
