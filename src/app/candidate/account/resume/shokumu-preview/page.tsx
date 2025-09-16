import { redirect } from 'next/navigation';
import { getCachedCandidateUser } from '@/lib/auth/server';
import { getCandidateData } from '@/lib/server/candidate/candidateData';

// 区切り線のSVGコンポーネント
const DividerLine = () => (
  <div className='h-0 relative shrink-0 w-full'>
    <div className='absolute bottom-[-1px] left-0 right-0 top-[-1px]'>
      <svg
        width='100%'
        height='2'
        viewBox='0 0 640 2'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <line x1='0' y1='1' x2='640' y2='1' stroke='#EFEFEF' strokeWidth='2' />
      </svg>
    </div>
  </div>
);

// 業務内容の行コンポーネント（複数行対応）
interface ContentRowProps {
  label: string;
  value: string;
  isMultiLine?: boolean;
}

const ContentRow = ({ label, value, isMultiLine = false }: ContentRowProps) => (
  <div className='box-border content-stretch flex gap-2 items-start justify-start overflow-clip p-0 relative shrink-0 w-full'>
    <div className='bg-[#f9f9f9] box-border content-stretch flex flex-col gap-3 items-start justify-center min-h-[50px] px-6 py-3 relative rounded-[5px] self-stretch shrink-0 w-[200px]'>
      <div className="font-['Noto_Sans_JP'] font-bold leading-[0] relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px] w-full">
        <p className='block leading-[2]'>{label}</p>
      </div>
    </div>
    <div className='basis-0 bg-[#ffffff] box-border content-stretch flex gap-3 grow items-center justify-start min-h-px min-w-px p-[12px] relative rounded-[5px] shrink-0'>
      <div
        className={`basis-0 font-['Noto_Sans_JP'] font-medium grow ${isMultiLine ? 'leading-[2]' : 'leading-[0]'} min-h-px min-w-px relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px]`}
      >
        {isMultiLine ? (
          <div className='whitespace-pre-wrap'>
            {value.split('\n').map((line, index, array) => (
              <p
                key={index}
                className={`block ${index < array.length - 1 ? 'mb-0' : ''}`}
              >
                {line}
              </p>
            ))}
          </div>
        ) : (
          <p className='block leading-[2]'>{value}</p>
        )}
      </div>
    </div>
  </div>
);

// 企業職歴のコンポーネント
interface CompanyCareerProps {
  companyName: string;
  period: string;
  department: string;
  industry: string;
  jobType: string;
  workContent: string;
}

const CompanyCareer = ({
  companyName,
  period,
  department,
  industry,
  jobType,
  workContent,
}: CompanyCareerProps) => (
  <div className='box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative rounded-[10px] shrink-0 w-full'>
    {/* 企業名と期間 */}
    <div className='box-border content-stretch flex gap-6 items-center justify-start leading-[0] p-0 relative shrink-0 w-full'>
      <div className="basis-0 font-['Noto_Sans_JP'] font-bold grow min-h-px min-w-px relative shrink-0 text-[#323232] text-[20px] tracking-[2px]">
        <p className='block leading-[1.6]'>{companyName}</p>
      </div>
      <div className="font-['Noto_Sans_JP'] font-medium relative shrink-0 text-[#999999] text-[14px] text-nowrap tracking-[1.4px]">
        <p className='block leading-[1.6] whitespace-pre'>{period}</p>
      </div>
    </div>

    {/* 区切り線 */}
    <DividerLine />

    {/* 詳細情報 */}
    <ContentRow label='部署名・役職名' value={department} />
    <ContentRow label='業種' value={industry} />
    <ContentRow label='職種' value={jobType} />
    <ContentRow label='業務内容' value={workContent} isMultiLine />
  </div>
);

// セクション見出しコンポーネント
interface SectionProps {
  title: string;
  content: string;
}

const Section = ({ title, content }: SectionProps) => (
  <div className='box-border content-stretch flex flex-col gap-2 items-start justify-start overflow-clip p-0 relative shrink-0 w-full'>
    <div className='bg-[#f9f9f9] box-border content-stretch flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 relative rounded-[5px] shrink-0 w-full'>
      <div className="font-['Noto_Sans_JP'] font-bold leading-[0] relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px] w-full">
        <p className='block leading-[2]'>{title}</p>
      </div>
    </div>
    <div className='bg-[#ffffff] box-border content-stretch flex gap-6 items-center justify-start p-[12px] relative rounded-[5px] shrink-0 w-full'>
      <div className="basis-0 font-['Noto_Sans_JP'] font-medium grow leading-[2] min-h-px min-w-px relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px]">
        <div className='whitespace-pre-wrap'>
          {content.split('\n').map((line, index, array) => (
            <p
              key={index}
              className={`block ${index < array.length - 1 ? 'mb-0' : ''}`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// 印刷用のスタイル
const printStyles = `
  @media print {
    body {
      margin: 0;
      padding: 0;
    }
    .no-print {
      display: none !important;
    }
    .print-container {
      padding: 0 !important;
      width: 100% !important;
      max-width: none !important;
    }
  }
  @page {
    size: A4;
    margin: 20mm;
  }
`;

export default async function ShokumuPreviewPage() {
  // 認証チェック
  const user = await getCachedCandidateUser();
  if (!user) {
    redirect('/candidate/auth/login');
  }

  // 候補者データを取得
  const candidateData = await getCandidateData(user.id);
  if (!candidateData) {
    redirect('/candidate/auth/login');
  }

  // 職歴データを取得・整形
  const getJobHistories = () => {
    // recent_job_industriesフィールドからジョブ履歴を取得
    if (
      candidateData.recent_job_industries &&
      Array.isArray(candidateData.recent_job_industries)
    ) {
      // 複数職歴の場合
      return candidateData.recent_job_industries.map((job: any) => ({
        companyName: job.companyName || '企業名未設定',
        period: `${job.startYear || 'yyyy'}/${job.startMonth?.padStart(2, '0') || 'mm'}〜${job.isCurrentlyWorking ? '現在' : `${job.endYear || 'yyyy'}/${job.endMonth?.padStart(2, '0') || 'mm'}`}`,
        department: job.departmentPosition || '部署名・役職名未設定',
        industry: Array.isArray(job.industries)
          ? job.industries.join('、')
          : job.industries || '業種未設定',
        jobType: Array.isArray(job.jobTypes)
          ? job.jobTypes.map((jt: any) => jt.name || jt).join('、')
          : job.jobTypes || '職種未設定',
        workContent: job.jobDescription || '業務内容未設定',
      }));
    }

    // 単一職歴の場合（後方互換性）
    if (candidateData.recent_job_company_name) {
      return [
        {
          companyName: candidateData.recent_job_company_name,
          period: `${candidateData.recent_job_start_year || 'yyyy'}/${candidateData.recent_job_start_month?.padStart(2, '0') || 'mm'}〜${candidateData.recent_job_is_currently_working ? '現在' : `${candidateData.recent_job_end_year || 'yyyy'}/${candidateData.recent_job_end_month?.padStart(2, '0') || 'mm'}`}`,
          department:
            candidateData.recent_job_department_position ||
            '部署名・役職名未設定',
          industry: Array.isArray(candidateData.recent_job_types)
            ? candidateData.recent_job_types
                .map((industry: any) => industry.name || industry)
                .join('、')
            : '業種未設定',
          jobType: Array.isArray(candidateData.recent_job_types)
            ? candidateData.recent_job_types
                .map((jobType: any) => jobType.name || jobType)
                .join('、')
            : '職種未設定',
          workContent: candidateData.recent_job_description || '業務内容未設定',
        },
      ];
    }

    // データがない場合のデフォルト
    return [
      {
        companyName: '企業名未設定',
        period: 'yyyy/mm〜yyyy/mm',
        department: '部署名・役職名未設定',
        industry: '業種未設定',
        jobType: '職種未設定',
        workContent: '業務内容未設定',
      },
    ];
  };

  const userData = {
    jobSummary: candidateData.job_summary || '職務要約が未設定です。',
    careers: getJobHistories(),
    selfPR: candidateData.self_pr || '自己PR・その他が未設定です。',
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* 印刷スタイル */}
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      {/* メインコンテンツ（印刷対象） */}
      <div className='print-container bg-[#ffffff] box-border content-stretch flex flex-col gap-10 items-center justify-start px-0 lg:px-[400px] py-6 lg:py-[120px] relative w-full'>
        <div className='w-[640px] mx-auto'>
          {/* タイトル */}
          <div className='box-border content-stretch flex flex-col gap-6 items-center justify-start p-0 relative shrink-0 w-full mb-10'>
            <div className="font-['Noto_Sans_JP'] font-bold leading-[0] relative shrink-0 text-[#323232] text-[32px] text-center tracking-[3.2px] w-full">
              <p className='block leading-[1.6]'>職務経歴書</p>
            </div>
          </div>

          {/* 職務要約セクション */}
          <div className='mb-10'>
            <Section title='職務要約' content={userData.jobSummary} />
          </div>

          {/* 職務経歴セクション */}
          <div className='space-y-10 mb-10'>
            {userData.careers.map((career, index) => (
              <CompanyCareer key={index} {...career} />
            ))}
          </div>

          {/* 自己PR・その他セクション */}
          <div>
            <Section title='自己PR・その他' content={userData.selfPR} />
          </div>
        </div>
      </div>
    </div>
  );
}
