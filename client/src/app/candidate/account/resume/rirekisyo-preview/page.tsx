'use client';

import { useEffect } from 'react';

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

export default function RirekisyoPreviewPage() {
  useEffect(() => {
    // 印刷用のスタイルを追加
    const style = document.createElement('style');
    style.innerHTML = `
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
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // サンプルデータ（実際はpropsやAPIから取得）
  const userData = {
    name: '姓 名',
    gender: '男性',
    birthDate: 'yyyy 年 mm 月 dd 日',
    phone: 'テキストが入ります。',
    email: 'テキストが入ります。',
    address: 'テキストが入ります。',
    education: 'yyyy/mm  学校名　学部学科選考　卒業',
    careers: [
      {
        period: 'yyyy/mm〜yyyy/mm',
        company: '企業名テキスト',
        department: '部署名・役職名テキスト',
      },
      {
        period: 'yyyy/mm〜yyyy/mm',
        company: '企業名テキスト',
        department: '部署名・役職名テキスト',
      },
      {
        period: 'yyyy/mm〜在籍中',
        company: '企業名テキスト',
        department: '部署名・役職名テキスト',
      },
    ],
    englishLevel: 'レベルテキストが入ります。',
    otherLanguages: [
      {
        language: '言語テキストが入ります。',
        level: 'レベルテキストが入ります。',
      },
      {
        language: '言語テキストが入ります。',
        level: 'レベルテキストが入ります。',
      },
    ],
    skills: [
      'プロジェクトマネジメント',
      'ロジカルシンキング',
      'チームビルディング',
    ],
    qualifications:
      'テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。',
  };

  return (
    <div className="min-h-screen bg-white">
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
                  {userData.otherLanguages.map((lang, index) => (
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
                  ))}
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
                {userData.skills.map((skill, index) => (
                  <div key={index} className="relative shrink-0">
                    <p className="block leading-[2] text-nowrap whitespace-pre">
                      {skill}
                    </p>
                  </div>
                ))}
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
