'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export interface JobDetailCommonSectionProps {
  // 左カラム上部
  title: string;
  companyName: string;
  images: string[];
  jobDescription: string;
  positionSummary: string;
  skills: string;
  otherRequirements: string;
  // 右カラム
  representative: string;
  establishedYear: string;
  capital: string;
  employeeCount: string;
  industry: string;
  businessContent: string;
  address: string;
  companyPhase: string;
  website: string;
  showCompanyNameInSidebar?: boolean; // 追加: 右カラムの会社名表示制御
  hideSubHeadings?: boolean; // 追加: h3見出し2（黒い四角）を非表示にする
}

export const JobDetailCommonSection: React.FC<JobDetailCommonSectionProps> = ({
  title,
  companyName,
  images,
  jobDescription,
  positionSummary,
  skills,
  otherRequirements,
  representative,
  establishedYear,
  capital,
  employeeCount,
  industry,
  businessContent,
  address,
  companyPhase,
  website,
  showCompanyNameInSidebar = true,
  hideSubHeadings = false,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className='flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-start w-full max-w-full'>
      {/* 左カラム（上部のみ） */}
      <div className='order-1 flex flex-col gap-10 items-start justify-start lg:flex-1 min-w-0 max-w-full overflow-hidden'>
        {/* 画像・プログレスバー */}
        <div className='flex flex-col gap-4 items-start justify-start w-full'>
          <div className='relative aspect-[300/200] rounded-[10px] md:rounded-3xl w-full overflow-hidden'>
            <Image
              src={images[currentImageIndex] || '/company.jpg'}
              alt={`${title} - 画像${currentImageIndex + 1}`}
              fill
              className='object-cover transition-all ease-in-out'
              style={{ transitionDuration: '0.6s' }}
            />
          </div>
          {images && images.length > 1 && (
            <div className='flex flex-row gap-1 h-2 items-center justify-start w-full'>
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-full rounded-[5px] transition-colors ease-in-out ${
                    index === currentImageIndex
                      ? 'bg-[#0f9058]'
                      : 'bg-[#dcdcdc]'
                  }`}
                  style={{ transitionDuration: '0.6s' }}
                />
              ))}
            </div>
          )}
        </div>
        {/* ポジション概要 */}
        <div className='flex flex-col gap-4 items-start justify-start w-full'>
          <div className='flex flex-row gap-3 h-10 items-center justify-start pb-2 pt-0 px-0 w-full border-b-2 border-[#dcdcdc]'>
            <h2 className="font-['Noto_Sans_JP'] font-bold text-[20px] lg:text-[24px] leading-[1.6] tracking-[2.4px] text-[#323232]">
              ポジション概要
            </h2>
          </div>
          <div className='flex flex-col items-start justify-start w-full'>
            {!hideSubHeadings && (
              <h3 className="font-['Noto_Sans_JP'] font-bold text-[18px] leading-[1.6] tracking-[1.8px] text-[#323232] mb-2">
                ■業務内容
              </h3>
            )}
            <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word max-w-full">
              {jobDescription}
            </div>
          </div>
          <div className='flex flex-col items-start justify-start w-full'>
            {!hideSubHeadings && (
              <h3 className="font-['Noto_Sans_JP'] font-bold text-[18px] leading-[1.6] tracking-[1.8px] text-[#323232] mb-2">
                ■当ポジションの魅力
              </h3>
            )}
            <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word max-w-full">
              {positionSummary}
            </div>
          </div>
        </div>
        {/* 求める人物像 */}
        <div className='flex flex-col gap-4 items-start justify-start w-full'>
          <div className='flex flex-row gap-3 h-10 items-center justify-start pb-2 pt-0 px-0 w-full border-b-2 border-[#dcdcdc]'>
            <h2 className="font-['Noto_Sans_JP'] font-bold text-[20px] lg:text-[24px] leading-[1.6] tracking-[2.4px] text-[#323232]">
              求める人物像
            </h2>
          </div>
          <div className='flex flex-col items-start justify-start w-full'>
            {!hideSubHeadings && (
              <h3 className="font-['Noto_Sans_JP'] font-bold text-[18px] leading-[1.6] tracking-[1.8px] text-[#323232] mb-2">
                ■スキル・経験
              </h3>
            )}
            <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word max-w-full">
              {skills}
            </div>
          </div>
          <div className='flex flex-col items-start justify-start w-full'>
            {!hideSubHeadings && (
              <h3 className="font-['Noto_Sans_JP'] font-bold text-[18px] leading-[1.6] tracking-[1.8px] text-[#323232] mb-2">
                ■その他・求める人物像など
              </h3>
            )}
            <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word max-w-full">
              {otherRequirements}
            </div>
          </div>
        </div>
      </div>
      {/* 右カラム全体 */}
      <div className='order-2 lg:order-1 w-full lg:w-[320px] bg-white rounded-[10px] p-6 max-w-full overflow-hidden'>
        <div className='flex flex-col gap-6 items-start justify-start max-w-full overflow-hidden'>
          {showCompanyNameInSidebar && (
            <h2 className="font-['Noto_Sans_JP'] font-bold text-[18px] leading-[1.6] tracking-[1.8px] text-[#323232] break-words overflow-wrap-break-word line-break-auto max-w-full">
              {companyName}
            </h2>
          )}
          {/* 代表者 */}
          <div className='flex flex-col gap-2 items-start justify-start w-full'>
            <div className='flex flex-row gap-2 h-7 items-center justify-start pb-1 pt-0 px-0 w-full border-b border-[#dcdcdc]'>
              <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#0f9058]">
                代表者
              </span>
            </div>
            <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] break-words overflow-wrap-break-word line-break-auto max-w-full">
              {representative}
            </div>
          </div>
          {/* 設立年 */}
          <div className='flex flex-col gap-2 items-start justify-start w-full'>
            <div className='flex flex-row gap-2 h-7 items-center justify-start pb-1 pt-0 px-0 w-full border-b border-[#dcdcdc]'>
              <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#0f9058]">
                設立年
              </span>
            </div>
            <div className='flex flex-row gap-2 items-start justify-start'>
              <span className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] break-words overflow-wrap-break-word line-break-auto max-w-full">
                {establishedYear}
              </span>
              <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                年
              </span>
            </div>
          </div>
          {/* 資本金 */}
          <div className='flex flex-col gap-2 items-start justify-start w-full'>
            <div className='flex flex-row gap-2 h-7 items-center justify-start pb-1 pt-0 px-0 w-full border-b border-[#dcdcdc]'>
              <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#0f9058]">
                資本金
              </span>
            </div>
            <div className='flex flex-row gap-2 items-start justify-start'>
              <span className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] break-words overflow-wrap-break-word line-break-auto max-w-full">
                {capital}
              </span>
              <span className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                万円
              </span>
            </div>
          </div>
          {/* 従業員数 */}
          <div className='flex flex-col gap-2 items-start justify-start w-full'>
            <div className='flex flex-row gap-2 h-7 items-center justify-start pb-1 pt-0 px-0 w-full border-b border-[#dcdcdc]'>
              <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#0f9058]">
                従業員数
              </span>
            </div>
            <div className='flex flex-row gap-2 items-start justify-start'>
              <span className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] break-words overflow-wrap-break-word line-break-auto max-w-full">
                {employeeCount}
              </span>
              <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                人
              </span>
            </div>
          </div>
          {/* 業種 */}
          <div className='flex flex-col gap-2 items-start justify-start w-full overflow-hidden'>
            <div className='flex flex-row gap-2 h-7 items-center justify-start pb-1 pt-0 px-0 w-full border-b border-[#dcdcdc]'>
              <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#0f9058]">
                業種
              </span>
            </div>
            <div className='min-w-0 max-w-full overflow-hidden'>
              <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] break-words overflow-wrap-break-word line-break-auto">
                {industry.split('、').slice(0, 2).join('、')}
                {industry.split('、').length > 2 && '...'}
              </div>
            </div>
          </div>
          {/* 事業内容 */}
          <div className='flex flex-col gap-2 items-start justify-start w-full'>
            <div className='flex flex-row gap-2 h-7 items-center justify-start pb-1 pt-0 px-0 w-full border-b border-[#dcdcdc]'>
              <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#0f9058]">
                事業内容
              </span>
            </div>
            <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word max-w-full">
              {businessContent}
            </div>
          </div>
          {/* 所在地 */}
          <div className='flex flex-col gap-2 items-start justify-start w-full'>
            <div className='flex flex-row gap-2 h-7 items-center justify-start pb-1 pt-0 px-0 w-full border-b border-[#dcdcdc]'>
              <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#0f9058]">
                所在地
              </span>
            </div>
            <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word max-w-full">
              {address}
            </div>
          </div>
          {/* 企業フェーズ */}
          <div className='flex flex-col gap-2 items-start justify-start w-full'>
            <div className='flex flex-row gap-2 h-7 items-center justify-start pb-1 pt-0 px-0 w-full border-b border-[#dcdcdc]'>
              <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#0f9058]">
                企業フェーズ
              </span>
            </div>
            <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] break-words overflow-wrap-break-word line-break-auto max-w-full">
              {companyPhase}
            </div>
          </div>
          {/* URL */}
          <div className='flex flex-col gap-2 items-start justify-start w-full'>
            <div className='flex flex-row gap-2 h-7 items-center justify-start pb-1 pt-0 px-0 w-full border-b border-[#dcdcdc]'>
              <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#0f9058]">
                URL
              </span>
            </div>
            <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] break-words overflow-wrap-break-word line-break-auto max-w-full">
              {website}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailCommonSection;
