'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MoreHorizontal } from 'lucide-react';
import { SelectInput } from '@/components/ui/select-input';
import { BaseInput } from '@/components/ui/base-input';
import { Button } from '@/components/ui/button';

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

  const statusTabs = ['すべて', '下書き', '掲載待ち（承認待ち）', '掲載済'];

  // グループ選択肢の定義
  const groupOptions = [
    { value: 'すべて', label: 'すべて' },
    { value: 'グループA', label: 'グループA' },
    { value: 'グループB', label: 'グループB' },
    { value: 'グループC', label: 'グループC' },
    { value: 'グループD', label: 'グループD' },
  ];

  // 求人データを取得
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const token =
        localStorage.getItem('auth-token') ||
        localStorage.getItem('auth_token') ||
        localStorage.getItem('supabase-auth-token');

      if (!token) {
        setError('認証トークンが見つかりません');
        return;
      }

      const params = new URLSearchParams();
      if (selectedStatus !== 'すべて') params.append('status', selectedStatus);
      if (selectedGroup !== 'すべて') params.append('groupId', selectedGroup);
      if (selectedScope !== 'すべて') params.append('scope', selectedScope);
      if (searchKeyword.trim()) params.append('search', searchKeyword.trim());

      const response = await fetch(`/api/company/job?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
                        className={`py-[4px] px-[16px] text-[12px] font-['Noto_Sans_JP'] transition-colors whitespace-nowrap font-bold tracking-[1.4px] leading-[24px] ${
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
                        className={`py-[4px] px-[16px] text-[12px] font-['Noto_Sans_JP'] transition-colors whitespace-nowrap font-bold tracking-[1.4px] leading-[24px] ${
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
                      className='whitespace-nowrap px-6 py-2 rounded-[8px]'
                    >
                      検索
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full px-[80px] py-[40px]'>
          {/* 新規求人作成ボタン */}
          <div className='flex justify-between items-center mb-6'>
            <button
              onClick={handleNewJob}
              className="bg-[#5BA8D4] hover:bg-[#4A96C2] text-white px-8 py-3 rounded-[25px] font-medium text-base font-['Noto_Sans_JP'] transition-colors"
            >
              新規求人作成
            </button>

            {/* 求人の期間について（右側） */}
            <div className='flex items-center gap-2 text-[#666666] text-sm'>
              <span>1〜10件 / 1,000件</span>
              <button className='text-[#4FC3A1] flex items-center gap-1'>
                <span className='w-4 h-4 border border-[#4FC3A1] rounded-full flex items-center justify-center text-xs'>
                  ?
                </span>
                求人の期間について
              </button>
            </div>
          </div>

          {/* テーブルヘッダー */}
          <div className='bg-white rounded-t-lg flex flex-col items-center justify-center py-[40px]'>
            <div className="grid grid-cols-12 gap-4  border-b border-[#E5E5E5] text-[#666666] text-sm font-medium font-['Noto_Sans_JP']">
              <div className='col-span-1'>グループ</div>
              <div className='col-span-3'>職種 / 求人タイトル</div>
              <div className='col-span-1'>ステータス</div>
              <div className='col-span-1'>公開期間</div>
              <div className='col-span-2'>社内メモ</div>
              <div className='col-span-1'>公開日</div>
              <div className='col-span-1'>最終更新日</div>
              <div className='col-span-2'></div>
            </div>

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
              <div className='divide-y divide-[#E5E5E5] py-[20px] px-[40px]'>
                {jobs.map(job => (
                  <div
                    key={job.id}
                    className='grid grid-cols-12 gap-[24px] hover:bg-[#F8F9FA] transition-colors'
                  >
                    {/* グループ */}
                    <div className='col-span-1 flex items-center'>
                      <div className='bg-[#4FC3A1] text-white px-3 py-1 rounded text-xs font-medium'>
                        {job.groupName || 'グループ名テスト'}
                      </div>
                    </div>

                    {/* 職種/求人タイトル */}
                    <div className='col-span-3'>
                      <div className='flex flex-wrap gap-1 mb-2'>
                        <span className='bg-[#E8F5E8] text-[#4FC3A1] px-2 py-1 rounded text-xs'>
                          {job.jobType || '職種テキスト'}
                        </span>
                        <span className='bg-[#E8F5E8] text-[#4FC3A1] px-2 py-1 rounded text-xs'>
                          {job.industry || '職種テキスト'}
                        </span>
                        <span className='bg-[#E8F5E8] text-[#4FC3A1] px-2 py-1 rounded text-xs'>
                          {job.workLocation || '職種テキスト'}
                        </span>
                      </div>
                      <div className='text-[#323232] text-sm font-medium line-clamp-2'>
                        {job.title}
                      </div>
                    </div>

                    {/* ステータス */}
                    <div className='col-span-1 flex items-center'>
                      {job.status === 'PUBLISHED' ? (
                        <span className='bg-[#E8F5E8] text-[#4FC3A1] px-3 py-1 rounded text-xs font-medium'>
                          掲載済
                        </span>
                      ) : job.status === 'DRAFT' ? (
                        <span className='bg-[#F5F5F5] text-[#666666] px-3 py-1 rounded text-xs font-medium'>
                          下書き
                        </span>
                      ) : job.status === 'PENDING_APPROVAL' ? (
                        <span className='bg-[#FFF8E7] text-[#E6A23C] px-3 py-1 rounded text-xs font-medium'>
                          掲載待ち（承認待ち）
                        </span>
                      ) : (
                        <span className='bg-[#FEF0F0] text-[#F56C6C] px-3 py-1 rounded text-xs font-medium'>
                          停止
                        </span>
                      )}
                    </div>

                    {/* 公開期間 */}
                    <div className='col-span-1 text-[#323232] text-xs'>
                      1〜10件 / 1,000件
                    </div>

                    {/* 社内メモ */}
                    <div className='col-span-2 text-[#323232] text-xs'>
                      テストが入ります。テストが入ります。...
                    </div>

                    {/* 公開日 */}
                    <div className='col-span-1 text-[#323232] text-xs'>
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
                    <div className='col-span-1 text-[#323232] text-xs'>
                      {new Date(job.updatedAt)
                        .toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })
                        .replace(/\//g, '/')}
                    </div>

                    {/* アクション */}
                    <div className='col-span-2 flex items-center gap-2'>
                      <button
                        onClick={() => handleViewJob(job.id)}
                        className='text-[#0F9058] text-xs hover:underline'
                      >
                        複製
                      </button>
                      <button
                        onClick={() => handleEditJob(job.id)}
                        className='text-[#0F9058] text-xs hover:underline'
                      >
                        削除
                      </button>
                      <button className='text-[#666666] hover:text-[#323232]'>
                        <MoreHorizontal className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* テーブル下部の追加情報 */}
          <div className='bg-white rounded-b-lg px-6 py-4 border-t border-[#E5E5E5]'>
            <div className='text-[#666666] text-xs'>
              すでに条件を入力済みしてスカウト送信済。もしくは検索能力からの応募があった求人は削除することができません。
            </div>
            <div className='mt-2 flex items-center gap-1'>
              <span className='w-4 h-4 border border-[#0F9058] rounded-full flex items-center justify-center text-xs text-[#0F9058]'>
                ?
              </span>
              <span className='text-[#0F9058] text-xs'>求人の削除について</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
