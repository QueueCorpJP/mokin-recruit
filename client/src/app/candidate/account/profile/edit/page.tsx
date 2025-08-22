import { getServerAuth } from '@/lib/auth/server';
import { CandidateRepository } from '@/lib/server/infrastructure/database/CandidateRepository';
import { initializeSupabase } from '@/lib/server/database/supabase';
import { redirect } from 'next/navigation';
import ProfileEditClientWrapper from './ProfileEditClientWrapper';

export default async function ProfileEditPage() {
  // サーバーサイド認証
  const auth = await getServerAuth();
  if (!auth.isAuthenticated || auth.userType !== 'candidate' || !auth.user) {
    redirect('/login');
  }

  // Supabase初期化 & Repository生成
  initializeSupabase();
  const repo = new CandidateRepository();
  const candidate = await repo.findById(auth.user.id);

  if (!candidate) {
    return <div>プロフィール情報が見つかりません。</div>;
  }

  // birth_dateの分解
  let birthYear = '';
  let birthMonth = '';
  let birthDay = '';
  if (candidate.birth_date) {
    const d = new Date(candidate.birth_date);
    birthYear = d.getFullYear().toString();
    birthMonth = (d.getMonth() + 1).toString();
    birthDay = d.getDate().toString();
  }

  // 必要なDTOのみ渡す
  let gender: 'male' | 'female' | 'unspecified' = 'unspecified';
  if (
    candidate.gender === 'male' ||
    candidate.gender === 'female' ||
    candidate.gender === 'unspecified'
  ) {
    gender = candidate.gender;
  }
  const profile = {
    lastName: candidate.last_name || '',
    firstName: candidate.first_name || '',
    lastNameKana: candidate.last_name_kana || '',
    firstNameKana: candidate.first_name_kana || '',
    gender,
    prefecture: candidate.prefecture || '',
    birthYear,
    birthMonth,
    birthDay,
    birth_date: candidate.birth_date || '',
    phoneNumber: candidate.phone_number || '',
    currentIncome: candidate.current_income || '',
  };

  return <ProfileEditClientWrapper profile={profile} />;
}
