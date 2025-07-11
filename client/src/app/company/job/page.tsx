'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

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

// ステータス表示用のヘルパー関数
const getStatusDisplay = (status: JobStatus) => {
  switch (status) {
    case 'DRAFT':
      return {
        text: '下書き',
        className: 'bg-white text-gray-500 border border-gray-300',
      };
    case 'PENDING_APPROVAL':
      return {
        text: '掲載待ち\n(承認待ち)',
        className: 'bg-white text-red-500 border border-gray-300',
      };
    case 'PUBLISHED':
      return {
        text: '掲載済',
        className: 'bg-white text-green-600 border border-gray-300',
      };
    case 'CLOSED':
      return {
        text: '掲載終了',
        className: 'bg-gray-100 text-gray-500 border border-gray-300',
      };
    default:
      return {
        text: '不明',
        className: 'bg-gray-100 text-gray-500 border border-gray-300',
      };
  }
};

// 公開範囲表示用のヘルパー関数
const getPublicationTypeDisplay = (type: PublicationType) => {
  switch (type) {
    case 'PUBLIC':
      return { text: '一般公開', className: 'bg-green-600 text-white' };
    case 'MEMBERS_ONLY':
      return { text: '登録会員限定', className: 'bg-blue-600 text-white' };
    case 'SCOUT_ONLY':
      return { text: 'スカウト限定', className: 'bg-green-600 text-white' };
    case 'PRIVATE':
      return { text: '公開停止', className: 'bg-gray-500 text-white' };
    default:
      return { text: '不明', className: 'bg-gray-500 text-white' };
  }
};

export default function CompanyJobsPage() {
  const [selectedStatus, setSelectedStatus] = useState('すべて');
  const statusTabs = ['すべて', '下書き', '掲載待ち', '掲載済'];
  const [selectedScope, setSelectedScope] = useState('すべて');
  const scopeTabs = [
    'すべて',
    '一般公開',
    '登録会員限定',
    'スカウト限定',
    '公開停止',
  ];
  return (
    <div className='min-h-screen bg-white flex flex-col gap-10'>
      {/* グラデーション背景（画面全体） */}
      <div className='w-full h-[334px] bg-gradient-to-b from-[#17856F] to-[#229A4E] flex items-center'>
        {/* 中央寄せ・幅1280pxのボックス */}
        <div className='w-[1280px] mx-auto'>
          {/* タイトル行 */}
          <div className='flex items-center gap-4 mb-6 pt-10 px-10'>
            <div className='w-8 h-8 flex items-center justify-center bg-gradient-to-b from-[#17856F] to-[#229A4E] rounded'>
              {/* SVGアイコン（ボード型） */}
              <svg
                className='w-6 h-6 text-white'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M3 4V2H21V4H20V6C20 7.1 19.1 8 18 8H17V20C17 21.1 16.1 22 15 22H9C7.9 22 7 21.1 7 20V8H6C4.9 8 4 7.1 4 6V4H3ZM6 6V4H18V6H16V20H8V6H6ZM9 8V18H11V8H9ZM13 8V18H15V8H13Z' />
              </svg>
            </div>
            <h1 className='text-[24px] font-bold text-[#323232] tracking-[0.1em] font-sans'>
              求人一覧
            </h1>
          </div>
          {/* フィルター・検索エリア */}
          <div className='bg-white rounded-[10px] w-[1280px] mx-auto p-[40px] flex flex-col gap-y-6 shadow-md'>
            {/* 上段フィルター */}
            <div className='flex gap-x-10 items-center'>
              {/* ステータスフィルター */}
              <div className='flex items-center gap-x-4 min-w-[120px]'>
                <span className='w-[87px] h-[32px] flex items-center justify-end text-[16px] font-bold text-[#323232] tracking-[0.1em] whitespace-nowrap'>
                  ステータス
                </span>
                <div className='flex'>
                  {statusTabs.map((label, idx) => (
                    <button
                      key={label}
                      onClick={() => setSelectedStatus(label)}
                      className={[
                        'h-[32px] px-4 font-bold text-[16px] tracking-[0.1em] whitespace-nowrap focus:z-10 focus:outline-none [padding-left:16px] [padding-right:16px]',
                        idx === 0
                          ? 'rounded-l-[5px] border border-[#EFEFEF] border-r-0'
                          : idx === statusTabs.length - 1
                            ? 'rounded-r-[5px] border border-[#EFEFEF]'
                            : 'border-t border-b border-[#EFEFEF] border-r-0',
                        selectedStatus === label
                          ? 'bg-[#D2F1DA] text-[#0F9058]'
                          : 'bg-white text-[#999] hover:bg-[#E6F7EC] hover:text-[#0F9058] active:bg-[#B8E6C7]',
                      ].join(' ')}
                      aria-pressed={selectedStatus === label}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {/* 公開範囲フィルター */}
              <div className='flex items-center gap-x-4 min-w-[180px]'>
                <span className='block text-[16px] font-bold text-[#323232] tracking-[0.1em] text-right w-[72px]'>
                  公開範囲
                </span>
                <div className='flex'>
                  {scopeTabs.map((label, idx) => (
                    <button
                      key={label}
                      onClick={() => setSelectedScope(label)}
                      className={[
                        'h-[32px] px-4 font-bold text-[16px] tracking-[0.1em] whitespace-nowrap focus:z-10 focus:outline-none [padding-left:16px] [padding-right:16px]',
                        idx === 0
                          ? 'rounded-l-[5px] border border-[#EFEFEF] border-r-0'
                          : idx === scopeTabs.length - 1
                            ? 'rounded-r-[5px] border border-[#EFEFEF]'
                            : 'border-t border-b border-[#EFEFEF] border-r-0',
                        selectedScope === label
                          ? 'bg-[#D2F1DA] text-[#0F9058]'
                          : 'bg-white text-[#999] hover:bg-[#E6F7EC] hover:text-[#0F9058] active:bg-[#B8E6C7]',
                      ].join(' ')}
                      aria-pressed={selectedScope === label}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* 下段フィルター */}
            <div className='flex gap-x-10 items-center'>
              {/* グループセレクト */}
              <div className='flex items-center gap-x-4 min-w-[180px]'>
                <span className='block text-[16px] font-bold text-[#323232] tracking-[0.1em] text-right w-[72px]'>
                  グループ
                </span>
                <select className='h-[40px] w-[240px] rounded-[5px] border border-[#999] px-4 py-2 text-[14px] font-bold text-[#323232] tracking-[0.1em] bg-white'>
                  <option>すべて</option>
                  <option>グループA</option>
                  <option>グループB</option>
                </select>
              </div>
              {/* キーワード検索 */}
              <div className='flex items-center gap-x-4 min-w-[180px]'>
                <span className='block text-[16px] font-bold text-[#323232] tracking-[0.1em] text-right w-[72px]'>
                  キーワード
                </span>
                <input
                  type='text'
                  className='h-[40px] w-[240px] rounded-[5px] border border-[#999] px-4 py-2 text-[14px] font-bold text-[#323232] tracking-[0.1em] bg-white'
                  placeholder='キーワードで検索'
                />
                <button className='h-[40px] px-6 rounded-[5px] bg-[#0F9058] text-white font-bold text-[14px] tracking-[0.1em]'>
                  検索
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
