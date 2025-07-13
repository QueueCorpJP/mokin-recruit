'use client';

import React, { useState, useEffect } from 'react';
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

// 二つ目のファイルのAPI型定義
interface APIJobPosting {
  id: string;
  title: string;
  job_description: string;
  required_skills: string[];
  preferred_skills: string[];
  salary_min: number | null;
  salary_max: number | null;
  employment_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
  work_location: string;
  remote_work_available: boolean;
  job_type: string;
  industry: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  application_deadline: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  company_group_id: string;
}

interface CompanyGroup {
  id: string;
  group_name: string;
  description: string;
}

// 雇用形態表示用のヘルパー関数
const getEmploymentTypeDisplay = (type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN') => {
  switch (type) {
    case 'FULL_TIME':
      return '正社員';
    case 'PART_TIME':
      return 'パートタイム';
    case 'CONTRACT':
      return '契約社員';
    case 'INTERN':
      return 'インターン';
    default:
      return type;
  }
};

// APIデータを一つ目のファイルの形式に変換する関数
const convertAPIJobToDisplayJob = (apiJob: APIJobPosting, groups: CompanyGroup[]): JobPosting => {
  const group = groups.find(g => g.id === apiJob.company_group_id);
  
  // APIのステータスを表示用ステータスに変換
  let displayStatus: JobStatus;
  switch (apiJob.status) {
    case 'DRAFT':
      displayStatus = 'DRAFT';
      break;
    case 'PUBLISHED':
      displayStatus = 'PUBLISHED';
      break;
    case 'CLOSED':
      displayStatus = 'CLOSED';
      break;
    default:
      displayStatus = 'DRAFT';
  }

  return {
    id: apiJob.id,
    groupName: group?.group_name || 'グループなし',
    jobTypes: [apiJob.job_type, apiJob.industry, getEmploymentTypeDisplay(apiJob.employment_type)],
    title: apiJob.title,
    status: displayStatus,
    publicationType: 'SCOUT_ONLY', // デフォルト値
    internalMemo: apiJob.job_description,
    publishedAt: apiJob.published_at,
    updatedAt: apiJob.updated_at,
  };
};

// データ取得用フック
const useCompanyJobs = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [groups, setGroups] = useState<CompanyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async (filters?: { status?: string; groupId?: string; keyword?: string }) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      
      if (filters?.status) {
        params.append('status', filters.status);
      }
      if (filters?.groupId) {
        params.append('groupId', filters.groupId);
      }
      if (filters?.keyword) {
        params.append('keyword', filters.keyword);
      }

      const finalUrl = `/api/company/jobs?${params.toString()}`;

      const response = await fetch(finalUrl);

      const result = await response.json();
      
      if (result.success) {
        // APIデータを表示用データに変換
        const displayJobs = result.data.jobs.map((apiJob: APIJobPosting) => 
          convertAPIJobToDisplayJob(apiJob, result.data.groups)
        );
        
        setJobs(displayJobs);
        setGroups(result.data.groups);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return { jobs, groups, loading, error, fetchJobs };
};

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
  const { jobs, groups, loading, error, fetchJobs } = useCompanyJobs();
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
  const [selectedGroup, setSelectedGroup] = useState('すべて');
  const [keyword, setKeyword] = useState('');

  // 初回データ取得
  useEffect(() => {
    fetchJobs();
  }, []);

  // フィルター変更時のデータ再取得
  const handleFilterChange = () => {
    const filters: { status?: string; groupId?: string; keyword?: string } = {};
    
    if (selectedStatus !== 'すべて') {
      // 表示用のラベルをAPIのステータスに変換
      let apiStatus = selectedStatus;
      if (selectedStatus === '下書き') apiStatus = 'DRAFT';
      if (selectedStatus === '掲載済') apiStatus = 'PUBLISHED';
      if (selectedStatus === '掲載終了') apiStatus = 'CLOSED';
      filters.status = apiStatus;
    }
    if (selectedGroup !== 'すべて') {
      filters.groupId = selectedGroup;
    }
    if (keyword.trim()) {
      filters.keyword = keyword.trim();
    }
    
    fetchJobs(filters);
  };

  // ステータス変更時
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setTimeout(handleFilterChange, 0);
  };

  // グループ変更時
  const handleGroupChange = (groupId: string) => {
    setSelectedGroup(groupId);
    setTimeout(handleFilterChange, 0);
  };

  // 検索実行
  const handleSearch = () => {
    handleFilterChange();
  };

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
                      onClick={() => handleStatusChange(label)}
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
                <select 
                  className='h-[40px] w-[240px] rounded-[5px] border border-[#999] px-4 py-2 text-[14px] font-bold text-[#323232] tracking-[0.1em] bg-white'
                  value={selectedGroup}
                  onChange={(e) => handleGroupChange(e.target.value)}
                >
                  <option value="すべて">すべて</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>
                      {group.group_name}
                    </option>
                  ))}
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
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button 
                  className='h-[40px] px-6 rounded-[5px] bg-[#0F9058] text-white font-bold text-[14px] tracking-[0.1em]'
                  onClick={handleSearch}
                >
                  検索
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 求人一覧エリア - 完全に新しく追加 */}
      <div className='w-[1280px] mx-auto px-10 pb-10'>
        {/* ヘッダー */}
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-[20px] font-bold text-[#323232] tracking-[0.1em]'>
            求人一覧 ({jobs.length}件)
          </h2>
          <button className='flex items-center gap-2 h-[40px] px-6 rounded-[5px] bg-[#0F9058] text-white font-bold text-[14px] tracking-[0.1em] hover:bg-[#0D7A4A] transition-colors'>
            <Plus className='w-4 h-4' />
            新規作成
          </button>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4'>
            {error}
          </div>
        )}

        {/* ローディング表示 */}
        {loading ? (
          <div className='text-center py-8'>
            <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F9058]'></div>
            <p className='mt-2 text-gray-600'>読み込み中...</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {jobs.length === 0 ? (
              <div className='text-center py-12 bg-gray-50 rounded-lg'>
                <p className='text-gray-500'>条件に一致する求人が見つかりませんでした。</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className='bg-white border border-[#E5E5E5] rounded-[10px] p-6 shadow-sm hover:shadow-md transition-shadow'
                >
                  <div className='flex justify-between items-start mb-4'>
                    {/* 左側：求人情報 */}
                    <div className='flex-1'>
                      <div className='flex items-center gap-4 mb-3'>
                        <span className='text-[14px] font-bold text-[#666] tracking-[0.1em]'>
                          {job.groupName}
                        </span>
                        <div className='flex gap-2'>
                          {job.jobTypes.map((type, idx) => (
                            <span
                              key={idx}
                              className='text-[12px] bg-[#F5F5F5] text-[#666] px-2 py-1 rounded-sm'
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                      <h3 className='text-[16px] font-bold text-[#323232] tracking-[0.1em] mb-3 leading-[1.4]'>
                        {job.title}
                      </h3>
                      <p className='text-[14px] text-[#666] line-clamp-2 mb-3'>
                        {job.internalMemo}
                      </p>
                      <div className='flex items-center gap-4 text-[12px] text-[#999]'>
                        <span>更新日: {job.updatedAt}</span>
                        {job.publishedAt && (
                          <span>公開日: {job.publishedAt}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* 右側：ステータス・公開範囲・操作 */}
                    <div className='ml-6 flex flex-col items-end gap-3'>
                      <div className='flex gap-2'>
                        <span
                          className={`inline-block px-3 py-1 rounded text-[12px] font-bold whitespace-pre-line text-center ${
                            getStatusDisplay(job.status).className
                          }`}
                        >
                          {getStatusDisplay(job.status).text}
                        </span>
                        <span
                          className={`inline-block px-3 py-1 rounded text-[12px] font-bold ${
                            getPublicationTypeDisplay(job.publicationType).className
                          }`}
                        >
                          {getPublicationTypeDisplay(job.publicationType).text}
                        </span>
                      </div>
                      <button className='text-[#666] hover:text-[#323232] transition-colors'>
                        <MoreHorizontal className='w-5 h-5' />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}