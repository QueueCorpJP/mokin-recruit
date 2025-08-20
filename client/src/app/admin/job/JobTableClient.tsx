'use client';
import React, { useState } from 'react';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { SearchBar } from '@/components/admin/ui/SearchBar';
import { ArrowIcon } from '@/components/admin/ui/ArrowIcon';
import { Checkbox } from '@/components/admin/ui/checkbox';

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

type Props = {
  jobs: AdminJobListItem[];
};

export default function JobTableClient({ jobs: initialJobs }: Props) {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [jobs, setJobs] = useState<AdminJobListItem[]>(initialJobs);
  const [approveModalJobId, setApproveModalJobId] = useState<string | null>(
    null
  );
  const [isApproving, setIsApproving] = useState(false);
  const [approveError, setApproveError] = useState<string | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedJobs(jobs.map(j => j.id));
    } else {
      setSelectedJobs([]);
    }
  };

  const handleSelectJob = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedJobs([...selectedJobs, id]);
    } else {
      setSelectedJobs(selectedJobs.filter(jId => jId !== id));
    }
  };

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
    { key: 'checkbox', label: '', sortable: false, width: 'w-[50px]' },
    {
      key: 'updateDate',
      label: '更新日時',
      sortable: true,
      width: 'w-[150px]',
    },
    { key: 'status', label: 'ステータス', sortable: true, width: 'w-[120px]' },
    {
      key: 'publicPeriod',
      label: '公開期間',
      sortable: true,
      width: 'w-[120px]',
    },
    { key: 'company', label: '企業名', sortable: true, width: 'w-[200px]' },
    { key: 'position', label: '職種', sortable: true, width: 'w-[150px]' },
    { key: 'jobId', label: '求人ID', sortable: true, width: 'w-[180px]' },
    { key: 'title', label: '求人タイトル', sortable: true, width: 'flex-1' },
    {
      key: 'actions',
      label: 'アクション',
      sortable: false,
      width: 'w-[250px]',
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mb-6 flex justify-between items-center'>
        <SearchBar
          value={''}
          onChange={() => {}}
          placeholder='企業名・求人タイトル・職種で検索'
          onSearch={() => {}}
          onFilter={() => {}}
        />
        <AdminButton href='/admin/job/new' text='新規求人作成' />
      </div>
      {/* 求人一覧テーブル */}
      <div className='bg-white rounded-lg overflow-x-auto'>
        <div className='flex items-center px-5 py-3 bg-[#F8F8F8] border-b border-[#E5E5E5]'>
          <div className='w-[50px] px-3'>
            <Checkbox
              checked={selectedJobs.length === jobs.length && jobs.length > 0}
              onCheckedChange={handleSelectAll}
            />
          </div>
          {columns.slice(1).map(column => (
            <div
              key={column.key}
              className={`${column.width || 'flex-1'} px-3 ${column.sortable ? 'cursor-pointer select-none' : ''}`}
            >
              <div className='flex items-center gap-2'>
                <span className="font-['Noto_Sans_JP'] text-[14px] font-bold text-[#323232] leading-[1.6] tracking-[1.4px]">
                  {column.label}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className='mt-2 space-y-2'>
          {jobs.map(job => {
            const { date, time } = formatDateTime(job.updated_at);
            return (
              <AdminTableRow
                key={job.id}
                columns={[
                  {
                    content: (
                      <Checkbox
                        checked={selectedJobs.includes(job.id)}
                        onCheckedChange={checked =>
                          handleSelectJob(job.id, checked as boolean)
                        }
                      />
                    ),
                    width: 'w-[50px]',
                  },
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
                    width: 'w-[150px]',
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
                    content: job.company_accounts?.company_name || '不明',
                    width: 'w-[200px]',
                  },
                  {
                    content:
                      job.job_type && job.job_type.length > 0
                        ? job.job_type.join(', ')
                        : '未設定',
                    width: 'w-[150px]',
                  },
                  {
                    content: (
                      <div>
                        <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                          {job.id}
                        </div>
                      </div>
                    ),
                    width: 'w-[180px]',
                  },
                  {
                    content: job.title,
                    width: 'flex-1',
                  },
                ]}
                actions={[
                  ...(job.status === 'PENDING_APPROVAL'
                    ? [
                        <ActionButton
                          key='approve'
                          text='承認'
                          variant='approve'
                          onClick={() => openApproveModal(job.id)}
                          size='small'
                        />,
                      ]
                    : []),
                  <ActionButton
                    key='edit'
                    text='編集'
                    variant='edit'
                    onClick={() => {}}
                    size='small'
                  />,
                  <ActionButton
                    key='delete'
                    text='削除'
                    variant='delete'
                    onClick={() => {}}
                    size='small'
                  />,
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
