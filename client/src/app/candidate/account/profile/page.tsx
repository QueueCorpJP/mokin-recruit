import { getServerAuth } from '@/lib/auth/server';
import { CandidateRepository } from '@/lib/server/infrastructure/database/CandidateRepository';
import { initializeSupabase } from '@/lib/server/database/supabase';
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';

export default async function CandidateBasicInfoPage() {
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
  const profile = {
    lastName: candidate.last_name || '',
    firstName: candidate.first_name || '',
    lastNameKana: candidate.last_name_kana || '',
    firstNameKana: candidate.first_name_kana || '',
    gender: candidate.gender || '',
    prefecture: candidate.prefecture || '',
    birthYear,
    birthMonth,
    birthDay,
    phoneNumber: candidate.phone_number || '',
    currentIncome: candidate.current_income || '',
  };

  return <ProfileClient profile={profile} />;
}
