import { redirect } from 'next/navigation';
import { requireCandidateAuth } from '@/lib/auth/server';
import { getCandidateData, getEducationData } from '@/lib/server/candidate/candidateData';
import EducationEditForm from './EducationEditForm';

export default async function CandidateEducationEditPage() {
  // 認証チェック
  const user = await requireCandidateAuth();
  if (!user) {
    redirect('/candidate/auth/login');
  }

  // 候補者データを取得
  const candidateData = await getCandidateData(user.id);
  if (!candidateData) {
    redirect('/candidate/auth/login');
  }

  // 学歴データを取得
  const educationData = await getEducationData(user.id);

  return (
    <EducationEditForm 
      candidateData={candidateData} 
      educationData={educationData} 
    />
  );
}
