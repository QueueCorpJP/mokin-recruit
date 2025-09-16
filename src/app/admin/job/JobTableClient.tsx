'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { ActionButton } from '@/components/admin/ui/ActionButton';
// import { SearchBar } from '@/components/admin/ui/SearchBar';
import { SelectInput } from '@/components/ui/select-input';
import { AdminConfirmModal } from '@/components/admin/ui/AdminConfirmModal';
// import { ArrowIcon } from '@/components/admin/ui/ArrowIcon';

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
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  const date = `${year}/${month}/${day}`;
  const time = `${hours}:${minutes}`;
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
  const [searchCategory, setSearchCategory] = useState<string>('企業名');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteModalJobId, setDeleteModalJobId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    null
  );

  // 削除対象の求人を取得
  const deleteTargetJob = deleteModalJobId
    ? jobs.find(job => job.id === deleteModalJobId)
    : null;

  const searchCategoryOptions = [
    { value: '企業名', label: '企業名' },
    { value: '求人タイトル', label: '求人タイトル' },
    { value: '求人本文', label: '求人本文' },
    { value: '職種', label: '職種' },
    { value: '求人ID', label: '求人ID' },
  ];

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn('');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // 編集ページに遷移
  const handleEditJob = (jobId: string, e?: React.MouseEvent) => {
    e?.stopPropagation(); // 念のため追加のイベント伝播防止
    router.push(`/admin/job/${jobId}/edit`);
  };

  // 削除処理
  const handleDeleteJob = async (jobId: string) => {
    setIsDeleting(true);
    try {
      const { deleteJob } = await import('./pending/actions');
      const result = await deleteJob(jobId);

      if (!result.success) {
        throw new Error(result.error || '削除に失敗しました');
      }

      // 成功時はローカルjobs状態からも削除
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      setDeleteModalJobId(null);
    } catch (error) {
      console.error('Delete error:', error);
      alert('削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  // CSVダウンロード処理
  const handleCSVDownload = () => {
    // CSVヘッダー
    const headers = [
      '更新日時',
      'ステータス',
      '公開範囲',
      '企業名',
      '職種',
      '求人ID',
      '求人タイトル',
      '求人URL',
    ];

    // CSVデータを作成
    const csvData = jobs.map(job => {
      const { date, time } = formatDateTime(job.updated_at);
      const jobUrl = `${window.location.origin}/admin/job/${job.id}`;
      return [
        `${date} ${time}`,
        statusMap[job.status] || job.status,
        publicationTypeMap[job.publication_type] || job.publication_type,
        `"${(job.company_accounts?.company_name || '不明').replace(/"/g, '""')}"`,
        `"${job.job_type && job.job_type.length > 0 ? job.job_type.join(', ').replace(/"/g, '""') : '未設定'}"`,
        job.id,
        `"${job.title.replace(/"/g, '""')}"`, // ダブルクォートをエスケープ
        jobUrl,
      ];
    });

    // CSVファイルを生成
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    // BOM付きCSVを作成（Excel対応）
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    // ダウンロード実行
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);

    // ファイル名に現在日時を含める
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.toTimeString().slice(0, 5).replace(/:/g, '');
    link.setAttribute('download', `求人一覧_${dateStr}_${timeStr}.csv`);

    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredJobs = jobs.filter(job => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      switch (searchCategory) {
        case '企業名':
          return job.company_accounts?.company_name
            ?.toLowerCase()
            .includes(searchLower);
        case '求人タイトル':
          return job.title.toLowerCase().includes(searchLower);
        case '職種':
          return job.job_type?.some(type =>
            type.toLowerCase().includes(searchLower)
          );
        case '求人ID':
          return job.id.toLowerCase().includes(searchLower);
        default:
          return false; // セレクトで選択されていない場合は何も表示しない
      }
    }
    return true;
  });

  // ソート処理
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    let aValue: string;
    let bValue: string;

    switch (sortColumn) {
      case 'updateDate':
        aValue = a.updated_at;
        bValue = b.updated_at;
        break;
      case 'status':
        aValue = statusMap[a.status] || a.status;
        bValue = statusMap[b.status] || b.status;
        break;
      case 'publicPeriod':
        aValue = publicationTypeMap[a.publication_type] || a.publication_type;
        bValue = publicationTypeMap[b.publication_type] || b.publication_type;
        break;
      case 'company':
        aValue = a.company_accounts?.company_name || '';
        bValue = b.company_accounts?.company_name || '';
        break;
      case 'title':
        aValue = a.title;
        bValue = b.title;
        break;
      case 'position':
        aValue =
          a.job_type && a.job_type.length > 0 ? a.job_type.join(', ') : '';
        bValue =
          b.job_type && b.job_type.length > 0 ? b.job_type.join(', ') : '';
        break;
      case 'jobId':
        aValue = a.id;
        bValue = b.id;
        break;
      case 'publicStatus':
        aValue = publicationTypeMap[a.publication_type] || a.publication_type;
        bValue = publicationTypeMap[b.publication_type] || b.publication_type;
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue, 'ja');
    } else {
      return bValue.localeCompare(aValue, 'ja');
    }
  });

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
    { key: 'company', label: '企業名', sortable: true, width: 'w-[100px]' },
    { key: 'position', label: '職種', sortable: true, width: 'w-[150px]' },
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
    <div className='bg-gray-50 flex flex-col overflow-x-hidden'>
      <div className='mb-6 flex flex-wrap items-center gap-4 max-w-full'>
        <div className='flex gap-2 items-center flex-shrink-0'>
          <SelectInput
            options={searchCategoryOptions}
            value={searchCategory}
            onChange={setSearchCategory}
            className='h-10 w-[150px]'
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: 2,
              letterSpacing: '1.6px',
            }}
          />
          <div className='flex items-center gap-2'>
            <input
              type='text'
              placeholder='企業名・求人タイトル・職種で検索'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='bg-[#ffffff] box-border flex flex-row gap-2.5 items-center justify-start px-[11px] py-1 rounded-[5px] border border-[#999999] border-solid h-10 w-[200px]'
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: 2,
                letterSpacing: '1.6px',
                color: '#999999',
              }}
            />
            <button
              className='bg-[#0F9058] hover:bg-[#0D7A4A] transition-colors box-border flex flex-row gap-2 items-center justify-center px-4 py-2 rounded-[32px] whitespace-nowrap'
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                lineHeight: 1.6,
                letterSpacing: '1.4px',
                color: '#ffffff',
              }}
            >
              検索
            </button>
          </div>
        </div>
        <AdminButton text='CSVダウンロード' onClick={handleCSVDownload} />
      </div>
      {/* 求人一覧テーブル */}
      <div className='bg-white rounded-lg w-[900px] overflow-x-auto'>
        <div className='w-[1200px]'>
          <MediaTableHeader
            columns={columns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <div className='p-2'>
            <div className='space-y-2'>
              {sortedJobs.map(job => {
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
                        content: truncateText(
                          job.company_accounts?.company_name || '不明',
                          3
                        ),
                        width: 'w-[100px]',
                      },
                      {
                        content: (
                          <div className='flex flex-wrap gap-1'>
                            {job.job_type && job.job_type.length > 0 ? (
                              job.job_type.slice(0, 2).map((type, index) => (
                                <span
                                  key={index}
                                  className="inline-block px-2 py-0.5 rounded-full bg-[#E5E5E5] text-[#323232] font-['Noto_Sans_JP'] text-[12px] font-medium leading-[1.4] tracking-[1.2px] whitespace-nowrap"
                                >
                                  {truncateText(type, 6)}
                                </span>
                              ))
                            ) : (
                              <span className="inline-block px-2 py-0.5 rounded-full bg-[#E5E5E5] text-[#999999] font-['Noto_Sans_JP'] text-[12px] font-medium leading-[1.4] tracking-[1.2px]">
                                未設定
                              </span>
                            )}
                            {job.job_type && job.job_type.length > 2 && (
                              <span className="inline-block px-2 py-0.5 rounded-full bg-[#E5E5E5] text-[#323232] font-['Noto_Sans_JP'] text-[12px] font-medium leading-[1.4] tracking-[1.2px]">
                                +{job.job_type.length - 2}
                              </span>
                            )}
                          </div>
                        ),
                        width: 'w-[150px]',
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
                        content: truncateText(job.title, 20),
                        width: 'flex-1',
                      },
                      {
                        content: (
                          <div className='flex gap-2'>
                            <ActionButton
                              text='編集'
                              variant='edit'
                              onClick={e => handleEditJob(job.id, e)}
                              size='small'
                            />
                            <ActionButton
                              text='削除'
                              variant='delete'
                              onClick={e => {
                                e?.stopPropagation();
                                setDeleteModalJobId(job.id);
                              }}
                              size='small'
                            />
                          </div>
                        ),
                        width: 'w-[200px]',
                      },
                    ]}
                    onClick={() => router.push(`/admin/job/${job.id}`)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* ページネーション（現状はダミー） */}
      <div className='flex justify-center mt-8'>
        <PaginationButtons
          onPrevious={() => {}}
          onNext={() => {}}
          previousDisabled={true}
          nextDisabled={true}
        />
      </div>

      {/* 削除確認モーダル */}
      <AdminConfirmModal
        isOpen={deleteModalJobId !== null}
        onClose={() => setDeleteModalJobId(null)}
        onConfirm={() => deleteTargetJob && handleDeleteJob(deleteTargetJob.id)}
        title='求人削除'
        description={deleteTargetJob ? deleteTargetJob.title : '求人'}
        confirmText={isDeleting ? '削除中...' : '削除する'}
        cancelText='キャンセル'
      />
    </div>
  );
}
