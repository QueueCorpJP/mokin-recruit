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
  // フィルター状態
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [publicationFilter, setPublicationFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // ページネーション状態
  const [currentPage, setCurrentPage] = useState<number>(10);
  const totalItems = 1000;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className='min-h-screen bg-gradient-to-b from-green-700 to-green-500'>
      {/* メインコンテンツエリア */}
      <div className='px-20 py-10'>
        {/* ページタイトル */}
        <div className='mb-10'>
          <div className='flex items-center gap-4 mb-4'>
            <div className='w-8 h-8 flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-white'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M3 4V2H21V4H20V6C20 7.1 19.1 8 18 8H17V20C17 21.1 16.1 22 15 22H9C7.9 22 7 21.1 7 20V8H6C4.9 8 4 7.1 4 6V4H3ZM6 6V4H18V6H16V20H8V6H6ZM9 8V18H11V8H9ZM13 8V18H15V8H13Z' />
              </svg>
            </div>
            <h1 className='text-2xl font-bold text-white'>求人一覧</h1>
          </div>
        </div>

        {/* フィルター・検索エリア */}
        <div className='bg-white rounded-lg p-10 mb-10 shadow-sm'>
          <div className='flex gap-10 mb-6'>
            {/* ステータスフィルター */}
            <div className='flex items-center gap-4'>
              <label className='text-base font-bold text-gray-800 min-w-[80px] text-right'>
                ステータス
              </label>
              <div className='flex gap-2'>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-1 text-sm font-bold border rounded ${
                    statusFilter === 'all'
                      ? 'bg-green-100 text-green-600 border-green-600'
                      : 'bg-white text-gray-500 border-gray-300'
                  }`}
                >
                  すべて
                </button>
                <button
                  onClick={() => setStatusFilter('draft')}
                  className={`px-4 py-1 text-sm font-bold border rounded ${
                    statusFilter === 'draft'
                      ? 'bg-green-100 text-green-600 border-green-600'
                      : 'bg-white text-gray-500 border-gray-300'
                  }`}
                >
                  下書き
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-4 py-1 text-sm font-bold border rounded ${
                    statusFilter === 'pending'
                      ? 'bg-green-100 text-green-600 border-green-600'
                      : 'bg-white text-gray-500 border-gray-300'
                  }`}
                >
                  掲載待ち（承認待ち）
                </button>
                <button
                  onClick={() => setStatusFilter('published')}
                  className={`px-4 py-1 text-sm font-bold border rounded ${
                    statusFilter === 'published'
                      ? 'bg-green-100 text-green-600 border-green-600'
                      : 'bg-white text-gray-500 border-gray-300'
                  }`}
                >
                  掲載済
                </button>
              </div>
            </div>
          </div>

          <div className='flex gap-10'>
            {/* 公開範囲フィルター */}
            <div className='flex items-center gap-4'>
              <label className='text-base font-bold text-gray-800 min-w-[80px] text-right'>
                公開範囲
              </label>
              <div className='flex gap-2'>
                <button
                  onClick={() => setPublicationFilter('all')}
                  className={`px-4 py-1 text-sm font-bold border rounded ${
                    publicationFilter === 'all'
                      ? 'bg-green-100 text-green-600 border-green-600'
                      : 'bg-white text-gray-500 border-gray-300'
                  }`}
                >
                  すべて
                </button>
                <button
                  onClick={() => setPublicationFilter('public')}
                  className={`px-4 py-1 text-sm font-bold border rounded ${
                    publicationFilter === 'public'
                      ? 'bg-green-100 text-green-600 border-green-600'
                      : 'bg-white text-gray-500 border-gray-300'
                  }`}
                >
                  一般公開
                </button>
                <button
                  onClick={() => setPublicationFilter('members')}
                  className={`px-4 py-1 text-sm font-bold border rounded ${
                    publicationFilter === 'members'
                      ? 'bg-green-100 text-green-600 border-green-600'
                      : 'bg-white text-gray-500 border-gray-300'
                  }`}
                >
                  登録会員限定
                </button>
                <button
                  onClick={() => setPublicationFilter('scout')}
                  className={`px-4 py-1 text-sm font-bold border rounded ${
                    publicationFilter === 'scout'
                      ? 'bg-green-100 text-green-600 border-green-600'
                      : 'bg-white text-gray-500 border-gray-300'
                  }`}
                >
                  スカウト限定
                </button>
                <button
                  onClick={() => setPublicationFilter('private')}
                  className={`px-4 py-1 text-sm font-bold border rounded ${
                    publicationFilter === 'private'
                      ? 'bg-green-100 text-green-600 border-green-600'
                      : 'bg-white text-gray-500 border-gray-300'
                  }`}
                >
                  公開停止
                </button>
              </div>
            </div>
          </div>

          <div className='flex gap-10 mt-6'>
            {/* グループフィルター */}
            <div className='flex items-center gap-4'>
              <label className='text-base font-bold text-gray-800'>
                グループ
              </label>
              <div className='relative'>
                <select
                  value={groupFilter}
                  onChange={e => setGroupFilter(e.target.value)}
                  className='w-60 px-3 py-2 text-sm border border-gray-400 rounded focus:outline-none focus:border-green-600 appearance-none bg-white'
                >
                  <option value='all'>すべて</option>
                  <option value='group1'>グループ1</option>
                  <option value='group2'>グループ2</option>
                </select>
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                  <svg
                    className='w-3 h-3 text-green-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* 検索フィールド */}
            <div className='flex items-center gap-4 flex-1'>
              <label className='text-base font-bold text-gray-800'>
                求人タイトル、職種から検索
              </label>
              <div className='flex gap-2'>
                <div className='relative flex-1'>
                  <input
                    type='text'
                    value={searchKeyword}
                    onChange={e => setSearchKeyword(e.target.value)}
                    placeholder='キーワード検索'
                    className='w-60 px-3 py-2 text-base text-gray-500 border border-gray-400 rounded focus:outline-none focus:border-green-600'
                  />
                </div>
                <button className='px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-green-700 to-green-500 rounded-full hover:opacity-90 transition-opacity'>
                  検索
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* アクションエリア */}
        <div className='bg-gray-50 rounded-lg p-10 mb-10'>
          <div className='flex justify-between items-start mb-6'>
            {/* 新規求人作成ボタン */}
            <button className='flex items-center gap-2 px-10 py-3 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-green-600 rounded-full shadow-lg hover:opacity-90 transition-opacity'>
              <Plus className='w-5 h-5' />
              新規求人作成
            </button>

            {/* ページネーション情報とヘルプ */}
            <div className='flex flex-col items-end gap-4'>
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <svg
                    className='w-2 h-2 text-green-600'
                    fill='currentColor'
                    viewBox='0 0 8 8'
                  >
                    <path d='M0 0h8v8H0z' />
                  </svg>
                  <span className='text-xs font-bold text-gray-800'>
                    1〜10件 / 1,000件
                  </span>
                  <svg
                    className='w-2 h-2 text-green-600'
                    fill='currentColor'
                    viewBox='0 0 8 8'
                  >
                    <path d='M0 0h8v8H0z' />
                  </svg>
                </div>
                <div className='flex items-center gap-1'>
                  <svg
                    className='w-4 h-4 text-gray-500'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span className='text-xs font-bold text-gray-500'>
                    求人の削除ついて
                  </span>
                </div>
              </div>

              {/* 求人削除についての説明 */}
              <div className='bg-green-50 border border-green-100 rounded p-4 shadow-sm max-w-md'>
                <h4 className='text-sm font-bold text-gray-800 mb-1'>
                  求人の削除について
                </h4>
                <p className='text-xs text-black'>
                  すでに候補者にスカウトを送信済、もしくは候補者からの応募があった求人は削除することができません。
                </p>
              </div>
            </div>
          </div>

          {/* 求人リストテーブル */}
          <div className='bg-white rounded-lg overflow-hidden'>
            {/* テーブルヘッダー */}
            <div className='grid grid-cols-[160px_424px_76px_107px_112px_70px_76px_24px] gap-6 px-10 py-2 border-b border-gray-200 bg-white'>
              <div className='text-sm font-bold text-gray-800'>グループ</div>
              <div className='text-sm font-bold text-gray-800'>
                職種／求人タイトル
              </div>
              <div className='text-sm font-bold text-gray-800'>ステータス</div>
              <div className='text-sm font-bold text-gray-800'>公開範囲</div>
              <div className='text-sm font-bold text-gray-800'>社内メモ</div>
              <div className='text-sm font-bold text-gray-800'>公開日</div>
              <div className='text-sm font-bold text-gray-800'>最終更新日</div>
              <div></div>
            </div>

            {/* 求人アイテム */}
            {sampleJobs.map(job => {
              const statusDisplay = getStatusDisplay(job.status);
              const publicationDisplay = getPublicationTypeDisplay(
                job.publicationType
              );

              return (
                <div
                  key={job.id}
                  className='grid grid-cols-[160px_424px_76px_107px_112px_70px_76px_24px] gap-6 px-10 py-5 border-b border-gray-100 bg-white shadow-sm hover:bg-gray-50 transition-colors'
                >
                  {/* グループ名 */}
                  <div className='flex items-center'>
                    <div className='w-40 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center px-5'>
                      <span className='text-sm font-bold text-white truncate'>
                        {job.groupName}
                      </span>
                    </div>
                  </div>

                  {/* 職種／求人タイトル */}
                  <div className='flex flex-col gap-2'>
                    <div className='flex gap-2 flex-wrap'>
                      {job.jobTypes.map((type, index) => (
                        <span
                          key={index}
                          className='px-4 py-1 text-sm font-medium text-green-600 bg-green-100 rounded-lg'
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                    <p className='text-base font-bold text-gray-800 line-clamp-2 leading-7'>
                      {job.title}
                    </p>
                  </div>

                  {/* ステータス */}
                  <div className='flex items-center'>
                    <div
                      className={`w-16 px-2 py-1 text-xs font-bold text-center rounded whitespace-pre-line ${statusDisplay.className}`}
                    >
                      {statusDisplay.text}
                    </div>
                  </div>

                  {/* 公開範囲 */}
                  <div className='flex items-center'>
                    <div
                      className={`w-26 px-2 py-1 text-xs font-bold text-center rounded ${publicationDisplay.className}`}
                    >
                      {publicationDisplay.text}
                    </div>
                  </div>

                  {/* 社内メモ */}
                  <div className='flex items-start'>
                    <p className='text-sm text-gray-800 line-clamp-4 leading-4'>
                      {job.internalMemo}
                    </p>
                  </div>

                  {/* 公開日 */}
                  <div className='flex items-center'>
                    <span className='text-xs text-gray-800'>
                      {job.publishedAt || 'yyyy/mm/dd'}
                    </span>
                  </div>

                  {/* 最終更新日 */}
                  <div className='flex items-center'>
                    <span className='text-xs text-gray-800'>
                      {job.updatedAt}
                    </span>
                  </div>

                  {/* アクションメニュー */}
                  <div className='flex items-center justify-center relative'>
                    <button className='w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded'>
                      <MoreHorizontal className='w-4 h-4 text-gray-400' />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ページネーション */}
        <div className='flex justify-center gap-4'>
          <button
            disabled={currentPage === 1}
            className='w-14 h-14 flex items-center justify-center border border-green-600 rounded-full hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <ChevronLeft className='w-4 h-4 text-green-600' />
          </button>

          {/* ページ番号ボタン */}
          {[9, 10, 11, 100].map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-14 h-14 flex items-center justify-center rounded-full font-bold text-base transition-colors ${
                currentPage === page
                  ? 'bg-green-600 text-white'
                  : 'border border-green-600 text-green-600 hover:bg-green-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            className='w-14 h-14 flex items-center justify-center border border-green-600 rounded-full hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <ChevronRight className='w-4 h-4 text-green-600' />
          </button>
        </div>
      </div>
    </div>
  );
}
