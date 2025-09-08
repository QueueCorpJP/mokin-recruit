'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface CandidateSlideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId?: string;
  candidateData?: {
    id: string;
    name: string;
    company: string;
    location: string;
    age: number;
    gender: string;
    income?: string;
    lastLogin?: string;
    lastUpdate?: string;
    registrationDate?: string;
    jobSummary?: string;
    experienceJobs?: Array<{
      title: string;
      years: number;
    }>;
    experienceIndustries?: Array<{
      title: string;
      years: number;
    }>;
    workHistory?: Array<{
      companyName: string;
      period: string;
      industries: string[];
      department: string;
      position: string;
      jobType: string;
      description: string;
    }>;
    desiredConditions?: {
      annualIncome?: string;
      currentIncome?: string;
      jobTypes?: string[];
      industries?: string[];
      workLocations?: string[];
      jobChangeTiming?: string;
      workStyles?: string[];
    };
    selectionStatus?: Array<{
      companyName: string;
      industries: string[];
      jobTypes: string;
      status: string;
      statusType?: 'pass' | 'decline' | 'offer';
      declineReason?: string;
    }>;
    selfPR?: string;
    qualifications?: string;
    skills?: string[];
    languages?: Array<{
      language: string;
      level: string;
    }>;
    education?: Array<{
      schoolName: string;
      department: string;
      graduationDate: string;
    }>;
    tags?: {
      isHighlighted?: boolean;
      isCareerChange?: boolean;
    };
  };
}

// Icons
const CloseIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
  >
    <path
      d='M0.275556 0.27505C0.643031 -0.0924261 1.23902 -0.0922424 1.60661 0.27505L8.00016 6.6686L14.3927 0.276026C14.7603 -0.0915426 15.3562 -0.0915459 15.7238 0.276026C16.0913 0.643599 16.0913 1.23954 15.7238 1.60708L9.33122 7.99966L15.7248 14.3932L15.758 14.4284C16.0916 14.7979 16.0808 15.3683 15.7248 15.7243C15.3688 16.0802 14.7984 16.0911 14.4289 15.7575L14.3937 15.7243L8.00016 9.33071L1.60661 15.7252L1.57145 15.7584C1.2021 16.0922 0.631655 16.081 0.275556 15.7252C-0.0805049 15.3692 -0.0914255 14.7988 0.242352 14.4293L0.275556 14.3932L6.66911 7.99966L0.275556 1.6061C-0.0917292 1.23852 -0.091898 0.642527 0.275556 0.27505Z'
      fill='#999999'
    />
  </svg>
);

const StarIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M8 2L9.87 6.26L14.5 6.77L11.25 9.72L12.02 14.25L8 12L3.98 14.25L4.75 9.72L1.5 6.77L6.13 6.26L8 2Z'
      fill='white'
      stroke='white'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M14.05 5.18C14.53 5.82 14.8 6.24 14.8 8C14.8 9.76 14.53 10.18 14.05 10.82C12.99 12.28 10.73 14 8 14C5.27 14 3.01 12.28 1.95 10.82C1.47 10.18 1.2 9.76 1.2 8C1.2 6.24 1.47 5.82 1.95 5.18C3.01 3.72 5.27 2 8 2C10.73 2 12.99 3.72 14.05 5.18Z'
      stroke='#999999'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z'
      stroke='#999999'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M2 2L14 14'
      stroke='#999999'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const CareerChangeIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M3 8H13M13 8L10 5M13 8L10 11'
      stroke='white'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export function CandidateSlideMenu({
  isOpen,
  onClose,
  candidateData,
}: CandidateSlideMenuProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'progress'>('details');

  // ESCキーでメニューを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // スクロールを無効化
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* 半透明のオーバーレイ */}
      <div
        className='fixed inset-0 bg-black/30 z-40 transition-opacity duration-300'
        onClick={onClose}
      />

      {/* スライドメニュー */}
      <div
        className={`fixed top-0 right-0 h-full w-[1000px] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ヘッダーセクション */}
        <div className='bg-white px-10 py-6 border-b border-[#efefef] flex-shrink-0'>
          {/* 上部セクション */}
          <div className='flex justify-between mb-6'>
            {/* 左側：候補者情報 */}
            <div className='flex-1'>
              {/* 閉じるボタン */}
              <button
                onClick={onClose}
                className='mb-3 p-0 hover:opacity-70 transition-opacity'
              >
                <CloseIcon />
              </button>

              {/* バッジと日付情報を横並びに */}
              <div className='flex justify-between items-end mb-1'>
                {/* バッジ */}
                <div className='flex gap-1 flex-col'>
                  <div className='flex gap-1'>
                    {candidateData?.tags?.isHighlighted && (
                      <div className='bg-[#ff9d00] px-5 py-1 rounded-full flex items-center gap-2.5'>
                        <span
                          className='text-white text-[14px] font-bold tracking-[1.4px]'
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          注目
                        </span>
                      </div>
                    )}
                    {candidateData?.tags?.isCareerChange && (
                      <div className='bg-[#44b0ef] px-5 py-1 rounded-[8px] flex items-center gap-2'>
                        <CareerChangeIcon />
                        <span
                          className='text-white text-[14px] font-bold tracking-[1.4px]'
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          キャリアチェンジ志向
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    {/* 候補者名 */}
                    <h1
                      className='text-[#323232] text-[24px] font-bold tracking-[2.4px] mb-1'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      {String(candidateData?.name || '候補者名（もしくはID）テキスト')}
                    </h1>

                    {/* 基本情報 */}
                    <p
                      className='text-[#323232] text-[14px] font-bold tracking-[1.4px]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      {String(candidateData?.location || '東京')}／
                      {String(candidateData?.age || 28)}
                      歳／{String(candidateData?.gender || '男性')}／
                      {String(candidateData?.income || '500〜600万円')}
                    </p>
                  </div>
                </div>

                {/* 日付情報 */}
                <div className='flex flex-col items-end gap-1 w-[208px]'>
                  <p
                    className='text-[#999999] text-[14px] font-bold tracking-[1.4px] text-right w-full'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    最終ログイン：{String(candidateData?.lastLogin || 'yyyy/mm/dd')}
                  </p>
                  <p
                    className='text-[#999999] text-[14px] font-bold tracking-[1.4px] text-right'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    最終更新：{String(candidateData?.lastUpdate || 'yyyy/mm/dd')}
                  </p>
                  <p
                    className='text-[#999999] text-[14px] font-bold tracking-[1.4px] text-right'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    登録：{String(candidateData?.registrationDate || 'yyyy/mm/dd')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ボタンセクション */}
          <div className='flex justify-between items-center mb-6'>
            {/* スカウト送信ボタン */}
            <Button
              variant='blue-gradient'
              size='figma-default'
              className='min-w-[160px] bg-[linear-gradient(263.02deg,#26AF94_0%,#3A93CB_100%)] hover:bg-[linear-gradient(263.02deg,#1F8A76_0%,#2E75A3_100%)]'
            >
              <span
                className='text-[16px] font-bold tracking-[1.6px]'
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
              >
                スカウト送信
              </span>
            </Button>

            {/* 右側のボタン群 */}
            <div className='flex gap-4'>
              {/* ピックアップボタン */}
              <button className='bg-[#dcdcdc] px-10 py-3.5 rounded-[32px] flex items-center gap-2.5 min-w-[160px] hover:bg-[#c5c5c5] transition-colors'>
                <StarIcon />
                <span
                  className='text-white text-[16px] font-bold tracking-[1.6px]'
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  ピックアップ
                </span>
              </button>

              {/* 非表示ボタン */}
              <button className='border border-[#999999] px-10 py-3.5 rounded-[32px] flex items-center gap-2.5 min-w-[160px] hover:bg-gray-50 transition-colors'>
                <EyeOffIcon />
                <span
                  className='text-[#999999] text-[16px] font-bold tracking-[1.6px]'
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  非表示
                </span>
              </button>
            </div>
          </div>

          {/* タブセクション */}
          <div className='-mx-10'>
            <div className='flex mx-10'>
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 h-10 px-4 py-1 text-[16px] font-bold leading-[200%] tracking-[0.1em] border border-[#efefef] transition-colors ${
                  activeTab === 'details'
                    ? 'bg-[#d2f1da] text-[#0f9058]'
                    : 'bg-white text-[#999999] hover:bg-gray-50'
                }`}
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
              >
                詳細情報
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`flex-1 h-10 px-4 py-1 text-[16px] font-bold leading-[200%] tracking-[0.1em] border border-[#efefef] transition-colors ${
                  activeTab === 'progress'
                    ? 'bg-[#d2f1da] text-[#0f9058]'
                    : 'bg-white text-[#999999] hover:bg-gray-50'
                }`}
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
              >
                進捗・メモ
              </button>
            </div>
          </div>
        </div>

        {/* コンテンツエリア */}
        <div className='flex-1 overflow-y-auto'>
          <div className='px-10 py-6'>
            {activeTab === 'details' ? (
              <div className='space-y-10'>
                {/* 職務要約セクション */}
                <div className='flex flex-col gap-4'>
                  {/* セクションタイトル */}
                  <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                    <h2
                      className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      職務要約
                    </h2>
                  </div>

                  {/* 職務要約本文 */}
                  <p
                    className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    {candidateData?.jobSummary ||
                      '職務要約テキストが入ります。職務要約テキストが入ります。職務要約テキストが入ります。職務要約テキストが入ります。職務要約テキストが入ります。職務要約テキストが入ります。職務要約テキストが入ります。職務要約テキストが入ります。職務要約テキストが入ります。職務要約テキストが入ります。職務要約テキストが入ります。'}
                  </p>
                </div>

                {/* 経験セクション */}
                <div className='flex flex-col gap-4'>
                  {/* セクションタイトル */}
                  <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                    <h2
                      className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      経験
                    </h2>
                  </div>

                  {/* 経験コンテンツ（2カラム） */}
                  <div className='flex gap-10'>
                    {/* 経験職種 */}
                    <div className='flex-1 flex gap-6'>
                      <div
                        className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] whitespace-nowrap'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        経験職種
                      </div>
                      <div className='flex-1 flex flex-col gap-2'>
                        <ul className='list-disc ml-6 space-y-0'>
                          {Array.isArray(candidateData?.experienceJobs) &&
                          candidateData.experienceJobs.length > 0 ? (
                            candidateData.experienceJobs.map((job, index) => (
                              <li
                                key={index}
                                className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                {String(job.title || '')}（{String(job.years || 0)}年）
                              </li>
                            ))
                          ) : (
                            <>
                              <li
                                className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                職種テキスト（○年）
                              </li>
                              <li
                                className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                職種テキスト（○年）
                              </li>
                              <li
                                className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                職種テキスト（○年）
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* 経験業種 */}
                    <div className='flex-1 flex gap-6'>
                      <div
                        className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] whitespace-nowrap'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        経験業種
                      </div>
                      <div className='flex-1 flex flex-col gap-2'>
                        <ul className='list-disc ml-6 space-y-0'>
                          {Array.isArray(candidateData?.experienceIndustries) &&
                          candidateData.experienceIndustries.length > 0 ? (
                            candidateData.experienceIndustries.map(
                              (industry, index) => (
                                <li
                                  key={index}
                                  className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  {String(industry.title || '')}（{String(industry.years || 0)}年）
                                </li>
                              )
                            )
                          ) : (
                            <>
                              <li
                                className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                業種テキスト（○年）
                              </li>
                              <li
                                className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                業種テキスト（○年）
                              </li>
                              <li
                                className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                業種テキスト（○年）
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 職務経歴セクション */}
                <div className='flex flex-col gap-4'>
                  {/* セクションタイトル */}
                  <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                    <h2
                      className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      職務経歴
                    </h2>
                  </div>

                  {/* 職務経歴リスト */}
                  <div className='flex flex-col gap-4'>
                    {Array.isArray(candidateData?.workHistory) &&
                    candidateData.workHistory.length > 0 ? (
                      candidateData.workHistory.map((work, index) => (
                        <div
                          key={index}
                          className='bg-[#f9f9f9] rounded-[10px] p-6 flex flex-col gap-2'
                        >
                          {/* 企業名と期間 */}
                          <div className='flex justify-between items-center'>
                            <h3
                              className='text-[#0f9058] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              {String(work.companyName || '')}
                            </h3>
                            <span
                              className='text-[#999999] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              {String(work.period || '')}
                            </span>
                          </div>

                          {/* 業種タグ */}
                          <div className='flex gap-1 flex-wrap'>
                            {work.industries.map((industry, idx) => (
                              <span
                                key={idx}
                                className='bg-[#d2f1da] text-[#0f9058] px-4 py-0 rounded-[8px] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                {String(industry || '')}
                              </span>
                            ))}
                          </div>

                          {/* 部署・役職と職種 */}
                          <div className='flex items-center gap-2 flex-wrap'>
                            <span
                              className='text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[2]'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              {String(work.department || '')}・{String(work.position || '')}
                            </span>
                            <div className='w-px h-7 bg-[#dcdcdc]' />
                            <span
                              className='text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[2]'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              {String(work.jobType || '')}
                            </span>
                          </div>

                          {/* 区切り線 */}
                          <hr className='border-t border-[#dcdcdc] my-2' />

                          {/* 業務内容 */}
                          <p
                            className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2] whitespace-pre-wrap'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {String(work.description || '')}
                          </p>
                        </div>
                      ))
                    ) : (
                      /* プレースホルダー */
                      <>
                        {[1, 2, 3].map(num => (
                          <div
                            key={num}
                            className='bg-[#f9f9f9] rounded-[10px] p-6 flex flex-col gap-2'
                          >
                            <div className='flex justify-between items-center'>
                              <h3
                                className='text-[#0f9058] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                企業名テキスト
                              </h3>
                              <span
                                className='text-[#999999] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                yyyy/mm〜yyyy/mm
                              </span>
                            </div>
                            <div className='flex gap-1'>
                              {['テキスト', 'テキスト', 'テキスト'].map(
                                (text, idx) => (
                                  <span
                                    key={idx}
                                    className='bg-[#d2f1da] text-[#0f9058] px-4 py-0 rounded-[8px] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                    style={{
                                      fontFamily: 'Noto Sans JP, sans-serif',
                                    }}
                                  >
                                    <span className='font-bold'>
                                      業種
                                      {text}
                                    </span>
                                  </span>
                                )
                              )}
                            </div>
                            <div className='flex items-center gap-2'>
                              <span
                                className='text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                部署・役職名テキスト部署・役職名テキスト
                              </span>
                              <div className='w-px h-7 bg-[#dcdcdc]' />
                              <span
                                className='text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                職種テキスト職種テキスト
                              </span>
                            </div>
                            <hr className='border-t border-[#dcdcdc]' />
                            <p
                              className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              当該企業での業務内容が入ります。当該企業での業務内容が入ります。当該企業での業務内容が入ります。当該企業での業務内容が入ります。当該企業での業務内容が入ります。当該企業での業務内容が入ります。
                              {'\n'}
                              当該企業での業務内容が入ります。当該企業での業務内容が入ります。当該企業での業務内容が入ります。当該企業での業務内容が入ります。当該企業での業務内容が入ります。当該企業での業務内容が入ります。
                            </p>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                {/* 希望条件セクション */}
                <div className='flex flex-col gap-4'>
                  {/* セクションタイトル */}
                  <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                    <h2
                      className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      希望条件
                    </h2>
                  </div>

                  {/* 希望条件コンテンツ */}
                  <div className='flex flex-col gap-4'>
                    {/* 希望年収 */}
                    <div className='flex gap-10'>
                      <div
                        className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] text-right w-[140px] flex-shrink-0'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        希望年収
                      </div>
                      <div
                        className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2] flex-1'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {String(candidateData?.desiredConditions?.annualIncome || '○○')}
                        万円 （直近年収：
                        {candidateData?.desiredConditions?.currentIncome ||
                          '○○'}
                        万円）
                      </div>
                    </div>

                    {/* 希望職種・希望業種（2カラム） */}
                    <div className='flex gap-10'>
                      {/* 希望職種 */}
                      <div className='flex-1 flex gap-6'>
                        <div
                          className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] text-right w-[140px] flex-shrink-0'
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          希望職種
                        </div>
                        <div className='flex-1'>
                          <ul className='list-disc ml-6 space-y-0'>
                            {Array.isArray(candidateData?.desiredConditions?.jobTypes) &&
                            candidateData.desiredConditions.jobTypes.length >
                              0 ? (
                              candidateData.desiredConditions.jobTypes.map(
                                (jobType, index) => (
                                  <li
                                    key={index}
                                    className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                    style={{
                                      fontFamily: 'Noto Sans JP, sans-serif',
                                    }}
                                  >
                                    {(() => {
                                      try {
                                        if (jobType !== null && jobType !== undefined && typeof jobType === 'object' && jobType && 'name' in jobType) {
                                          return (jobType as any).name;
                                        }
                                        return String(jobType || '');
                                      } catch {
                                        return String(jobType || '');
                                      }
                                    })()}
                                  </li>
                                )
                              )
                            ) : (
                              <>
                                <li
                                  className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  職種テキスト
                                </li>
                                <li
                                  className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  職種テキスト
                                </li>
                                <li
                                  className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  職種テキスト
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* 希望業種 */}
                      <div className='flex-1 flex gap-6'>
                        <div
                          className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] whitespace-nowrap'
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          希望業種
                        </div>
                        <div className='flex-1'>
                          <ul className='list-disc ml-6 space-y-0'>
                            {Array.isArray(candidateData?.desiredConditions?.industries) &&
                            candidateData.desiredConditions.industries.length >
                              0 ? (
                              candidateData.desiredConditions.industries.map(
                                (industry, index) => (
                                  <li
                                    key={index}
                                    className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                    style={{
                                      fontFamily: 'Noto Sans JP, sans-serif',
                                    }}
                                  >
                                    {(() => {
                                      try {
                                        if (industry !== null && industry !== undefined && typeof industry === 'object' && industry && 'name' in industry) {
                                          return (industry as any).name;
                                        }
                                        return String(industry || '');
                                      } catch {
                                        return String(industry || '');
                                      }
                                    })()}
                                  </li>
                                )
                              )
                            ) : (
                              <>
                                <li
                                  className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  業種テキスト
                                </li>
                                <li
                                  className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  業種テキスト
                                </li>
                                <li
                                  className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  業種テキスト
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 希望勤務地 */}
                    <div className='flex gap-10'>
                      <div
                        className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] text-right w-[140px] flex-shrink-0'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        希望勤務地
                      </div>
                      <div
                        className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2] flex-1'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {candidateData?.desiredConditions?.workLocations
                          ? candidateData.desiredConditions.workLocations.join(
                              '、'
                            )
                          : '勤務地テキスト、勤務地テキスト、勤務地テキスト'}
                      </div>
                    </div>

                    {/* 転職希望時期 */}
                    <div className='flex gap-10'>
                      <div
                        className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] text-right w-[140px] flex-shrink-0'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        転職希望時期
                      </div>
                      <div
                        className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2] flex-1'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {candidateData?.desiredConditions?.jobChangeTiming ||
                          '3か月以内に'}
                      </div>
                    </div>

                    {/* 興味のある働き方 */}
                    <div className='flex gap-6'>
                      <div
                        className='text-[#999999] text-[16px] font-bold tracking-[1.4px] leading-[2] text-right w-[140px] flex-shrink-0'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        興味のある働き方
                      </div>
                      <div className='flex-1'>
                        <ul className='list-disc ml-6 space-y-0'>
                          {Array.isArray(candidateData?.desiredConditions?.workStyles) &&
                          candidateData.desiredConditions.workStyles.length >
                            0 ? (
                            candidateData.desiredConditions.workStyles.map(
                              (style, index) => (
                                <li
                                  key={index}
                                  className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  {String(style || '')}
                                </li>
                              )
                            )
                          ) : (
                            <>
                              <li
                                className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                興味のある働き方テキストが入ります。
                              </li>
                              <li
                                className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                興味のある働き方テキストが入ります。
                              </li>
                              <li
                                className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                興味のある働き方テキストが入ります。
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 選考状況セクション */}
                <div className='flex flex-col gap-4'>
                  {/* セクションタイトル */}
                  <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                    <h2
                      className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      選考状況
                    </h2>
                  </div>

                  {/* 選考状況リスト */}
                  <div className='flex flex-col gap-6'>
                          {Array.isArray(candidateData?.selectionStatus) &&
                    candidateData.selectionStatus.length > 0 ? (
                      candidateData.selectionStatus.map((selection, index) => (
                        <div key={index} className='flex gap-4 items-start'>
                          {/* 企業名 */}
                          <a
                            href='#'
                            className='text-[#0f9058] text-[14px] font-bold tracking-[1.4px] leading-[1.6] underline w-[200px] truncate'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {String(selection.companyName || '')}
                          </a>

                          {/* 業種タグ */}
                          <div className='flex flex-wrap gap-2 items-center w-[200px]'>
                            {selection.industries.map((industry, idx) => (
                              <span
                                key={idx}
                                className='bg-[#d2f1da] text-[#0f9058] px-2 py-0.5 rounded-[5px] text-[14px] font-medium tracking-[1.4px] leading-[1.6]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                {String(industry || '')}
                              </span>
                            ))}
                          </div>

                          {/* 職種 */}
                          <span
                            className='text-[#323232] text-[14px] font-medium tracking-[1.4px] leading-[1.6] w-[200px]'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {String(selection.jobTypes || '')}
                          </span>

                          {/* ステータスバッジ */}
                          <span
                            className={`px-2 py-0.5 rounded-[5px] text-[14px] font-medium tracking-[1.4px] leading-[1.6] text-white whitespace-nowrap ${
                              selection.statusType === 'decline'
                                ? 'bg-[#999999]'
                                : 'bg-[#0f9058]'
                            }`}
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {String(selection.status || '')}
                          </span>

                          {/* 辞退理由（辞退の場合のみ） */}
                          {selection.statusType === 'decline' &&
                            selection.declineReason && (
                              <span
                                className='text-[#323232] text-[10px] font-medium tracking-[1px] leading-[1.6] flex-1'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                辞退理由：{String(selection.declineReason || '')}
                              </span>
                            )}
                        </div>
                      ))
                    ) : (
                      /* プレースホルダー */
                      <>
                        {[
                          { status: '二次面接通過', statusType: 'pass' },
                          { status: '二次面接通過', statusType: 'pass' },
                          { status: '最終面接通過', statusType: 'pass' },
                          { status: '内定獲得', statusType: 'offer' },
                          {
                            status: '辞退',
                            statusType: 'decline',
                            declineReason: '辞退理由テキストが入ります',
                          },
                        ].map((item, index) => (
                          <div key={index} className='flex gap-4 items-start'>
                            <a
                              href='#'
                              className='text-[#0f9058] text-[14px] font-bold tracking-[1.4px] leading-[1.6] underline w-[200px]'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              企業名テキスト企業名テキスト企業名テキスト
                            </a>
                            <div className='flex flex-wrap gap-2 items-center w-[200px]'>
                              {['業種', '業種テキスト', '業種テキスト'].map(
                                (text, idx) => (
                                  <span
                                    key={idx}
                                    className='bg-[#d2f1da] text-[#0f9058] px-2 py-0.5 rounded-[5px] text-[14px] font-medium tracking-[1.4px] leading-[1.6]'
                                    style={{
                                      fontFamily: 'Noto Sans JP, sans-serif',
                                    }}
                                  >
                                    {text}
                                  </span>
                                )
                              )}
                            </div>
                            <span
                              className='text-[#323232] text-[14px] font-medium tracking-[1.4px] leading-[1.6] w-[200px]'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              職種テキスト、職種テキスト、職種テキスト
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-[5px] text-[14px] font-medium tracking-[1.4px] leading-[1.6] text-white whitespace-nowrap ${
                                item.statusType === 'decline'
                                  ? 'bg-[#999999]'
                                  : 'bg-[#0f9058]'
                              }`}
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              {item.status}
                            </span>
                            {item.statusType === 'decline' &&
                              item.declineReason && (
                                <span
                                  className='text-[#323232] text-[10px] font-medium tracking-[1px] leading-[1.6] flex-1 max-w-[149px]'
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  辞退理由：{item.declineReason}
                                </span>
                              )}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                {/* 自己PR・その他セクション */}
                <div className='flex flex-col gap-4'>
                  {/* セクションタイトル */}
                  <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                    <h2
                      className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      自己PR・その他
                    </h2>
                  </div>

                  {/* 自己PR・その他本文 */}
                  <p
                    className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    {candidateData?.selfPR ||
                      '自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。'}
                  </p>
                </div>

                {/* 資格・スキル・語学セクション */}
                <div className='flex flex-col gap-4'>
                  {/* セクションタイトル */}
                  <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                    <h2
                      className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      資格・スキル・語学
                    </h2>
                  </div>

                  {/* 資格・スキル・語学コンテンツ */}
                  <div className='flex flex-col gap-4'>
                    {/* 保有資格 */}
                    <div className='flex gap-10'>
                      <div
                        className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] text-right whitespace-nowrap flex-shrink-0'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        保有資格
                      </div>
                      <p
                        className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2] flex-1'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {candidateData?.qualifications ||
                          '保有資格テキストが入ります。保有資格テキストが入ります。保有資格テキストが入ります。保有資格テキストが入ります。保有資格テキストが入ります。保有資格テキストが入ります。'}
                      </p>
                    </div>

                    {/* スキル */}
                    <div className='flex gap-10'>
                      <div
                        className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] text-right w-[69px] flex-shrink-0'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        スキル
                      </div>
                      <div className='flex flex-wrap gap-2 items-center flex-1'>
                        {Array.isArray(candidateData?.skills) &&
                        candidateData.skills.length > 0 ? (
                          candidateData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className='bg-[#d2f1da] text-[#0f9058] px-4 py-0 rounded-[8px] text-[14px] font-medium tracking-[1.4px] leading-[2]'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              {String(skill || '')}
                            </span>
                          ))
                        ) : (
                          <>
                            {[
                              'スキルテキスト',
                              'スキルテキスト',
                              'スキルテキスト',
                              'スキルテキスト',
                              'スキルテキスト',
                              'スキルテキスト',
                              'スキルテキスト',
                            ].map((skill, index) => (
                              <span
                                key={index}
                                className='bg-[#d2f1da] text-[#0f9058] px-4 py-0 rounded-[8px] text-[14px] font-medium tracking-[1.4px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </>
                        )}
                      </div>
                    </div>

                    {/* 語学 */}
                    <div className='flex gap-10'>
                      <div className='flex gap-6 flex-1'>
                        <div
                          className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] text-right w-[69px] flex-shrink-0'
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          語学
                        </div>
                        <div className='flex-1'>
                          <ul className='list-disc ml-6 space-y-0'>
                            {Array.isArray(candidateData?.languages) &&
                            candidateData.languages.length > 0 ? (
                              candidateData.languages.map((lang, index) => (
                                <li
                                  key={index}
                                  className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  {typeof lang.language === 'string' ? lang.language : (lang.language || '')}／{typeof lang.level === 'string' ? lang.level : (lang.level || '')}
                                </li>
                              ))
                            ) : (
                              <>
                                <li
                                  className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  英語／ネイティブ
                                </li>
                                <li
                                  className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  中国語／日常会話
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 学歴セクション */}
                <div className='flex flex-col gap-4'>
                  {/* セクションタイトル */}
                  <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                    <h2
                      className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      学歴
                    </h2>
                  </div>

                  {/* 学歴コンテンツ */}
                  <div className='flex flex-col gap-2'>
                    {Array.isArray(candidateData?.education) &&
                    candidateData.education.length > 0 ? (
                      candidateData.education.map((edu, index) => (
                        <div key={index} className='flex gap-4 items-start'>
                          <span
                            className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2] whitespace-nowrap'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {String(edu.schoolName || '')}／{String(edu.department || '')}
                          </span>
                          <span
                            className='text-[#999999] text-[16px] font-medium tracking-[1.6px] leading-[2] whitespace-nowrap'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {String(edu.graduationDate || '')}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className='flex gap-4 items-start'>
                        <span
                          className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2] whitespace-nowrap'
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          学校名テキスト／学部名テキスト
                        </span>
                        <span
                          className='text-[#999999] text-[16px] font-medium tracking-[1.6px] leading-[2] whitespace-nowrap'
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          yyyy年mm月 卒業
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className='space-y-8'>
                {/* この候補者の進捗状況セクション */}
                <div className='flex flex-col gap-4'>
                  {/* セクションタイトル */}
                  <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                    <h2
                      className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      この候補者の進捗状況
                    </h2>
                  </div>

                  {/* 進捗管理セクション */}
                  <div className='flex flex-col gap-10'>
                    {/* 進捗管理セクション 1 */}
                    <div className='flex flex-col gap-4'>
                      {/* グループ名と求人選択 */}
                      <div className='flex gap-[18px] items-center w-full'>
                        <div className='bg-gradient-to-l from-[#86c36a] to-[#65bdac] rounded-[8px] px-5 py-0 w-[240px] h-[38px] flex items-center justify-center'>
                          <span
                            className='text-white text-[14px] font-bold tracking-[1.4px] text-center w-[200px] truncate'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            グループ名テキストグループ名テキスト
                          </span>
                        </div>
                        <div className='flex-1'>
                          <div className='bg-white border border-[#999999] rounded-[5px] px-[11px] py-2 w-full h-[38px] flex items-center justify-between truncate max-w-[662px]'>
                            <span
                              className='text-[#323232] text-[14px] font-bold tracking-[1.4px] flex-1 truncate'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              求人名タイトルテキストが入ります。求人名タイトルテキストが入ります
                            </span>
                            <div className='w-3.5 h-[9.33px] ml-2 flex-shrink-0'>
                              <svg
                                width='14'
                                height='10'
                                viewBox='0 0 14 10'
                                fill='none'
                              >
                                <path
                                  d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
                                  fill='#0F9058'
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 選考ステップ */}
                      <div className='flex flex-wrap gap-2'>
                        {/* 応募 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            応募
                          </div>
                          <div className='w-full h-[1px] bg-[#999999]'></div>
                          <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                            -
                          </div>
                        </div>

                        {/* 書類選考 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            書類選考
                          </div>
                          <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                          <button className='bg-gradient-to-r from-[#26AF94] to-[#3A93CB] rounded-[32px] py-2 text-white text-[14px] font-bold tracking-[1.4px] hover:opacity-90 transition-opacity w-full'>
                            合否登録
                          </button>
                        </div>

                        {/* 一次面接 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            一次面接
                          </div>
                          <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                          <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                            -
                          </div>
                        </div>

                        {/* 二次以降 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            二次以降
                          </div>
                          <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                          <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                            -
                          </div>
                        </div>

                        {/* 最終面接 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            最終面接
                          </div>
                          <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                          <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                            -
                          </div>
                        </div>

                        {/* 内定 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            内定
                          </div>
                          <div className='w-full h-[1px] bg-[#999999]'></div>
                          <button className='bg-gradient-to-r from-[#26AF94] to-[#3A93CB] rounded-[32px] py-2 text-white text-[14px] font-bold tracking-[1.4px] hover:opacity-90 transition-opacity w-full'>
                            合否登録
                          </button>
                        </div>

                        {/* 入社 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            入社
                          </div>
                          <div className='w-full h-[1px] bg-[#999999]'></div>
                          <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                            -
                          </div>
                        </div>
                      </div>

                      {/* 担当者情報 */}
                      <div className='flex items-center justify-between gap-10'>
                        <p
                          className='text-[#323232] text-[14px] font-bold tracking-[1.4px] flex-1'
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          やりとりしている担当者：企業ユーザー名テキスト、企業ユーザー名テキスト、企業ユーザー名テキスト企業ユーザー名テキスト、企業ユーザー名テキスト、企業ユーザー名テキスト企業ユーザー名テキスト
                        </p>
                        <button className='border border-[#0f9058] rounded-[32px] px-6 py-2.5 min-w-[120px] hover:bg-gray-50 transition-colors'>
                          <span
                            className='text-[#0f9058] text-[14px] font-bold tracking-[1.4px]'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            メッセージを確認
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* 進捗管理セクション 2 */}
                    <div className='flex flex-col gap-4'>
                      {/* グループ名と求人選択 */}
                      <div className='flex gap-[18px] items-center w-full'>
                        <div className='bg-gradient-to-l from-[#86c36a] to-[#65bdac] rounded-[8px] px-5 py-0 w-[240px] h-[38px] flex items-center justify-center'>
                          <span
                            className='text-white text-[14px] font-bold tracking-[1.4px] text-center w-[200px] truncate'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            グループ名テキストグループ名テキスト
                          </span>
                        </div>
                        <div className='flex-1'>
                          <div className='bg-white border border-[#999999] rounded-[5px] px-[11px] py-2 w-full h-[38px] flex items-center justify-between'>
                            <span
                              className='text-[#323232] text-[14px] font-bold tracking-[1.4px] flex-1 truncate'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              求人名タイトルテキストが入ります。求人名タイトルテキストが入ります。
                            </span>
                            <div className='w-3.5 h-[9.33px] ml-2 flex-shrink-0'>
                              <svg
                                width='14'
                                height='10'
                                viewBox='0 0 14 10'
                                fill='none'
                              >
                                <path
                                  d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
                                  fill='#0F9058'
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 選考ステップ */}
                      <div className='flex flex-wrap gap-2'>
                        {/* 応募 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            応募
                          </div>
                          <div className='w-full h-[1px] bg-[#999999]'></div>
                          <div className='text-[#323232] text-[14px] font-medium h-[35px] flex flex-col justify-center text-center'>
                            <p>yyyy/</p>
                            <p>mm/dd</p>
                          </div>
                        </div>

                        {/* 書類選考 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            書類選考
                          </div>
                          <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                          <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                            通過
                          </div>
                        </div>

                        {/* 一次面接 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            一次面接
                          </div>
                          <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                          <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                            通過
                          </div>
                        </div>

                        {/* 二次以降 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            二次以降
                          </div>
                          <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                          <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                            通過
                          </div>
                        </div>

                        {/* 最終面接 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            最終面接
                          </div>
                          <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                          <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                            通過
                          </div>
                        </div>

                        {/* 内定 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            内定
                          </div>
                          <div className='w-full h-[1px] bg-[#999999]'></div>
                          <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                            通過
                          </div>
                        </div>

                        {/* 入社 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            入社
                          </div>
                          <div className='w-full h-[1px] bg-[#999999]'></div>
                          <button className='bg-gradient-to-r from-[#26AF94] to-[#3A93CB] rounded-[32px] py-2 text-white text-[14px] font-bold tracking-[1.4px] hover:opacity-90 transition-opacity w-full'>
                            入社日登録
                          </button>
                        </div>
                      </div>

                      {/* 担当者情報 */}
                      <div className='flex items-center justify-between gap-10'>
                        <p
                          className='text-[#323232] text-[14px] font-bold tracking-[1.4px] flex-1'
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          やりとりしている担当者：企業ユーザー名テキスト、企業ユーザー名テキスト、企業ユーザー名テキスト企業ユーザー名テキスト、企業ユーザー名テキスト、企業ユーザー名テキスト企業ユーザー名テキスト
                        </p>
                        <button className='border border-[#0f9058] rounded-[32px] px-6 py-2.5 min-w-[120px] hover:bg-gray-50 transition-colors'>
                          <span
                            className='text-[#0f9058] text-[14px] font-bold tracking-[1.4px]'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            メッセージを確認
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* 進捗管理セクション 3 */}
                    <div className='flex flex-col gap-4'>
                      {/* グループ名と求人選択 */}
                      <div className='flex gap-[18px] items-center w-full'>
                        <div className='bg-gradient-to-l from-[#86c36a] to-[#65bdac] rounded-[8px] px-5 py-0 w-[240px] h-[38px] flex items-center justify-center'>
                          <span
                            className='text-white text-[14px] font-bold tracking-[1.4px] text-center w-[200px] truncate'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            グループ名テキストグループ名テキスト
                          </span>
                        </div>
                        <div className='flex-1'>
                          <div className='bg-white border border-[#999999] rounded-[5px] px-[11px] py-2 w-full h-[38px] flex items-center justify-between'>
                            <span
                              className='text-[#323232] text-[14px] font-bold tracking-[1.4px] flex-1 truncate'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              求人名タイトルテキストが入ります。求人名タイトルテキストが入ります。
                            </span>
                            <div className='w-3.5 h-[9.33px] ml-2 flex-shrink-0'>
                              <svg
                                width='14'
                                height='10'
                                viewBox='0 0 14 10'
                                fill='none'
                              >
                                <path
                                  d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
                                  fill='#0F9058'
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 選考ステップ */}
                      <div className='flex flex-wrap gap-2'>
                        {/* 応募 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            応募
                          </div>
                          <div className='w-full h-[1px] bg-[#999999]'></div>
                          <div className='text-[#323232] text-[14px] font-medium h-[35px] flex flex-col justify-center text-center'>
                            <p>yyyy/</p>
                            <p>mm/dd</p>
                          </div>
                        </div>

                        {/* 書類選考 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            書類選考
                          </div>
                          <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                          <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                            通過
                          </div>
                        </div>

                        {/* 一次面接 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            一次面接
                          </div>
                          <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                          <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                            見送り
                          </div>
                        </div>

                        {/* 二次以降 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            二次以降
                          </div>
                          <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                          <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                            -
                          </div>
                        </div>

                        {/* 最終面接 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            最終面接
                          </div>
                          <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                          <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                            -
                          </div>
                        </div>

                        {/* 内定 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            内定
                          </div>
                          <div className='w-full h-[1px] bg-[#999999]'></div>
                          <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                            -
                          </div>
                        </div>

                        {/* 入社 */}
                        <div className='flex-1 min-w-[100px] bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                          <div
                            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] text-center'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            入社
                          </div>
                          <div className='w-full h-[1px] bg-[#999999]'></div>
                          <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                            -
                          </div>
                        </div>
                      </div>

                      {/* 担当者情報 */}
                      <div className='flex items-center justify-between gap-10'>
                        <p
                          className='text-[#323232] text-[14px] font-bold tracking-[1.4px] flex-1'
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          やりとりしている担当者：企業ユーザー名テキスト、企業ユーザー名テキスト、企業ユーザー名テキスト企業ユーザー名テキスト、企業ユーザー名テキスト、企業ユーザー名テキスト企業ユーザー名テキスト
                        </p>
                        <button className='border border-[#0f9058] rounded-[32px] px-6 py-2.5 min-w-[120px] hover:bg-gray-50 transition-colors'>
                          <span
                            className='text-[#0f9058] text-[14px] font-bold tracking-[1.4px]'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            メッセージを確認
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 社内メモセクション */}
                <div className='flex flex-col gap-4'>
                  {/* セクションタイトル */}
                  <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                    <h2
                      className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      社内メモ
                    </h2>
                  </div>

                  {/* メモ入力エリア */}
                  <div className='flex flex-col gap-2'>
                    <div className='bg-white border border-[#999999] rounded-[5px] p-[11px] min-h-[78px] w-full'>
                      <textarea
                        className='w-full h-full min-h-[56px] resize-none outline-none text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2] placeholder:text-[#999999]'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        placeholder='この候補者に関して、社内で共有しておきたい事項などがあれば、こちらを活用してください。'
                      />
                    </div>
                    <p
                      className='text-[#999999] text-[14px] font-medium tracking-[1.4px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      社内メモは候補者に共有されません。
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* フッターセクション（ボタンエリア） */}
        <div className='bg-white px-10 py-6 border-t border-[#efefef] flex-shrink-0'>
          <div className='flex justify-center'>
            <Button
              variant='blue-gradient'
              size='figma-default'
              className='min-w-[160px] bg-[linear-gradient(263.02deg,#26AF94_0%,#3A93CB_100%)] hover:bg-[linear-gradient(263.02deg,#1F8A76_0%,#2E75A3_100%)] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)]'
            >
              <span
                className='text-[16px] font-bold tracking-[1.6px]'
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
              >
                スカウト送信
              </span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
