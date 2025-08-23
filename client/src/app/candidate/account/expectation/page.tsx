import { redirect } from 'next/navigation';
import { requireCandidateAuth } from '@/lib/auth/server';
import { getCandidateData } from '@/lib/server/candidate/candidateData';
import PageLayout from '@/components/candidate/account/PageLayout';
import ContentCard from '@/components/candidate/account/ContentCard';
import DataRow from '@/components/candidate/account/DataRow';
import EditButton from '@/components/candidate/account/EditButton';

// 配列データを安全に処理する関数
const renderTags = (data: any) => {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <span className="text-[#323232] text-[16px] font-medium tracking-[1.6px]">未設定</span>;
  }
  
  const items = Array.isArray(data) ? data : [];
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item: string, idx: number) => (
        <span
          key={idx}
          className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

// 候補者_希望条件確認ページ
export default async function CandidateExpectationPage() {
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
      breadcrumb="希望条件" 
      title="希望条件"
    >
      <ContentCard>
        {/* 希望条件セクション */}
        <div className="space-y-6 lg:space-y-2">
          {/* 希望年収 */}
          <DataRow label="希望年収">
            <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
              {candidateData.desired_salary || candidateData.current_income || '未設定'}
            </div>
          </DataRow>

          {/* 希望業種 */}
          <DataRow label="希望業種">
            {renderTags(candidateData.desired_industries)}
          </DataRow>

          {/* 希望職種 */}
          <DataRow label="希望職種">
            {renderTags(candidateData.desired_job_types)}
          </DataRow>

          {/* 希望勤務地 */}
          <DataRow label="希望勤務地">
            {renderTags(candidateData.desired_locations)}
          </DataRow>

          {/* 興味のある働き方 */}
          <DataRow label="興味のある働き方">
            {renderTags(candidateData.interested_work_styles)}
          </DataRow>
        </div>
      </ContentCard>
      
      <EditButton editPath="/candidate/account/expectation/edit" />
    </PageLayout>
  );
}
