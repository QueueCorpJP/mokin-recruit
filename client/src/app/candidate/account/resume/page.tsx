import { redirect } from 'next/navigation';
import { requireCandidateAuth } from '@/lib/auth/server';
import { getCandidateData } from '@/lib/server/candidate/candidateData';
import PageLayout from '@/components/candidate/account/PageLayout';
import ContentCard from '@/components/candidate/account/ContentCard';
import SectionHeader from '@/components/candidate/account/SectionHeader';
import DataRow from '@/components/candidate/account/DataRow';
import ResumeUploadSection from './ResumeUploadSection';

export default async function CandidateResumePage() {
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

  return (
    <PageLayout 
      breadcrumb="履歴書・職務経歴書" 
      title="履歴書・職務経歴書"
    >
      <div className="flex flex-col items-center gap-6 lg:gap-10">
       

        {/* ファイルアップロードセクション */}
        <ResumeUploadSection />
      </div>
    </PageLayout>
  );
}
