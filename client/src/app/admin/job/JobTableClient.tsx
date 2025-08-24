'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { SearchBar } from '@/components/admin/ui/SearchBar';
import { SelectInput } from '@/components/ui/select-input';

export type AdminJobListItem = {
  id: string;
  updated_at: string;
  status: string;
  publication_type: string;
  company_accounts: {
    company_name: string;
  } | null;
  job_type: string[] | null;
  title: string;
};

const statusMap: Record<string, string> = {
  DRAFT: '下書き',
  PENDING_APPROVAL: '承認待ち',
  PUBLISHED: '掲載済',
  CLOSED: '公開停止',
};

const publicationTypeMap: Record<string, string> = {
  public: '一般公開',
  members: '登録会員限定',
  scout: 'スカウト限定',
  CLOSED: '公開停止',
};

function formatDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const date = d
    .toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, '/');
  const time = d.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return { date, time };
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

type Props = {
  jobs: AdminJobListItem[];
};

export default function JobTableClient({ jobs: initialJobs }: Props) {
  const router = useRouter();
  const [jobs, setJobs] = useState<AdminJobListItem[]>(initialJobs);
  const [approveModalJobId, setApproveModalJobId] = useState<string | null>(
    null
  );
  const [isApproving, setIsApproving] = useState(false);
  const [approveError, setApproveError] = useState<string | null>(null);
  const [searchCategory, setSearchCategory] = useState<string>('企業名');

  const searchCategoryOptions = [
    { value: '企業名', label: '企業名' },
    { value: '求人タイトル', label: '求人タイトル' },
    { value: '求人本文', label: '求人本文' },
    { value: '職種', label: '職種' },
    { value: '求人ID', label: '求人ID' }
  ];

  // 承認モーダルを開く
  const openApproveModal = (jobId: string) => {
    setApproveModalJobId(jobId);
    setApproveError(null);
  };
  // 承認モーダルを閉じる
  const closeApproveModal = () => {
    setApproveModalJobId(null);
    setApproveError(null);
  };

  // 編集ページに遷移
  const handleEditJob = (jobId: string) => {
    router.push(`/admin/job/${jobId}/edit`);
  };

  // 承認処理（API仮実装）
  const handleApprove = async () => {
    if (!approveModalJobId) return;
    setIsApproving(true);
    setApproveError(null);
    try {
      // APIリクエスト: PATCH /api/admin/job/approve
      const res = await fetch('/api/admin/job/approve', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: approveModalJobId }),
      });
      if (!res.ok) {
        throw new Error('承認に失敗しました');
      }
      // 成功時はローカルjobs状態を更新
      setJobs(jobs =>
        jobs.map(job =>
          job.id === approveModalJobId ? { ...job, status: 'PUBLISHED' } : job
        )
      );
      closeApproveModal();
    } catch (e: any) {
      setApproveError(e.message || '承認に失敗しました');
    } finally {
      setIsApproving(false);
    }
  };

  const columns = [
    {
      key: 'updateDate',
      label: '更新日時',
      sortable: true,
      width: 'w-[140px]',
    },
    { key: 'status', label: 'ステータス', sortable: true, width: 'w-[120px]' },
    {
      key: 'publicPeriod',
      label: '公開期間',
      sortable: true,
      width: 'w-[120px]',
    },
    { key: 'company', label: '企業名', sortable: true, width: 'w-[110px]' },
    { key: 'position', label: '職種', sortable: true, width: 'w-[100px]' },
    { key: 'jobId', label: '求人ID', sortable: true, width: 'w-[140px]' },
    { key: 'title', label: '求人タイトル', sortable: true, width: 'flex-1' },
    {
      key: 'actions',
      label: 'アクション',
      sortable: false,
      width: 'w-[200px]',
    },
  ];

  return (
    <div className='h-screen bg-gray-50 flex flex-col'>
      <div className='mb-6 flex items-center gap-8'>
        <div className='flex gap-4 items-center'>
          <SelectInput
            options={searchCategoryOptions}
            value={searchCategory}
            onChange={setSearchCategory}
            className="h-10 w-[193px]"
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: 2,
              letterSpacing: '1.6px'
            }}
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder='企業名・求人タイトル・職種で検索'
              className="bg-[#ffffff] box-border flex flex-row gap-2.5 items-center justify-start px-[11px] py-1 rounded-[5px] border border-[#999999] border-solid h-10 w-[289px]"
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: 2,
                letterSpacing: '1.6px',
                color: '#999999'
              }}
            />
            <button 
              className="bg-[#0F9058] hover:bg-[#0D7A4A] transition-colors box-border flex flex-row gap-2 items-center justify-center px-6 py-2 rounded-[32px]"
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                lineHeight: 1.6,
                letterSpacing: '1.4px',
                color: '#ffffff'
              }}
            >
              検索
            </button>
          </div>
        </div>
        <AdminButton href='#' text='CSVダウンロード' onClick={() => {}} />
      </div>
      {/* 求人一覧テーブル */}
      <div className='bg-white rounded-lg flex-1 flex flex-col overflow-hidden'>
        <MediaTableHeader
          columns={columns}
          sortColumn={''}
          sortDirection={null}
          onSort={() => {}}
        />
        <div className='flex-1 overflow-y-auto p-2 space-y-2'>
          {jobs.map(job => {
            const { date, time } = formatDateTime(job.updated_at);
            return (
              <AdminTableRow
                key={job.id}
                columns={[
                  {
                    content: (
                      <div>
                        <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                          {date}
                        </div>
                        <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                          {time}
                        </div>
                      </div>
                    ),
                    width: 'w-[140px]',
                  },
                  {
                    content: (
                      <span className="inline-block px-3 py-1 rounded-[5px] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] bg-gray-500 text-white">
                        {statusMap[job.status] || job.status}
                      </span>
                    ),
                    width: 'w-[120px]',
                  },
                  {
                    content: (
                      <span className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px]">
                        {publicationTypeMap[job.publication_type] ||
                          job.publication_type}
                      </span>
                    ),
                    width: 'w-[120px]',
                  },
                  {
                    content: truncateText(job.company_accounts?.company_name || '不明', 10),
                    width: 'w-[110px]',
                  },
                  {
                    content: truncateText(
                      job.job_type && job.job_type.length > 0
                        ? job.job_type.join(', ')
                        : '未設定',
                      8
                    ),
                    width: 'w-[100px]',
                  },
                  {
                    content: (
                      <div>
                        <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                          {truncateText(job.id, 14)}
                        </div>
                      </div>
                    ),
                    width: 'w-[140px]',
                  },
                  {
                    content: truncateText(job.title, 7),
                    width: 'flex-1',
                  },
                  {
                    content: (
                      <div className="flex gap-2">
                        {job.status === 'PENDING_APPROVAL' && (
                          <ActionButton
                            text='承認'
                            variant='approve'
                            onClick={() => openApproveModal(job.id)}
                            size='small'
                          />
                        )}
                        <ActionButton
                          text='編集'
                          variant='edit'
                          onClick={() => handleEditJob(job.id)}
                          size='small'
                        />
                        <ActionButton
                          text='削除'
                          variant='delete'
                          onClick={() => {}}
                          size='small'
                        />
                      </div>
                    ),
                    width: 'w-[200px]',
                  },
                ]}
              />
            );
          })}
        </div>
      </div>
      {/* 承認モーダル */}
      {approveModalJobId && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
          <div className='bg-white rounded-lg p-8 min-w-[320px] max-w-[90vw] shadow-lg'>
            <div className='mb-4 text-lg font-bold'>
              この求人を承認しますか？
            </div>
            {approveError && (
              <div className='mb-2 text-red-600 text-sm'>{approveError}</div>
            )}
            <div className='flex gap-4 mt-6 justify-end'>
              <button
                className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
                onClick={closeApproveModal}
                disabled={isApproving}
              >
                キャンセル
              </button>
              <button
                className='px-4 py-2 bg-[#0F9058] text-white rounded hover:bg-[#0D7A4A] disabled:opacity-60'
                onClick={handleApprove}
                disabled={isApproving}
              >
                {isApproving ? '承認中...' : '承認する'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ページネーション（現状はダミー） */}
      <div className='flex justify-center mt-8'>
        <PaginationButtons
          onPrevious={() => {}}
          onNext={() => {}}
          previousDisabled={true}
          nextDisabled={true}
        />
      </div>
    </div>
  );
}
