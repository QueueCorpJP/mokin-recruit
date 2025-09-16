'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCompanyDetail } from '@/hooks/useCompanyDetail';
import Image from 'next/image';

interface CompanyDetailsSidebarProps {
  companyId: string;
  fallbackData?: {
    companyName?: string;
    representative?: string;
    industry?: string;
    businessContent?: string;
    address?: string;
  };
}

const CompanyDetailsSidebar: React.FC<CompanyDetailsSidebarProps> = ({
  companyId,
  fallbackData,
}) => {
  const router = useRouter();
  const { data: companyData, loading } = useCompanyDetail(companyId);

  const handleCompanyClick = () => {
    router.push(`/candidate/company/${companyId}`);
  };

  const displayData = companyData || fallbackData || {};

  if (loading) {
    return (
      <div className='w-full lg:w-[320px] bg-white rounded-[10px] p-6 max-w-full overflow-hidden'>
        <div className='flex flex-col gap-6 items-start justify-start max-w-full overflow-hidden'>
          <div className='animate-pulse'>
            <div className='h-6 bg-gray-200 rounded w-32 mb-6'></div>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className='flex flex-col gap-2 mb-6'>
                <div className='h-4 bg-gray-200 rounded w-20 mb-2'></div>
                <div className='h-4 bg-gray-200 rounded w-3/4'></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full lg:w-[320px] bg-white rounded-[10px] p-6 max-w-full overflow-hidden'>
      <div className='flex flex-col gap-6 items-start justify-start max-w-full overflow-hidden'>
        {/* 企業詳細ヘッダー */}
        <div className='flex flex-row gap-3 h-10 items-center justify-start pb-2 pt-0 px-0 w-full border-b-2 border-[#dcdcdc]'>
          <h2 className="font-['Noto_Sans_JP'] font-bold text-[20px] leading-[1.6] tracking-[2px] text-[#323232]">
            企業詳細
          </h2>
        </div>

        {/* 企業ロゴと名前 */}
        <div
          className='flex flex-col gap-4 items-center w-full cursor-pointer'
          onClick={handleCompanyClick}
        >
          <div className='relative w-20 h-20 rounded-full overflow-hidden'>
            <Image
              src={companyData?.companyLogo || '/company.jpg'}
              alt={displayData.companyName || '企業ロゴ'}
              fill
              className='object-cover'
              onError={e => {
                (e.target as HTMLImageElement).src = '/company.jpg';
              }}
            />
          </div>
          <h3 className="font-['Noto_Sans_JP'] font-bold text-[18px] leading-[1.6] tracking-[1.8px] text-[#0f9058] text-center break-words">
            {displayData.companyName || '企業名未設定'}
          </h3>
        </div>

        {/* 企業情報 */}
        <div className='flex flex-col gap-4 w-full'>
          {/* 代表者 */}
          {displayData.representative && (
            <div className='flex flex-col gap-2'>
              <div className="font-['Noto_Sans_JP'] font-bold text-[14px] leading-[1.6] tracking-[1.4px] text-[#323232]">
                代表者
              </div>
              <div className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#323232] break-words">
                {displayData.representative}
              </div>
            </div>
          )}

          {/* 業種 */}
          {displayData.industry && (
            <div className='flex flex-col gap-2'>
              <div className="font-['Noto_Sans_JP'] font-bold text-[14px] leading-[1.6] tracking-[1.4px] text-[#323232]">
                業種
              </div>
              <div className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#323232] break-words">
                {displayData.industry}
              </div>
            </div>
          )}

          {/* 事業内容 */}
          {displayData.businessContent && (
            <div className='flex flex-col gap-2'>
              <div className="font-['Noto_Sans_JP'] font-bold text-[14px] leading-[1.6] tracking-[1.4px] text-[#323232]">
                事業内容
              </div>
              <div className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#323232] break-words whitespace-pre-wrap">
                {displayData.businessContent}
              </div>
            </div>
          )}

          {/* 住所 */}
          {displayData.address && (
            <div className='flex flex-col gap-2'>
              <div className="font-['Noto_Sans_JP'] font-bold text-[14px] leading-[1.6] tracking-[1.4px] text-[#323232]">
                所在地
              </div>
              <div className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#323232] break-words">
                {displayData.address}
              </div>
            </div>
          )}
        </div>

        {/* 企業詳細へのリンク */}
        <button
          onClick={handleCompanyClick}
          className='w-full bg-[#0f9058] hover:bg-[#0d7a4a] text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200'
        >
          <span className="font-['Noto_Sans_JP'] font-bold text-[14px] leading-[1.6] tracking-[1.4px]">
            企業詳細を見る
          </span>
        </button>
      </div>
    </div>
  );
};

export default CompanyDetailsSidebar;
