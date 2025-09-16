import { redirect } from 'next/navigation';
import { getCachedCandidateUser } from '@/lib/auth/server';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import {
  PageLayout,
  ContentCard,
  DataRow,
  EditButton,
} from '@/components/candidate/account';

// 配列データを安全に処理する関数
const renderTags = (data: any) => {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <span className='text-[#323232] text-[16px] font-medium tracking-[1.6px]'>
        未設定
      </span>
    );
  }

  const items = Array.isArray(data) ? data : [];
  return (
    <div className='flex flex-wrap gap-2'>
      {items.map((item: any, idx: number) => (
        <span
          key={idx}
          className='bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]'
        >
          {typeof item === 'string' ? item : item.name || item}
        </span>
      ))}
    </div>
  );
};

// 候補者_希望条件確認ページ
export default async function CandidateExpectationPage() {
  // 認証チェック
  const user = await getCachedCandidateUser();
  if (!user) {
    redirect('/candidate/auth/login');
  }

  // expectationsテーブルからデータを取得
  const supabase = await getSupabaseServerClient();
  const { data: expectationData } = await supabase
    .from('expectations')
    .select(
      `
      desired_income,
      desired_industries,
      desired_job_types,
      desired_work_locations,
      desired_work_styles
    `
    )
    .eq('candidate_id', user.id)
    .single();

  // JSONデータをパース
  const parseJsonSafely = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr || '[]');
    } catch {
      return [];
    }
  };

  const expectationDisplay = {
    desiredIncome: expectationData?.desired_income || '',
    industries: parseJsonSafely(expectationData?.desired_industries || '[]'),
    jobTypes: parseJsonSafely(expectationData?.desired_job_types || '[]'),
    workLocations: parseJsonSafely(
      expectationData?.desired_work_locations || '[]'
    ),
    workStyles: parseJsonSafely(expectationData?.desired_work_styles || '[]'),
  };

  return (
    <PageLayout breadcrumb='希望条件' title='希望条件'>
      <ContentCard>
        {/* 希望条件セクション */}
        <div className='space-y-6 lg:space-y-2'>
          {/* 希望年収 */}
          <DataRow label='希望年収'>
            <div className='text-[16px] text-[#323232] font-medium tracking-[1.6px]'>
              {expectationDisplay.desiredIncome || '未設定'}
            </div>
          </DataRow>

          {/* 希望業種 */}
          <DataRow label='希望業種'>
            {renderTags(expectationDisplay.industries)}
          </DataRow>

          {/* 希望職種 */}
          <DataRow label='希望職種'>
            {renderTags(expectationDisplay.jobTypes)}
          </DataRow>

          {/* 希望勤務地 */}
          <DataRow label='希望勤務地'>
            {renderTags(expectationDisplay.workLocations)}
          </DataRow>

          {/* 興味のある働き方 */}
          <DataRow label='興味のある働き方'>
            {renderTags(expectationDisplay.workStyles)}
          </DataRow>
        </div>
      </ContentCard>

      <EditButton editPath='/candidate/account/expectation/edit' />
    </PageLayout>
  );
}
