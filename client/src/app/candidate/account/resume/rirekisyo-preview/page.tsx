import { redirect } from 'next/navigation';
import { getCachedCandidateUser } from '@/lib/auth/server';
import { getCandidateData, getEducationData, getSkillsData } from '@/lib/server/candidate/candidateData';

// 区切り線のSVGコンポーネント
const DividerLine = () => (
  <div className="h-0 relative shrink-0 w-full">
    <div className="absolute bottom-[-1px] left-0 right-0 top-[-1px]">
      <svg
        width="100%"
        height="2"
        viewBox="0 0 640 2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="1" x2="640" y2="1" stroke="#EFEFEF" strokeWidth="2" />
      </svg>
    </div>
  </div>
);

// 入力行のコンポーネント
interface InputRowProps {
  label: string;
  value: string | React.ReactNode;
  isGrayBg?: boolean;
}

const InputRow = ({ label, value, isGrayBg = false }: InputRowProps) => (
  <div className="box-border content-stretch flex gap-2 items-start justify-start overflow-clip p-0 relative shrink-0 w-full">
    <div
      className={`${isGrayBg ? 'bg-[#f9f9f9]' : 'bg-[#f9f9f9]'} box-border content-stretch flex flex-col gap-3 items-start justify-center min-h-[50px] px-6 py-3 relative rounded-[5px] self-stretch shrink-0 w-[200px]`}
    >
      <div className="font-['Noto_Sans_JP'] font-bold leading-[0] relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px] w-full">
        <p className="block leading-[2]">{label}</p>
      </div>
    </div>
    <div className="basis-0 bg-[#ffffff] box-border content-stretch flex gap-3 grow items-center justify-start min-h-px min-w-px p-[12px] relative rounded-[5px] shrink-0">
      <div className="basis-0 font-['Noto_Sans_JP'] font-medium grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px]">
        {typeof value === 'string' ? (
          <p className="block leading-[2]">{value}</p>
        ) : (
          value
        )}
      </div>
    </div>
  </div>
);

// 職務経歴の行コンポーネント
interface CareerRowProps {
  period: string;
  company: string;
  department: string;
}

const CareerRow = ({ period, company, department }: CareerRowProps) => (
  <div className="bg-[#ffffff] box-border content-stretch flex gap-6 items-center justify-start min-h-[50px] px-6 py-3 relative rounded-[5px] shrink-0 w-[640px]">
    <div
      aria-hidden="true"
      className="absolute border border-[#efefef] border-solid inset-0 pointer-events-none rounded-[5px]"
    />
    <div className="font-['Noto_Sans_JP'] font-medium leading-[0] relative shrink-0 text-[#999999] text-[14px] tracking-[1.4px] w-[158px]">
      <p className="block leading-[1.6]">{period}</p>
    </div>
    <div className="font-['Noto_Sans_JP'] font-normal leading-[0] relative shrink-0 text-[#323232] text-[16px] text-nowrap tracking-[1.6px]">
      <p className="block leading-[2]">{company}</p>
    </div>
    <div className="font-['Noto_Sans_JP'] font-normal leading-[0] relative shrink-0 text-[#323232] text-[16px] text-nowrap tracking-[1.6px]">
      <p className="block leading-[2]">{department}</p>
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

// 言語コードと日本語名のマッピング
const LANGUAGE_MAPPING: Record<string, string> = {
  'indonesian': 'インドネシア語',
  'italian': 'イタリア語',
  'spanish': 'スペイン語',
  'thai': 'タイ語',
  'german': 'ドイツ語',
  'french': 'フランス語',
  'portuguese': 'ポルトガル語',
  'malaysian': 'マレー語',
  'russian': 'ロシア語',
  'korean': '韓国語',
  'chinese-simplified': '中国語（簡体字）',
  'chinese-traditional': '中国語（繁体字）',
  'vietnamese': 'ベトナム語',
  'arabic': 'アラビア語',
  'hindi': 'ヒンディー語',
  'dutch': 'オランダ語',
};

// 英語レベルコードと日本語名のマッピング
const ENGLISH_LEVEL_MAPPING: Record<string, string> = {
  'none': 'なし',
  'basic': '初級',
  'intermediate': '中級',
  'business': 'ビジネス',
  'native': 'ネイティブ',
};

// 言語レベルコードと日本語名のマッピング
const LANGUAGE_LEVEL_MAPPING: Record<string, string> = {
  'basic': '初級',
  'intermediate': '中級',
  'business': 'ビジネス',
  'native': 'ネイティブ',
};

// 最終学歴の表示名を取得
function getFinalEducationDisplay(finalEducation?: string) {
  const educationMap = {
    'high-school': '高校',
    'vocational-school': '専門学校',
    'junior-college': '短期大学',
    'university': '大学',
    'graduate-school': '大学院'
  };
  return educationMap[finalEducation as keyof typeof educationMap] || '';
}

export default async function RirekisyoPreviewPage() {
  // 認証チェック
  const user = await getCachedCandidateUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  if (!user) {
    redirect('/candidate/auth/login');
  }

  // 候補者データを取得
  const candidateData = await getCandidateData(user.id);
  const educationData = await getEducationData(user.id);
  const skillsData = await getSkillsData(user.id);
  
  if (!candidateData) {
    redirect('/candidate/auth/login');
  }

  // 性別の表示変換
  const getGenderDisplay = (gender?: string) => {
    const genderMap = {
      'male': '男性',
      'female': '女性',
      'unspecified': '未回答'
    };
    return genderMap[gender as keyof typeof genderMap] || '未設定';
  };

  // 生年月日のフォーマット
  const formatBirthDate = (birthDate?: string) => {
    if (!birthDate) return 'yyyy 年 mm 月 dd 日';
    const date = new Date(birthDate);
    return `${date.getFullYear()} 年 ${(date.getMonth() + 1).toString().padStart(2, '0')} 月 ${date.getDate().toString().padStart(2, '0')} 日`;
  };

  // 学歴情報のフォーマット
  const formatEducation = () => {
    if (!educationData) return '学歴情報未設定';
    const finalEdu = getFinalEducationDisplay(educationData.final_education);
    const year = educationData.graduation_year || 'yyyy';
    const month = educationData.graduation_month ? educationData.graduation_month.toString().padStart(2, '0') : 'mm';
    const schoolName = educationData.school_name || '学校名未設定';
    const department = educationData.department || '';
    
    return `${year}/${month}  ${schoolName} ${department ? `${department} ` : ''}${finalEdu ? `${finalEdu}卒業` : '卒業'}`;
  };

  // 職歴データを取得・整形
  const getCareers = () => {
    const careers = [];
    
    // recent_job_industries フィールドから複数職歴を取得
    if (candidateData.recent_job_industries && Array.isArray(candidateData.recent_job_industries)) {
      candidateData.recent_job_industries.forEach((job: any) => {
        const startPeriod = `${job.startYear || 'yyyy'}/${job.startMonth?.padStart(2, '0') || 'mm'}`;
        const endPeriod = job.isCurrentlyWorking ? '在籍中' : `${job.endYear || 'yyyy'}/${job.endMonth?.padStart(2, '0') || 'mm'}`;
        careers.push({
          period: `${startPeriod}〜${endPeriod}`,
          company: job.companyName || '企業名未設定',
          department: job.departmentPosition || '部署名・役職名未設定',
        });
      });
    } else if (candidateData.recent_job_company_name) {
      // 単一職歴の場合（後方互換性）
      const startPeriod = `${candidateData.recent_job_start_year || 'yyyy'}/${candidateData.recent_job_start_month?.padStart(2, '0') || 'mm'}`;
      const endPeriod = candidateData.recent_job_is_currently_working ? '在籍中' : `${candidateData.recent_job_end_year || 'yyyy'}/${candidateData.recent_job_end_month?.padStart(2, '0') || 'mm'}`;
      careers.push({
        period: `${startPeriod}〜${endPeriod}`,
        company: candidateData.recent_job_company_name,
        department: candidateData.recent_job_department_position || '部署名・役職名未設定',
      });
    }

    return careers.length > 0 ? careers : [{
      period: 'yyyy/mm〜yyyy/mm',
      company: '企業名未設定',
      department: '部署名・役職名未設定',
    }];
  };

  // その他の言語データを整形
  const getOtherLanguages = () => {
    if (!skillsData?.other_languages || !Array.isArray(skillsData.other_languages)) {
      return [];
    }
    
    return skillsData.other_languages.map((lang: any) => ({
      language: LANGUAGE_MAPPING[lang.language] || lang.language || '言語未設定',
      level: LANGUAGE_LEVEL_MAPPING[lang.level] || lang.level || 'レベル未設定',
    }));
  };

  // スキルリストを取得
  const getSkillsList = () => {
    if (!skillsData?.skills_list || !Array.isArray(skillsData.skills_list)) {
      return [];
    }
    return skillsData.skills_list;
  };

  const userData = {
    name: `${candidateData.last_name || '姓'} ${candidateData.first_name || '名'}`,
    gender: getGenderDisplay(candidateData.gender),
    birthDate: formatBirthDate(candidateData.birth_date),
    phone: candidateData.phone_number || '電話番号未設定',
    email: candidateData.email || 'メールアドレス未設定',
    address: candidateData.current_residence || candidateData.prefecture || '現在の住まい未設定',
    education: formatEducation(),
    careers: getCareers(),
    englishLevel: ENGLISH_LEVEL_MAPPING[skillsData?.english_level || ''] || skillsData?.english_level || 'なし',
    otherLanguages: getOtherLanguages(),
    skills: getSkillsList(),
    qualifications: skillsData?.qualifications || '保有資格なし',
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 印刷スタイル */}
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      {/* メインコンテンツ（印刷対象） */}
      <div className="print-container bg-[#ffffff] box-border content-stretch flex flex-col gap-10 items-center justify-start px-0 lg:px-[400px] py-6 lg:py-[120px] relative w-full">
        <div className="w-[640px] mx-auto">
          {/* タイトル */}
          <div className="box-border content-stretch flex flex-col gap-6 items-center justify-start p-0 relative shrink-0 w-full mb-10">
            <div className="font-['Noto_Sans_JP'] font-bold leading-[0] relative shrink-0 text-[#323232] text-[32px] text-center tracking-[3.2px] w-full">
              <p className="block leading-[1.6]">履歴書</p>
            </div>
          </div>

          {/* 個人情報セクション */}
          <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full mb-10">
            <div className="font-['Noto_Sans_JP'] font-bold leading-[0] relative shrink-0 text-[#323232] text-[20px] tracking-[2px] w-full">
              <p className="block leading-[1.6]">個人情報</p>
            </div>
            <DividerLine />
            <div className="box-border content-stretch flex gap-2 items-start justify-start p-0 relative shrink-0 w-full">
              <div className="basis-0 box-border content-stretch flex flex-col gap-2 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
                <InputRow label="氏名" value={userData.name} />
                <InputRow label="性別" value={userData.gender} />
              </div>
              {/* 写真欄 */}
              <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
                <div className="[grid-area:1_/_1] h-[130px] ml-0 mt-0 relative w-[97px]">
                  <div
                    aria-hidden="true"
                    className="absolute border border-[#efefef] border-solid inset-0 pointer-events-none"
                  />
                </div>
                <div className="[grid-area:1_/_1] font-['Noto_Sans_JP'] font-medium leading-[1.6] ml-[49px] mt-[41px] relative text-[#999999] text-[10px] text-center text-nowrap tracking-[1px] translate-x-[-50%] whitespace-pre">
                  <p className="block mb-0">写真は印刷後に</p>
                  <p className="block mb-0">貼付けて</p>
                  <p className="block">ください。</p>
                </div>
              </div>
            </div>
            <InputRow label="生年月日" value={userData.birthDate} />
            <InputRow label="連絡先電話番号" value={userData.phone} />
            <InputRow label="メールアドレス" value={userData.email} />
            <InputRow label="現在の住まい" value={userData.address} />
          </div>

          {/* 学歴セクション */}
          <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full mb-10">
            <div className="font-['Noto_Sans_JP'] font-bold leading-[0] relative shrink-0 text-[#323232] text-[20px] tracking-[2px] w-full">
              <p className="block leading-[1.6]">学歴</p>
            </div>
            <DividerLine />
            <div className="font-['Noto_Sans_JP'] font-medium leading-[0] relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px] w-full">
              <p className="block leading-[2] whitespace-pre-wrap">
                {userData.education}
              </p>
            </div>
          </div>

          {/* 職務経歴セクション */}
          <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full mb-10">
            <div className="font-['Noto_Sans_JP'] font-bold leading-[0] min-w-full relative shrink-0 text-[#323232] text-[20px] tracking-[2px]">
              <p className="block leading-[1.6]">職務経歴</p>
            </div>
            <DividerLine />
            {userData.careers.map((career, index) => (
              <CareerRow key={index} {...career} />
            ))}
          </div>

          {/* 語学セクション */}
          <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full mb-10">
            <div className="font-['Noto_Sans_JP'] font-bold leading-[0] relative shrink-0 text-[#323232] text-[20px] tracking-[2px] w-full">
              <p className="block leading-[1.6]">語学</p>
            </div>
            <DividerLine />
            <div className="box-border content-stretch flex gap-6 items-start justify-start p-0 relative shrink-0 w-full">
              <div className="bg-[#f9f9f9] box-border content-stretch flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 relative rounded-[5px] self-stretch shrink-0 w-[200px]">
                <div className="font-['Noto_Sans_JP'] font-bold leading-[0] relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px] w-full">
                  <p className="block leading-[2]">英語</p>
                </div>
              </div>
              <div className="basis-0 box-border content-stretch flex gap-2.5 grow items-center justify-start min-h-px min-w-px px-0 py-6 relative shrink-0">
                <div className="font-['Noto_Sans_JP'] font-medium leading-[0] relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px]">
                  <p className="block leading-[2]">{userData.englishLevel}</p>
                </div>
              </div>
            </div>
            <div className="box-border content-stretch flex gap-6 items-start justify-start p-0 relative shrink-0 w-full">
              <div className="bg-[#f9f9f9] box-border content-stretch flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 relative rounded-[5px] self-stretch shrink-0 w-[200px]">
                <div className="font-['Noto_Sans_JP'] font-bold leading-[0] relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px] w-full">
                  <p className="block leading-[2]">その他の言語</p>
                </div>
              </div>
              <div className="basis-0 box-border content-stretch flex gap-2.5 grow items-center justify-start min-h-px min-w-px px-0 py-6 relative shrink-0">
                <div className="basis-0 box-border content-stretch flex flex-col gap-6 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
                  {userData.otherLanguages.length > 0 ? (
                    userData.otherLanguages.map((lang, index) => (
                      <div
                        key={index}
                        className="box-border content-stretch flex flex-col gap-2 items-end justify-start p-0 relative shrink-0 w-full"
                      >
                        <div className="font-['Noto_Sans_JP'] font-medium leading-[0] relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px] w-full">
                          <p className="block leading-[2]">{lang.language}</p>
                        </div>
                        <div className="font-['Noto_Sans_JP'] font-medium leading-[0] relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px] w-full">
                          <p className="block leading-[2]">{lang.level}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="font-['Noto_Sans_JP'] font-medium leading-[0] relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px] w-full">
                      <p className="block leading-[2]">なし</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* スキルセクション */}
          <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full">
            <div className="font-['Noto_Sans_JP'] font-bold leading-[0] relative shrink-0 text-[#323232] text-[20px] tracking-[2px] w-full">
              <p className="block leading-[1.6]">スキル</p>
            </div>
            <DividerLine />
            <div className="box-border content-stretch flex gap-6 items-start justify-start p-0 relative shrink-0 w-full">
              <div className="bg-[#f9f9f9] box-border content-stretch flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 relative rounded-[5px] self-stretch shrink-0 w-[200px]">
                <div className="font-['Noto_Sans_JP'] font-bold leading-[0] relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px] w-full">
                  <p className="block leading-[2]">スキル</p>
                </div>
              </div>
              <div className="basis-0 box-border content-stretch flex flex-col font-['Noto_Sans_JP'] font-medium gap-2 grow items-start justify-center leading-[0] min-h-px min-w-px px-0 py-6 relative shrink-0 text-[#323232] text-[16px] text-center text-nowrap tracking-[1.6px]">
                {userData.skills.length > 0 ? (
                  userData.skills.map((skill, index) => (
                    <div key={index} className="relative shrink-0">
                      <p className="block leading-[2] text-nowrap whitespace-pre">
                        {skill}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="relative shrink-0">
                    <p className="block leading-[2] text-nowrap whitespace-pre">
                      なし
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="box-border content-stretch flex gap-6 items-start justify-start p-0 relative shrink-0 w-full">
              <div className="bg-[#f9f9f9] box-border content-stretch flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 relative rounded-[5px] self-stretch shrink-0 w-[200px]">
                <div className="font-['Noto_Sans_JP'] font-bold leading-[0] relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px] w-full">
                  <p className="block leading-[2]">保有資格</p>
                </div>
              </div>
              <div className="basis-0 box-border content-stretch flex gap-2.5 grow items-center justify-start min-h-px min-w-px px-0 py-6 relative shrink-0">
                <div className="font-['Noto_Sans_JP'] font-medium leading-[0] relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px] w-full">
                  <p className="block leading-[2]">{userData.qualifications}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
