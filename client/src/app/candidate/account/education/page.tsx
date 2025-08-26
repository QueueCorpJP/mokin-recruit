import { getCandidateData, getEducationData } from '@/lib/server/candidate/candidateData';
import PageLayout from '@/components/candidate/account/PageLayout';
import ContentCard from '@/components/candidate/account/ContentCard';
import SectionHeader from '@/components/candidate/account/SectionHeader';
import DataRow from '@/components/candidate/account/DataRow';
import EditButton from '@/components/candidate/account/EditButton';

// 最終学歴の表示名を取得
function getFinalEducationDisplay(finalEducation?: string) {
  const educationMap = {
    'high-school': '高校卒業',
    'vocational-school': '専門学校卒業',
    'junior-college': '短期大学卒業',
    'university': '大学卒業',
    'graduate-school': '大学院卒業'
  };
  return educationMap[finalEducation as keyof typeof educationMap] || '未設定';
}

// 卒業年月を整形
function formatGraduationDate(year?: number, month?: number) {
  if (!year || !month) return { year: 'yyyy', month: 'mm' };
  return {
    year: year.toString(),
    month: month.toString().padStart(2, '0')
  };
}

// 学歴・経験業種/職種確認ページ
export default async function CandidateEducationPage() {

  // 候補者データを取得
  const candidateData = await getCandidateData(user.id);
  if (!candidateData) {
    redirect('/candidate/auth/login');
  }

  // 学歴データを取得
  const educationData = await getEducationData(user.id);

  // 卒業年月の整形
  const graduationDate = formatGraduationDate(
    educationData?.graduation_year,
    educationData?.graduation_month
  );

  return (
    <PageLayout 
      breadcrumb="学歴・経験業種/職種" 
      title="学歴・経験業種/職種"
    >
      <ContentCard>
        {/* 学歴セクション */}
        <div className="mb-6 lg:mb-6">
          <SectionHeader title="学歴" />
          
          <div className="space-y-6 lg:space-y-2">
            {/* 最終学歴 */}
            <DataRow label="最終学歴">
              <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                {getFinalEducationDisplay(educationData?.final_education)}
              </div>
            </DataRow>

            {/* 学校名 */}
            <DataRow label="学校名">
              <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                {educationData?.school_name || '未設定'}
              </div>
            </DataRow>

            {/* 学部学科専攻 */}
            <DataRow label="学部学科専攻">
              <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                {educationData?.department || '未設定'}
              </div>
            </DataRow>

            {/* 卒業年月 */}
            <DataRow label="卒業年月">
              <div className="flex flex-wrap gap-2 items-center text-[16px] text-[#323232] tracking-[1.6px]">
                <span className="font-medium">{graduationDate.year}</span>
                <span className="font-bold">年</span>
                <span className="font-medium">{graduationDate.month}</span>
                <span className="font-bold">月</span>
              </div>
            </DataRow>
          </div>
        </div>

        {/* 今までに経験した業種・職種セクション */}
        <div>
          <SectionHeader title="今までに経験した業種・職種" />
          
          <div className="space-y-6 lg:space-y-2">
            {/* 業種 */}
            <DataRow label="業種">
              <div className="flex flex-wrap gap-2">
                {candidateData.desired_industries && candidateData.desired_industries.length > 0 ? (
                  candidateData.desired_industries.map((industry, index) => (
                    <span
                      key={index}
                      className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]"
                    >
                      {industry}
                    </span>
                  ))
                ) : (
                  <span className="text-[16px] text-[#999999] font-medium tracking-[1.6px]">
                    未設定
                  </span>
                )}
              </div>
            </DataRow>

            {/* 職種 */}
            <DataRow label="職種">
              <div className="flex flex-wrap gap-2">
                {candidateData.desired_job_types && candidateData.desired_job_types.length > 0 ? (
                  candidateData.desired_job_types.map((jobType, index) => (
                    <span
                      key={index}
                      className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]"
                    >
                      {jobType}
                    </span>
                  ))
                ) : (
                  <span className="text-[16px] text-[#999999] font-medium tracking-[1.6px]">
                    未設定
                  </span>
                )}
              </div>
            </DataRow>
          </div>
        </div>
      </ContentCard>

      {/* 編集ボタン */}
      <EditButton editPath="/candidate/account/education/edit" />
    </PageLayout>
  );
}
