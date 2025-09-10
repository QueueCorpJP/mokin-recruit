import { redirect } from 'next/navigation';
import { getCachedCandidateUser } from '@/lib/auth/server';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import PageLayout from '@/components/candidate/account/PageLayout';
import ContentCard from '@/components/candidate/account/ContentCard';
import DataRow from '@/components/candidate/account/DataRow';
import EditButton from '@/components/candidate/account/EditButton';
import Section from '@/components/education/common/Section';
import SectionCard from '@/components/education/common/SectionCard';
import { SALARY_OPTIONS } from 'src/constants/expectation';

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

// value→label変換関数
function getLabel(options: any[], value: string) {
  const found = options.find((opt: any) => opt.value === value);
  return found ? found.label : value || '未設定';
}

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
      <SectionCard>
        <Section title='希望条件'>
          <div className='flex flex-col gap-[8px]'>
            <DataRow label='希望年収'>
              <div className='text-[16px] text-[#323232] font-medium tracking-[1.6px]'>
                {getLabel(SALARY_OPTIONS, expectationDisplay.desiredIncome)}
              </div>
            </DataRow>
            <DataRow label='希望業種'>
              {renderTags(expectationDisplay.industries)}
            </DataRow>
            <DataRow label='希望職種'>
              {renderTags(expectationDisplay.jobTypes)}
            </DataRow>
            <DataRow label='希望勤務地'>
              {renderTags(expectationDisplay.workLocations)}
            </DataRow>
            <DataRow label='興味のある働き方'>
              {renderTags(expectationDisplay.workStyles)}
            </DataRow>
          </div>
        </Section>
      </SectionCard>
      <EditButton editPath='/candidate/account/expectation/edit' />
    </PageLayout>
  );
}

export const dynamic = 'force-dynamic';
