'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

// 求人ステータスの型定義
type JobStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'CLOSED';
type PublicationType = 'PUBLIC' | 'MEMBERS_ONLY' | 'SCOUT_ONLY' | 'PRIVATE';

// 求人データの型定義
interface JobPosting {
  id: string;
  groupName: string;
  jobTypes: string[];
  title: string;
  status: JobStatus;
  publicationType: PublicationType;
  internalMemo: string;
  publishedAt: string | null;
  updatedAt: string;
}

// サンプルデータ
const sampleJobs: JobPosting[] = [
  {
    id: '1',
    groupName: 'グループ名テキストグループ名テキスト',
    jobTypes: ['職種テキスト', '職種テキスト', '職種テキスト'],
    title:
      '求人タイトルが入ります。求人タイトルが入ります。求人タイトルが入りま求人タイトルが入ります。求人タイトルが入ります。求人タイトルが入りま求人タイトルが入ります。求人タイトルが入ります。求人タイトルが入りま',
    status: 'PENDING_APPROVAL',
    publicationType: 'SCOUT_ONLY',
    internalMemo:
      'テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。',
    publishedAt: null,
    updatedAt: '2024/01/15',
  },
  {
    id: '2',
    groupName: 'グループ名テキストグループ名テキスト',
    jobTypes: ['職種テキスト', '職種テキスト', '職種テキスト'],
    title:
      '求人タイトルが入ります。求人タイトルが入ります。求人タイトルが入りま求人タイトルが入ります。求人タイトルが入ります。求人タイトルが入りま求人タイトルが入ります。求人タイトルが入ります。求人タイトルが入りま',
    status: 'DRAFT',
    publicationType: 'SCOUT_ONLY',
    internalMemo:
      'テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。',
    publishedAt: null,
    updatedAt: '2024/01/15',
  },
  {
    id: '3',
    groupName: 'グループ名テキストグループ名テキスト',
    jobTypes: ['職種テキスト', '職種テキスト', '職種テキスト'],
    title:
      '求人タイトルが入ります。求人タイトルが入ります。求人タイトルが入りま求人タイトルが入ります。求人タイトルが入ります。求人タイトルが入りま求人タイトルが入ります。求人タイトルが入ります。求人タイトルが入りま',
    status: 'PUBLISHED',
    publicationType: 'SCOUT_ONLY',
    internalMemo:
      'テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。',
    publishedAt: '2024/01/10',
    updatedAt: '2024/01/15',
  },
];

export default function CompanyJobsPage() {
  const [selectedStatus, setSelectedStatus] = useState('すべて');
  const statusTabs = ['すべて', '下書き', '掲載待ち（承認待ち）', '掲載済'];
  const [selectedScope, setSelectedScope] = useState('すべて');
  const scopeTabs = [
    'すべて',
    '一般公開',
    '登録会員限定',
    'スカウト限定',
    '公開停止',
  ];

  return (
    <div className="bg-gradient-to-b from-[#17856F] to-[#229A4E] relative size-full">
      <div className="flex flex-col items-center relative size-full">
        <div className="box-border content-stretch flex flex-col gap-10 items-center justify-start px-20 py-10 relative size-full">
          {/* ページヘッダー */}
          <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full">
            <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0 w-full">
              <div className="relative shrink-0 size-8">
                <div className="absolute aspect-[38/50] left-[12%] right-[12%] top-0">
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 25 32"
                  >
                    <path
                      d="M12.16 0C9.51267 0 7.258 1.66875 6.42833 4H4.05333C1.81767 4 0 5.79375 0 8V28C0 30.2062 1.81767 32 4.05333 32H20.2667C22.5023 32 24.32 30.2062 24.32 28V8C24.32 5.79375 22.5023 4 20.2667 4H17.8917C17.062 1.66875 14.8073 0 12.16 0ZM12.16 4C12.6975 4 13.213 4.21071 13.5931 4.58579C13.9731 4.96086 14.1867 5.46957 14.1867 6C14.1867 6.53043 13.9731 7.03914 13.5931 7.41421C13.213 7.78929 12.6975 8 12.16 8C11.6225 8 11.107 7.78929 10.7269 7.41421C10.3469 7.03914 10.1333 6.53043 10.1333 6C10.1333 5.46957 10.3469 4.96086 10.7269 4.58579C11.107 4.21071 11.6225 4 12.16 4ZM4.56 17C4.56 16.6022 4.72014 16.2206 5.0052 15.9393C5.29025 15.658 5.67687 15.5 6.08 15.5C6.48313 15.5 6.86975 15.658 7.1548 15.9393C7.43986 16.2206 7.6 16.6022 7.6 17C7.6 17.3978 7.43986 17.7794 7.1548 18.0607C6.86975 18.342 6.48313 18.5 6.08 18.5C5.67687 18.5 5.29025 18.342 5.0052 18.0607C4.72014 17.7794 4.56 17.3978 4.56 17ZM11.1467 16H19.2533C19.8107 16 20.2667 16.45 20.2667 17C20.2667 17.55 19.8107 18 19.2533 18H11.1467C10.5893 18 10.1333 17.55 10.1333 17C10.1333 16.45 10.5893 16 11.1467 16ZM4.56 23C4.56 22.6022 4.72014 22.2206 5.0052 21.9393C5.29025 21.658 5.67687 21.5 6.08 21.5C6.48313 21.5 6.86975 21.658 7.1548 21.9393C7.43986 22.2206 7.6 22.6022 7.6 23C7.6 23.3978 7.43986 23.7794 7.1548 24.0607C6.86975 24.342 6.48313 24.5 6.08 24.5C5.67687 24.5 5.29025 24.342 5.0052 24.0607C4.72014 23.7794 4.56 23.3978 4.56 23ZM10.1333 23C10.1333 22.45 10.5893 22 11.1467 22H19.2533C19.8107 22 20.2667 22.45 20.2667 23C20.2667 23.55 19.8107 24 19.2533 24H11.1467C10.5893 24 10.1333 23.55 10.1333 23Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
              <div className="basis-0 font-bold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#ffffff] text-[24px] text-left font-['Noto_Sans_JP',_sans-serif]" style={{ letterSpacing: '2.4px', lineHeight: '1.6' }}>
                求人一覧
              </div>
            </div>
          </div>

          {/* フィルター・検索エリア */}
          <div className="bg-[#ffffff] relative rounded-[10px] shrink-0 w-full">
            <div className="relative size-full">
              <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-[40px] relative w-full">
                {/* 上段フィルター行 */}
                <div className="box-border content-stretch flex flex-row gap-10 items-start justify-start p-0 relative shrink-0 w-full">
                  {/* ステータスフィルター */}
                  <div className="flex gap-4 items-center justify-start p-0 relative shrink-0">
                    <div className="font-bold leading-[0] not-italic relative shrink-0 text-[#323232] text-[16px] text-right whitespace-nowrap font-['Noto_Sans_JP',_sans-serif]" style={{ letterSpacing: '1.6px', lineHeight: '2' }}>
                      ステータス
                    </div>
                    <div className="flex gap-0 items-center justify-start p-0 relative shrink-0">
                      {statusTabs.map((label, idx) => (
                        <div
                          key={label}
                          className={`${
                            selectedStatus === label
                              ? 'bg-[#d2f1da]'
                              : 'bg-[#ffffff]'
                          } box-border content-stretch flex flex-row gap-2.5 items-center justify-center min-w-[62px] px-4 py-1 relative shrink-0 cursor-pointer`}
                          onClick={() => setSelectedStatus(label)}
                        >
                          <div className="absolute border border-[#efefef] border-solid inset-[-0.5px] pointer-events-none" />
                          <div className={`font-bold leading-[0] not-italic relative shrink-0 ${
                            selectedStatus === label
                              ? 'text-[#0f9058]'
                              : 'text-[#999999]'
                          } text-[14px] text-center text-nowrap font-['Noto_Sans_JP',_sans-serif]`} style={{ letterSpacing: '1.4px', lineHeight: '1.6' }}>
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 公開範囲フィルター */}
                  <div className="flex gap-4 items-center justify-start p-0 relative shrink-0">
                    <div className="font-bold leading-[0] not-italic relative shrink-0 text-[#323232] text-[16px] text-right whitespace-nowrap font-['Noto_Sans_JP',_sans-serif]" style={{ letterSpacing: '1.6px', lineHeight: '2' }}>
                      公開範囲
                    </div>
                    <div className="flex gap-0 items-center justify-start p-0 relative shrink-0">
                      {scopeTabs.map((label, idx) => (
                        <div
                          key={label}
                          className={`${
                            selectedScope === label
                              ? 'bg-[#d2f1da]'
                              : 'bg-[#ffffff]'
                          } box-border content-stretch flex flex-row gap-2.5 items-center justify-center min-w-[62px] px-4 py-1 relative shrink-0 cursor-pointer`}
                          onClick={() => setSelectedScope(label)}
                        >
                          <div className="absolute border border-[#efefef] border-solid inset-[-0.5px] pointer-events-none" />
                          <div className={`font-bold leading-[0] not-italic relative shrink-0 ${
                            selectedScope === label
                              ? 'text-[#0f9058]'
                              : 'text-[#999999]'
                          } text-[14px] text-center text-nowrap font-['Noto_Sans_JP',_sans-serif]`} style={{ letterSpacing: '1.4px', lineHeight: '1.6' }}>
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 下段フィルター行 */}
                <div className="box-border content-stretch flex flex-row gap-10 items-start justify-start p-0 relative shrink-0 w-full">
                  {/* グループセレクト */}
                  <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0">
                    <div className="font-bold leading-[0] not-italic relative shrink-0 text-[#323232] text-[16px] text-left text-nowrap font-['Noto_Sans_JP',_sans-serif]" style={{ letterSpacing: '1.6px', lineHeight: '2' }}>
                      グループ
                    </div>
                    <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-4 items-center justify-start pl-[11px] pr-4 py-2 relative rounded-[5px] shrink-0 w-60">
                      <div className="absolute border border-[#999999] border-solid inset-0 pointer-events-none rounded-[5px]" />
                      <div className="basis-0 font-bold leading-[0] grow min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#323232] text-[14px] text-left text-nowrap font-['Noto_Sans_JP',_sans-serif]" style={{ letterSpacing: '1.4px', lineHeight: '1.6' }}>
                        すべて
                      </div>
                      <div className="flex flex-row items-center self-stretch">
                        <div className="box-border content-stretch flex flex-col h-full items-center justify-start pb-0 pt-1.5 px-0 relative shrink-0 w-3.5">
                          <div className="h-[9.333px] relative shrink-0 w-3.5">
                            <svg
                              className="block size-full"
                              fill="none"
                              preserveAspectRatio="none"
                              viewBox="0 0 14 10"
                            >
                              <path
                                d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                                fill="#0F9058"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 検索用 */}
                  <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0 w-[297px]">
                    <div className="font-bold leading-[0] not-italic relative shrink-0 text-[#323232] text-[16px] text-left text-nowrap font-['Noto_Sans_JP',_sans-serif]" style={{ letterSpacing: '1.6px', lineHeight: '2' }}>
                      求人タイトル、職種から検索
                    </div>
                    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
                      <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-[11px] py-1 relative rounded-[5px] shrink-0 w-60">
                        <div className="absolute border border-[#999999] border-solid inset-0 pointer-events-none rounded-[5px]" />
                        <div className="basis-0 font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#999999] text-[16px] text-left font-['Noto_Sans_JP',_sans-serif]" style={{ letterSpacing: '1.6px', lineHeight: '2' }}>
                          キーワード検索
                        </div>
                      </div>
                      <div
                        className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-6 py-2 relative rounded-[32px] shrink-0 cursor-pointer"
                        style={{
                          background: 'linear-gradient(180deg, #17856F 0%, #229A4E 100%)',
                        }}
                      >
                        <div className="font-bold leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-center text-nowrap font-['Noto_Sans_JP',_sans-serif]" style={{ letterSpacing: '1.4px', lineHeight: '1.6' }}>
                          検索
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
