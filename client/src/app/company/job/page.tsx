'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Plus } from 'lucide-react';
import { BaseInput } from '@/components/ui/base-input';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/Pagination';
import { PaginationArrow } from '@/components/svg/PaginationArrow';
import { QuestionIcon } from '@/components/svg/QuestionIcon';
import { SelectInput } from '@/components/ui/select-input';
import { useAuthIsAuthenticated, useAuthIsLoading, useAuthInitialized } from '@/stores/authStore';

// 求人ステータスの型定義
type JobStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'CLOSED';

// 求人データの型定義
interface JobPosting {
  id: string;
  title: string;
  jobType: string[];
  industry: string[];
  employmentType: string;
  workLocation: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  status: JobStatus;
  groupName: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  publicationType: string;
  internalMemo: string;
}

// ステータス表示用のマッピング
const statusLabels: Record<JobStatus, string> = {
  DRAFT: '下書き',
  PENDING_APPROVAL: '掲載待ち（承認待ち）',
  PUBLISHED: '掲載済',
  CLOSED: '停止',
};

const statusColors: Record<JobStatus, string> = {
  DRAFT: 'bg-[#F5F5F5] text-[#666666]',
  PENDING_APPROVAL: 'bg-[#FFF8E7] text-[#E6A23C]',
  PUBLISHED: 'bg-[#F0F9F2] text-[#67C23A]',
  CLOSED: 'bg-[#FEF0F0] text-[#F56C6C]',
};

export default function CompanyJobsPage() {
  const router = useRouter();
  // 🔥 根本修正: 個別フック使用でオブジェクト返却を完全回避
  const isAuthenticated = useAuthIsAuthenticated();
  const authLoading = useAuthIsLoading();
  const initialized = useAuthInitialized();

  // 状態管理
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false); // 初期値をfalseに変更
  const [selectedStatus, setSelectedStatus] = useState('すべて');
  const [selectedGroup, setSelectedGroup] = useState('すべて');
  const [selectedScope, setSelectedScope] = useState('すべて');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<{id: string; group_name: string; description: string}[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const displayedJobs = jobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusTabs = ['すべて', '下書き', '掲載待ち（承認待ち）', '掲載済'];

  // グループ選択肢を動的に生成
  const groupOptions = [
    { value: 'すべて', label: 'すべて' },
    ...groups.map(group => ({
      value: group.id,
      label: group.group_name
    }))
  ];

  // グループデータを取得
  const fetchGroups = useCallback(async () => {
    try {
      const response = await fetch('/api/company/groups', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setGroups(result.data || []);
      } else {
        console.error('グループ情報の取得に失敗しました:', result.error);
        setGroups([]);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroups([]);
    }
  }, []);

  // 求人データを取得
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedStatus !== 'すべて') params.append('status', selectedStatus);
      if (selectedGroup !== 'すべて') params.append('groupId', selectedGroup);
      if (selectedScope !== 'すべて') params.append('scope', selectedScope);
      if (searchKeyword.trim()) params.append('search', searchKeyword.trim());

      const response = await fetch(`/api/company/job?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // 停止状態の求人を除外（「すべて」選択時でも停止状態は非表示）
        const filteredJobs = (result.data || []).filter((job: JobPosting) => job.status !== 'CLOSED');
        setJobs(filteredJobs);
      } else {
        setError(result.error || '求人情報の取得に失敗しました');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, selectedGroup, selectedScope, searchKeyword]);

  // 認証完了後の初回データ取得
  useEffect(() => {
    if (initialized && !authLoading && isAuthenticated) {
      fetchGroups();
      fetchJobs();
    }
  }, [initialized, authLoading, isAuthenticated, fetchGroups, fetchJobs]);

  // フィルター変更時のデータ再取得
  useEffect(() => {
    if (initialized && !authLoading && isAuthenticated) {
      fetchJobs();
    }
  }, [selectedStatus, selectedGroup, selectedScope, initialized, authLoading, isAuthenticated, fetchJobs]);

  // 検索実行
  const handleSearch = () => {
    fetchJobs();
  };

  // 新規求人作成ボタン
  const handleNewJob = () => {
    router.push('/company/job/new');
  };

  // 求人編集
  const handleEditJob = (jobId: string) => {
    router.push(`/company/job/edit/${jobId}`);
  };

  // 求人詳細表示
  const handleViewJob = (jobId: string) => {
    router.push(`/company/job/view/${jobId}`);
  };

  // 求人複製
  const handleDuplicateJob = async (jobId: string) => {
    try {
      // 複製元の求人データを取得
      const response = await fetch(`/api/company/job/edit?id=${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const originalJob = result.data;
        
        // 複製データを作成（求人タイトルに「のコピー」を追加）
        const duplicateData = {
          ...originalJob,
          title: `${originalJob.title}のコピー`,
          // IDや日付など、複製時に引き継がない項目は除外
          id: undefined,
          createdAt: undefined,
          updatedAt: undefined,
          publishedAt: undefined,
          status: 'DRAFT'
        };
        
        // sessionStorageに複製データを保存（一時的な用途のため継続使用）
        sessionStorage.setItem('duplicateJobData', JSON.stringify(duplicateData));
        
        // 新規作成画面に遷移
        router.push('/company/job/new');
      } else {
        console.error('求人データの取得に失敗しました:', result.error);
        alert('求人データの取得に失敗しました');
      }
    } catch (error) {
      console.error('複製処理でエラーが発生しました:', error);
      alert('複製処理でエラーが発生しました');
    }
  };

  // 求人の停止（削除）
  const handleDeleteJob = async (jobId: string) => {
    try {
      // 求人のステータスをCLOSEDに変更
      const response = await fetch('/api/company/job/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          job_posting_id: jobId,
          status: 'CLOSED'
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // 成功時に一覧を再取得
        await fetchJobs();
      } else {
        console.error('求人の停止に失敗しました:', result.error);
        alert('求人の停止に失敗しました');
      }
    } catch (error) {
      console.error('求人停止処理でエラーが発生しました:', error);
      alert('求人停止処理でエラーが発生しました');
    }
  };

  // ポップアップの表示状態と対象jobId
  const [popupJobId, setPopupJobId] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  
  // 求人削除説明の表示状態
  const [showDeleteInfo, setShowDeleteInfo] = useState(false);

  // ポップアップ外クリックで閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setPopupJobId(null);
      }
    }
    if (popupJobId) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popupJobId]);

  // レイアウトで認証チェック済みのため、ここでは不要
  // 早期リターンを削除してパフォーマンスを向上

  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <div className=' w-full'>
        <div className='bg-[linear-gradient(0deg,_#17856F_0%,_#229A4E_100%)] px-[80px] py-[40px] w-full'>
          <div className='max-w-[1280px] mx-auto w-full'>
            {/* ヘッダー部分 */}
            <div className='flex justify-between items-center mb-8'>
              <div className='flex items-center gap-4'>
                {/* アイコン */}
                <div className='w-8 h-8 flex items-center justify-center'>
                  <svg
                    className='w-6 h-8 text-white'
                    fill='currentColor'
                    viewBox='0 0 25 32'
                  >
                    <path d='M12.16 0C9.51267 0 7.258 1.66875 6.42833 4H4.05333C1.81767 4 0 5.79375 0 8V28C0 30.2062 1.81767 32 4.05333 32H20.2667C22.5023 32 24.32 30.2062 24.32 28V8C24.32 5.79375 22.5023 4 20.2667 4H17.8917C17.062 1.66875 14.8073 0 12.16 0ZM12.16 4C12.6975 4 13.213 4.21071 13.5931 4.58579C13.9731 4.96086 14.1867 5.46957 14.1867 6C14.1867 6.53043 13.9731 7.03914 13.5931 7.41421C13.213 7.78929 12.6975 8 12.16 8C11.6225 8 11.107 7.78929 10.7269 7.41421C10.3469 7.03914 10.1333 6.53043 10.1333 6C10.1333 5.46957 10.3469 4.96086 10.7269 4.58579C11.107 4.21071 11.6225 4 12.16 4ZM4.56 17C4.56 16.6022 4.72014 16.2206 5.0052 15.9393C5.29025 15.658 5.67687 15.5 6.08 15.5C6.48313 15.5 6.86975 15.658 7.1548 15.9393C7.43986 16.2206 7.6 16.6022 7.6 17C7.6 17.3978 7.43986 17.7794 7.1548 18.0607C6.86975 18.342 6.48313 18.5 6.08 18.5C5.67687 18.5 5.29025 18.342 5.0052 18.0607C4.72014 17.7794 4.56 17.3978 4.56 17ZM11.1467 16H19.2533C19.8107 16 20.2667 16.45 20.2667 17C20.2667 17.55 19.8107 18 19.2533 18H11.1467C10.5893 18 10.1333 17.55 10.1333 17C10.1333 16.45 10.5893 16 11.1467 16ZM4.56 23C4.56 22.6022 4.72014 22.2206 5.0052 21.9393C5.29025 21.658 5.67687 21.5 6.08 21.5C6.48313 21.5 6.86975 21.658 7.1548 21.9393C7.43986 22.2206 7.6 22.6022 7.6 23C7.6 23.3978 7.43986 23.7794 7.1548 24.0607C6.86975 24.342 6.48313 24.5 6.08 24.5C5.67687 24.5 5.29025 24.342 5.0052 24.0607C4.72014 23.7794 4.56 23.3978 4.56 23ZM10.1333 23C10.1333 22.45 10.5893 22 11.1467 22H19.2533C19.8107 22 20.2667 22.45 20.2667 23C20.2667 23.55 19.8107 24 19.2533 24H11.1467C10.5893 24 10.1333 23.55 10.1333 23Z' />
                  </svg>
                </div>
                <h1 className="text-white text-2xl font-bold font-['Noto_Sans_JP'] text-left">
                  求人一覧
                </h1>
              </div>
            </div>

            {/* フィルター・検索エリア */}
            <div className='bg-white rounded-[10px] p-[40px] mb-6 shadow-[0_2px_16px_0_rgba(44,151,109,0.10)]'>
              {/* 上段：ステータス・公開範囲フィルター */}
              <div className='flex items-start gap-7 mb-6'>
                {/* ステータス */}
                <div className='flex items-center gap-[16px]'>
                  {' '}
                  <div className="text-[#323232] font-bold text-[16px] font-['Noto_Sans_JP'] min-w-[90px] tracking-[1.6px] leading-[32px]">
                    ステータス
                  </div>
                  <div className='flex border border-[#EFEFEF]'>
                    {statusTabs.map((status, index) => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`py-[4px] px-[16px] text-[14px] font-['Noto_Sans_JP'] transition-colors whitespace-nowrap font-bold tracking-[1.4px] leading-[24px] ${
                          index > 0 ? 'border-l border-[#EFEFEF]' : ''
                        } ${
                          selectedStatus === status
                            ? 'bg-[#D2F1DA] text-[#0F9058]'
                            : 'bg-transparent text-[#999999] hover:bg-gray-50'
                        }
                      `}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 公開範囲 */}
                <div className='flex items-center gap-[16px]'>
                  <div className="text-[#323232] font-bold text-[16px] font-['Noto_Sans_JP'] min-w-[72px] tracking-[1.6px] leading-[32px]">
                    公開範囲
                  </div>
                  <div className='flex border border-[#EFEFEF]'>
                                    {[
                  'すべて',
                  '一般公開',
                  '登録会員限定',
                  'スカウト限定',
                  '公開停止',
                ].map((scope, index) => (
                      <button
                        key={scope}
                        onClick={() => setSelectedScope(scope)}
                        className={`py-[4px] px-[16px] text-[14px] font-['Noto_Sans_JP'] transition-colors whitespace-nowrap font-bold tracking-[1.4px] leading-[24px] ${
                          index > 0 ? 'border-l border-[#EFEFEF]' : ''
                        } ${
                          selectedScope === scope
                            ? 'bg-[#D2F1DA] text-[#0F9058]'
                            : 'bg-transparent text-[#999999] hover:bg-gray-50'
                        }
                      `}
                      >
                        {scope}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 下段：グループと検索 */}
              <div className='flex items-center gap-12 mt-6'>
                {/* グループフィルター */}
                <div className='flex items-center gap-4'>
                  <div className="text-[#323232] font-bold text-[16px] font-['Noto_Sans_JP'] min-w-[70px] tracking-[1.6px] leading-[32px]">
                    グループ
                  </div>
                  <SelectInput
                    options={groupOptions}
                    value={selectedGroup}
                    placeholder='グループを選択'
                    onChange={value => setSelectedGroup(value)}
                    className='w-60'
                  />
                </div>

                {/* 検索 */}
                <div className='flex items-center gap-4'>
                  <div className="text-[#323232] font-bold text-[16px] font-['Noto_Sans_JP'] whitespace-nowrap tracking-[1.6px] leading-[32px]">
                    求人タイトル、職種から検索
                  </div>
                  <div className='flex items-center gap-3'>
                    <BaseInput
                      type='text'
                      value={searchKeyword}
                      onChange={e => setSearchKeyword(e.target.value)}
                      placeholder='キーワード検索'
                      className='w-60'
                      style={{
                        width: '240px',
                        padding: '4px 11px',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                      onKeyPress={e => e.key === 'Enter' && handleSearch()}
                    />
                    <Button
                      onClick={handleSearch}
                      variant='green-gradient'
                      size='lg'
                      className='whitespace-nowrap px-6 py-3 rounded-full'
                    >
                      検索
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full px-[80px] py-[40px] bg-[#F9F9F9]'>
          <div className='max-w-[1280px] mx-auto w-full pb-[80px]'>
            {/* 新規求人作成ボタン */}
            <div className='flex w-full items-center justify-between mb-10'>
              {/* 左：新規求人作成 */}
              <Button
                onClick={handleNewJob}
                variant='blue-gradient'
                size='lg'
                className="rounded-[25px] h-[54px] px-[40px] text-[16px] font-bold font-['Noto_Sans_JP'] transition-colors flex items-center"
              >
                新規求人作成
              </Button>

              {/* 右側まとめ（中央＋右） */}
              <div className='flex gap-3 items-center w-auto flex-shrink-0'>
                {/* 中央：求人の削除について */}
                <div 
                  className={`bg-[#F0F9F3] rounded-[8px] p-4 w-[608px] transition-all duration-[600ms] ease-in-out ${
                    showDeleteInfo 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-[-10px] scale-95 pointer-events-none'
                  }`}
                  style={{ boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.1)' }}
                >
                  <div className='font-bold text-xs mb-1'>
                    求人の削除について
                  </div>
                  <div className='text-xs'>
                    すでに候補者にスカウトを送信済、もしくは候補者からの応募があった求人は削除することができません。
                  </div>
                </div>
                {/* 右：件数表示＋リンク */}
                <div className='flex flex-col justify-center gap-3 items-end min-w-[180px] h-[67.98px]'>
                  <div className='flex items-center gap-2'>
                    <button
                      className='text-[#4FC3A1] text-xs px-1 font-bold flex items-center justify-center'
                      aria-label='前のページ'
                    >
                      <PaginationArrow direction='left' />
                    </button>
                    <span className='text-[#323232] text-xs font-bold'>
                      1〜10件 / 1,000件
                    </span>
                    <button
                      className='text-[#4FC3A1] text-xs px-1 font-bold flex items-center justify-center'
                      aria-label='次のページ'
                    >
                      <PaginationArrow direction='right' />
                    </button>
                  </div>
                  <button 
                    className='flex items-center gap-1 text-[#999999] text-xs font-bold focus:outline-none'
                    onMouseEnter={() => setShowDeleteInfo(true)}
                    onMouseLeave={() => setShowDeleteInfo(false)}
                  >
                    <QuestionIcon />
                    <span className='underline'>求人の削除について</span>
                  </button>
                </div>
              </div>
            </div>

            {/* テーブルヘッダー */}
            <div className='rounded-t-lg flex flex-col items-center justify-center'>
              <div className="max-w-[1280px] w-full mx-auto flex gap-[24px] border-b border-[#DCDCDC] text-[#222] text-[14px] font-bold font-['Noto_Sans_JP'] px-[40px] pr-[82px] pb-2">
                <div className='w-[160px]'>グループ</div>
                <div className='w-[424px]'>職種 / 求人タイトル</div>
                <div className='w-[90px]'>ステータス</div>
                <div className='w-[107px]'>公開範囲</div>
                <div className='w-[112px]'>社内メモ</div>
                <div className='w-[70px]'>登録日</div>
                <div className='w-[76px]'>最終更新日</div>
              </div>
              <div className='mt-2'></div>

              {/* エラー表示 */}
              {error && (
                <div className='px-6 py-4 bg-red-50 border-b border-[#E5E5E5]'>
                  <div className='text-red-700 text-sm'>{error}</div>
                </div>
              )}

              {/* ローディング */}
              {(authLoading || loading) && (
                <div className='px-6 py-8 text-center'>
                  <div className="text-[#666666] font-['Noto_Sans_JP']">
                    読み込み中...
                  </div>
                </div>
              )}

              {/* データなし */}
              {!authLoading && !loading && jobs.length === 0 && !error && (
                <div className='px-6 py-8 text-center'>
                  <div className="text-[#666666] font-['Noto_Sans_JP']">
                    求人が見つかりませんでした
                  </div>
                </div>
              )}

              {/* 求人データ一覧 */}
              {!loading && jobs.length > 0 && (
                <>
                  <div className='flex flex-col gap-y-2'>
                    {displayedJobs.map(job => (
                      <div
                        key={job.id}
                        className='bg-[#FFFFFF] hover:bg-[#E9E9E9] transition-colors flex gap-[24px] py-[20px] px-[24px] rounded-[10px]'
                        style={{ boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}
                      >
                        {/* グループ */}
                        <div className='w-[160px] flex items-center'>
                          <div
                            className='text-white text-[14px] font-bold rounded-[8px] flex items-center justify-center'
                            style={{
                              width: '160px',
                              height: '32px',
                              paddingLeft: '20px',
                              paddingRight: '20px',
                              background:
                                'linear-gradient(90deg, #65BDAC 0%, #86C36A 100%)',
                            }}
                          >
                            {job.groupName || 'ユーザー'}
                          </div>
                        </div>

                        {/* 職種/求人タイトル */}
                        <div className='w-[424px]'>
                          <div className='flex flex-wrap gap-2 mb-2'>
                            {/* 職種を配列から動的に表示 */}
                            {job.jobType && job.jobType.length > 0 ? (
                              job.jobType.map((jobType, index) => (
                                <span
                                  key={index}
                                  className='rounded-[8px] font-medium text-[14px] leading-tight line-clamp-2'
                                  style={{
                                    width: '136px',
                                    minHeight: '32px',
                                    paddingLeft: '16px',
                                    paddingRight: '16px',
                                    paddingTop: '6px',
                                    paddingBottom: '6px',
                                    background: '#D2F1DA',
                                    color: '#0F9058',
                                    wordBreak: 'break-all',
                                    hyphens: 'auto',
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                  }}
                                >
                                  {jobType}
                                </span>
                              ))
                            ) : (
                              <span
                                className='rounded-[8px] flex items-center justify-center font-medium text-[14px]'
                                style={{
                                  width: '136px',
                                  minHeight: '32px',
                                  paddingLeft: '16px',
                                  paddingRight: '16px',
                                  paddingTop: '6px',
                                  paddingBottom: '6px',
                                  background: '#D2F1DA',
                                  color: '#0F9058',
                                }}
                              >
                                職種未設定
                              </span>
                            )}
                          </div>
                          <div
                            className='text-[#323232] font-bold truncate'
                            style={{ fontSize: '16px', lineHeight: '200%' }}
                          >
                            {job.title}
                          </div>
                        </div>

                        {/* ステータス */}
                        <div className='w-[76px] flex items-center justify-center'>
                          {job.status === 'PUBLISHED' ? (
                            <span
                              className='font-bold'
                              style={{ fontSize: '14px', color: '#0F9058' }}
                            >
                              掲載済
                            </span>
                          ) : job.status === 'DRAFT' ? (
                            <span
                              className='font-bold'
                              style={{ fontSize: '14px', color: '#999999' }}
                            >
                              下書き
                            </span>
                          ) : job.status === 'PENDING_APPROVAL' ? (
                            <div
                              className='font-bold text-center leading-tight'
                              style={{ fontSize: '14px', color: '#FF5B5B' }}
                            >
                              <div className='text-center'>掲載待ち</div>
                              <div className='text-center'> (承認待ち)</div>
                            </div>
                          ) : (
                            <span className='bg-[#FEF0F0] text-[#F56C6C] px-3 py-1 rounded text-xs font-medium'>
                              停止
                            </span>
                          )}
                        </div>

                        {/* 公開範囲 */}
                        <div className='w-[107px] flex items-center justify-center'>
                          <div className='flex items-center justify-center w-full h-full'>
                            <span
                              className='font-bold flex items-center justify-center'
                              style={{
                                paddingLeft: '8px',
                                paddingRight: '8px',
                                fontSize: '14px',
                                color: '#fff',
                                background: '#0F9058',
                                borderRadius: '5px',
                                height: '22px',
                                minWidth: '60px',
                                maxWidth: '100%',
                              }}
                            >
                              {job.status === 'CLOSED' ? '公開停止' :
                               job.publicationType === 'public' ? '一般公開' :
                               job.publicationType === 'members' ? '登録会員限定' :
                               job.publicationType === 'scout' ? 'スカウト限定' : '一般公開'}
                            </span>
                          </div>
                        </div>

                        {/* 社内メモ */}
                        <div
                          className='w-[112px] text-[#323232]'
                          style={{
                            fontSize: '14px',
                            maxHeight: '65px',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {job.internalMemo || ''}
                        </div>

                        {/* 公開日 */}
                        <div className='w-[70px] text-[#323232] text-xs flex items-center justify-center text-center'>
                          {job.publishedAt
                            ? new Date(job.publishedAt)
                                .toLocaleDateString('ja-JP', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                })
                                .replace(/\//g, '/')
                            : 'ー'}
                        </div>

                        {/* 最終更新日 */}
                        <div className='w-[76px] text-[#323232] text-xs flex items-center justify-center text-center'>
                          {new Date(job.updatedAt)
                            .toLocaleDateString('ja-JP', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })
                            .replace(/\//g, '/')}
                        </div>

                        {/* アクション */}
                        <div className='col-span-2 flex items-center gap-2 relative'>
                          <button
                            className='text-[#DCDCDC] hover:text-[#323232] rounded-full p-2'
                            onClick={() => setPopupJobId(job.id)}
                          >
                            <MoreHorizontal className='w-10 h-10' />
                          </button>
                          {popupJobId === job.id && (
                            <div
                              ref={popupRef}
                              className='absolute left-0 translate-x-0 top-full mt-[-20px] z-10 bg-white border border-[#E5E5E5] rounded shadow-lg w-[64px] h-[64px] flex flex-col justify-center items-center'
                            >
                              <button
                                className='text-left hover:bg-[#F3FBF7] text-[#222] text-[14px]'
                                style={{
                                  color: '#222',
                                  fontWeight: '500',
                                  width: '48px',
                                  height: '22px',
                                  padding: 0,
                                }}
                                onClick={() => {
                                  handleDuplicateJob(job.id);
                                  setPopupJobId(null);
                                }}
                              >
                                複製
                              </button>
                              <button
                                className='text-left hover:bg-[#FEF0F0] text-[#F56C6C] text-[14px]'
                                style={{
                                  color: '#F56C6C',
                                  fontWeight: '500',
                                  width: '48px',
                                  height: '22px',
                                  padding: 0,
                                  marginTop: '4px',
                                }}
                                onClick={() => {
                                  handleDeleteJob(job.id);
                                  setPopupJobId(null);
                                }}
                              >
                                削除
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* ページネーション */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    className="mt-10"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}