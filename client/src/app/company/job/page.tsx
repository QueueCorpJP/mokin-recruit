'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MoreHorizontal } from 'lucide-react';
import { SelectInput } from '@/components/ui/select-input';
import { BaseInput } from '@/components/ui/base-input';
import { Button } from '@/components/ui/button';
import { getAuthHeaders } from '@/lib/utils/api-client';

// 求人ステータスの型定義
type JobStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'CLOSED';

// 求人データの型定義
interface JobPosting {
  id: string;
  title: string;
  jobType: string;
  industry: string;
  employmentType: string;
  workLocation: string;
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

  // 状態管理
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
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
  const fetchGroups = async () => {
    try {
      const authHeaders = getAuthHeaders();

      if (!authHeaders.Authorization) {
        console.error('認証トークンが見つかりません');
        return;
      }

      const response = await fetch('/api/company/groups', {
        headers: authHeaders,
      });

      const result = await response.json();

      if (result.success) {
        setGroups(result.data || []);
      } else {
        console.error('グループ情報の取得に失敗しました:', result.error);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  // 求人データを取得
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const authHeaders = getAuthHeaders();

      if (!authHeaders.Authorization) {
        setError('認証トークンが見つかりません');
        return;
      }

      const params = new URLSearchParams();
      if (selectedStatus !== 'すべて') params.append('status', selectedStatus);
      if (selectedGroup !== 'すべて') params.append('groupId', selectedGroup);
      if (selectedScope !== 'すべて') params.append('scope', selectedScope);
      if (searchKeyword.trim()) params.append('search', searchKeyword.trim());

      const response = await fetch(`/api/company/job?${params.toString()}`, {
        headers: authHeaders,
      });

      const result = await response.json();

      if (result.success) {
        setJobs(result.data || []);
      } else {
        setError(result.error || '求人情報の取得に失敗しました');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // 初回ロード
  useEffect(() => {
    fetchGroups();
    fetchJobs();
  }, []);

  // フィルター変更時にリロード
  useEffect(() => {
    fetchJobs();
  }, [selectedStatus, selectedGroup, selectedScope]);

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

  // ポップアップの表示状態と対象jobId
  const [popupJobId, setPopupJobId] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

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
                <div className='bg-[#F3FBF7] rounded-[8px] p-4 w-[608px]'>
                  <div className='font-bold text-xs mb-1'>
                    求人の削除について
                  </div>
                  <div className='text-xs'>
                    すでに候補者にスカウトを送信済、もしくは候補者からの応募があった求人は削除することができません。
                  </div>
                </div>
                {/* 右：件数表示＋リンク */}
                <div className='flex flex-col justify-between items-end min-w-[180px] h-[67.98px]'>
                  <div className='flex items-center gap-2'>
                    <button
                      className='text-[#4FC3A1] text-xs px-1 font-bold'
                      aria-label='前のページ'
                    >
                      {'<'}
                    </button>
                    <span className='text-[#666666] text-xs font-bold'>
                      1〜10件 / 1,000件
                    </span>
                    <button
                      className='text-[#4FC3A1] text-xs px-1 font-bold'
                      aria-label='次のページ'
                    >
                      {'>'}
                    </button>
                  </div>
                  <button className='flex items-center gap-1 text-[#999999] text-xs font-bold focus:outline-none'>
                    <span className='w-5 h-5 border border-[#999999] rounded-full flex items-center justify-center text-xs font-bold'>
                      ？
                    </span>
                    <span className='underline'>求人の削除について</span>
                  </button>
                </div>
              </div>
            </div>

            {/* テーブルヘッダー */}
            <div className='rounded-t-lg flex flex-col items-center justify-center'>
              <div className="max-w-[1280px] w-full mx-auto flex gap-[24px] border-b border-[#E5E5E5] text-[#222] text-[14px] font-bold font-['Noto_Sans_JP'] px-[40px] pr-[82px] pb-2">
                <div className='w-[160px]'>グループ</div>
                <div className='w-[424px]'>職種 / 求人タイトル</div>
                <div className='w-[76px]'>ステータス</div>
                <div className='w-[107px]'>公開範囲</div>
                <div className='w-[112px]'>社内メモ</div>
                <div className='w-[70px]'>公開日</div>
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
              {loading && (
                <div className='px-6 py-8 text-center'>
                  <div className="text-[#666666] font-['Noto_Sans_JP']">
                    読み込み中...
                  </div>
                </div>
              )}

              {/* データなし */}
              {!loading && jobs.length === 0 && !error && (
                <div className='px-6 py-8 text-center'>
                  <div className="text-[#666666] font-['Noto_Sans_JP']">
                    求人が見つかりませんでした
                  </div>
                </div>
              )}

              {/* 求人データ一覧 */}
              {!loading && jobs.length > 0 && (
                <>
                  <div className='divide-y divide-[#E5E5E5] flex flex-col gap-y-2'>
                    {displayedJobs.map(job => (
                      <div
                        key={job.id}
                        className='bg-[#FFFFFF] flex gap-[24px] py-[20px] px-[24px] rounded-[10px]'
                        style={{ boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}
                      >
                        {/* グループ */}
                        <div className='w-[160px] flex items-center'>
                          <div
                            className='text-white text-[14px] font-bold rounded flex items-center justify-center'
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
                          <div className='flex flex-wrap gap-1 mb-2'>
                            <span
                              className={`rounded flex items-center justify-center font-bold ${(job.jobType || '').length >= 8 ? 'text-[10px]' : 'text-[14px]'}`}
                              style={{
                                width: '136px',
                                height: '32px',
                                paddingLeft: '16px',
                                paddingRight: '16px',
                                background: '#D2F1DA',
                                color: '#0F9058',
                              }}
                            >
                              {job.jobType || '職種テキスト'}
                            </span>
                            <span
                              className={`rounded flex items-center justify-center font-bold ${(job.industry || '').length >= 8 ? 'text-[10px]' : 'text-[14px]'}`}
                              style={{
                                width: '136px',
                                height: '32px',
                                paddingLeft: '16px',
                                paddingRight: '16px',
                                background: '#D2F1DA',
                                color: '#0F9058',
                              }}
                            >
                              {job.industry || '職種テキスト'}
                            </span>
                            <span
                              className={`rounded flex items-center justify-center font-bold ${(job.workLocation || '').length >= 8 ? 'text-[10px]' : 'text-[14px]'}`}
                              style={{
                                width: '136px',
                                height: '32px',
                                paddingLeft: '16px',
                                paddingRight: '16px',
                                background: '#D2F1DA',
                                color: '#0F9058',
                              }}
                            >
                              {job.workLocation || '職種テキスト'}
                            </span>
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
                            <span
                              className='font-bold whitespace-pre-line text-center'
                              style={{ fontSize: '14px', color: '#FF5B5B' }}
                            >
                              {'掲載待ち\n（承認待ち）'}
                            </span>
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
                                borderRadius: '4px',
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
                            : 'yyyy/mm/dd'}
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
                                  fontWeight: 'normal',
                                  width: '48px',
                                  height: '22px',
                                  padding: 0,
                                }}
                                onClick={() => {
                                  /* 複製処理 */ setPopupJobId(null);
                                }}
                              >
                                複製
                              </button>
                              <button
                                className='text-left hover:bg-[#FEF0F0] text-[#F56C6C] text-[14px]'
                                style={{
                                  color: '#F56C6C',
                                  fontWeight: 'normal',
                                  width: '48px',
                                  height: '22px',
                                  padding: 0,
                                  marginTop: '4px',
                                }}
                                onClick={() => {
                                  /* 削除処理 */ setPopupJobId(null);
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
                  {/* ページネーションUI */}
                  <div className='flex justify-center items-center gap-2 mt-10'>
                    <button
                      className={`w-14 h-14 flex items-center justify-center rounded-full border text-[16px] font-bold mx-2 ${currentPage === 1 ? 'border-[#DCDCDC] text-[#DCDCDC] cursor-not-allowed bg-transparent' : 'border-[#0F9058] text-[#0F9058] hover:bg-[#F3FBF7] bg-transparent'}`}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      {'<'}
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        className={`w-14 h-14 flex items-center justify-center rounded-full border text-[16px] font-bold mx-2 ${currentPage === i + 1 ? 'bg-[#0F9058] text-white border-[#0F9058]' : 'border-[#0F9058] text-[#0F9058] bg-transparent hover:bg-[#F3FBF7]'}`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      className={`w-14 h-14 flex items-center justify-center rounded-full border text-[16px] font-bold mx-2 ${currentPage === totalPages ? 'border-[#DCDCDC] text-[#DCDCDC] cursor-not-allowed bg-transparent' : 'border-[#0F9058] text-[#0F9058] hover:bg-[#F3FBF7] bg-transparent'}`}
                      onClick={() =>
                        setCurrentPage(p => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      {'>'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}