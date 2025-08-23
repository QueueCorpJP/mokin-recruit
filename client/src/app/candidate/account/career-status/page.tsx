import { redirect } from 'next/navigation';
import { requireCandidateAuth } from '@/lib/auth/server';
import { getCandidateData } from '@/lib/server/candidate/candidateData';
import PageLayout from '@/components/candidate/account/PageLayout';
import ContentCard from '@/components/candidate/account/ContentCard';
import SectionHeader from '@/components/candidate/account/SectionHeader';
import DataRow from '@/components/candidate/account/DataRow';
import EditButton from '@/components/candidate/account/EditButton';

// 転職希望時期の表示名を取得
function getJobChangeTimingDisplay(timing?: string) {
  const timingMap = {
    'immediately': 'すぐにでも',
    '1-3months': '1〜3ヶ月以内',
    '3-6months': '3〜6ヶ月以内',
    '6months-1year': '6ヶ月〜1年以内',
    'over-1year': '1年以降',
    'undecided': '時期未定'
  };
  return timingMap[timing as keyof typeof timingMap] || '未設定';
}

// 転職活動状況の表示名を取得
function getCareerChangeStatusDisplay(status?: string) {
  const statusMap = {
    'active': '積極的に転職活動中',
    'casual': 'よい求人があれば検討',
    'research': '情報収集中',
    'inactive': '活動していない'
  };
  return statusMap[status as keyof typeof statusMap] || '未設定';
}

// 候補者_転職活動状況確認ページ
export default async function CandidateCareerStatusPage() {
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
      breadcrumb="転職活動状況" 
      title="転職活動状況"
    >
      <ContentCard>
        {/* 転職活動状況セクション */}
        <div className="mb-6 lg:mb-6">
          <SectionHeader title="転職活動状況" />
          
          <div className="space-y-6 lg:space-y-2">
            {/* 転職希望時期 */}
            <DataRow label="転職希望時期">
              <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                {getJobChangeTimingDisplay(candidateData.job_change_timing)}
              </div>
            </DataRow>

            {/* 現在の活動状況 */}
            <DataRow label="現在の活動状況">
              <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                {getCareerChangeStatusDisplay(candidateData.current_activity_status)}
              </div>
            </DataRow>
          </div>
        </div>

        {/* 選考状況セクション */}
        <div>
          <SectionHeader title="選考状況" />
          
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="text-[16px] text-[#999999] font-medium tracking-[1.6px]">
                選考状況はまだ登録されていません
              </div>
            </div>
          </div>
        </div>
      </ContentCard>

      {/* 編集ボタン */}
      <EditButton editPath="/candidate/account/career-status/edit" />
    </PageLayout>
  );
}
