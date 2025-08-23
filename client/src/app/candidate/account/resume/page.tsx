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
        <ContentCard>
          {/* アップロード済みファイル表示セクション */}
          <div className="mb-6 lg:mb-6">
            <SectionHeader title="アップロード済みファイル" />
            
            <div className="space-y-6 lg:space-y-2">
              {/* 履歴書 */}
              <DataRow label="履歴書">
                <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                  {candidateData.resume_filename || '未アップロード'}
                  {candidateData.resume_uploaded_at && (
                    <div className="text-[14px] text-[#999999] mt-1">
                      アップロード日時: {new Date(candidateData.resume_uploaded_at).toLocaleDateString('ja-JP')}
                    </div>
                  )}
                </div>
              </DataRow>

              {/* 職務経歴書 */}
              <DataRow label="職務経歴書">
                <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                  未対応
                </div>
              </DataRow>
            </div>
          </div>
        </ContentCard>

        {/* ファイルアップロードセクション */}
        <ResumeUploadSection />
      </div>
    </PageLayout>
  );
}
