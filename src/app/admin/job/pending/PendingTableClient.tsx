'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
// import { AdminButton } from '@/components/admin/ui/AdminButton';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { SelectInput } from '@/components/ui/select-input';
// import { AdminConfirmModal } from '@/components/admin/ui/AdminConfirmModal';
import { JobApprovalModal } from '@/components/admin/ui/JobApprovalModal';
// import { ArrowIcon } from '@/components/admin/ui/ArrowIcon';

export type PendingJobListItem = {
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
  PENDING_APPROVAL: '承認待ち',
  DRAFT: '下書き',
  PUBLISHED: '掲載済',
  CLOSED: '公開停止',
};

const publicationTypeMap: Record<string, string> = {
  public: '一般公開',
  members: '登録会員限定',
  scout: 'スカウト限定',
};

function formatDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const date = d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
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
  jobs: PendingJobListItem[];
};

export default function PendingTableClient({ jobs: initialJobs }: Props) {
  const router = useRouter();
  const [jobs, setJobs] = useState<PendingJobListItem[]>(initialJobs);
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [statusFilter, _setStatusFilter] = useState<string>('すべて');
  const [publicationFilter, _setPublicationFilter] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<string>('企業名');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [approveModalJobIds, setApproveModalJobIds] = useState<string[] | null>(
    null
  );
  const [rejectModalJobId, _setRejectModalJobId] = useState<string | null>(
    null
  );
  const [isApproving, _setIsApproving] = useState(false);
  const [isRejecting, _setIsRejecting] = useState(false);
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    null
  );

  const searchCategoryOptions = [
    { value: '企業名', label: '企業名' },
    { value: '求人タイトル', label: '求人タイトル' },
    { value: '求人本文', label: '求人本文' },
    { value: '職種', label: '職種' },
    { value: '求人ID', label: '求人ID' },
  ];

  const _handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedJobs(new Set(jobs.map(job => job.id)));
    } else {
      setSelectedJobs(new Set());
    }
  };

  const handleSelectJob = (jobId: string, checked: boolean) => {
    const newSelected = new Set(selectedJobs);
    if (checked) {
      newSelected.add(jobId);
    } else {
      newSelected.delete(jobId);
    }
    setSelectedJobs(newSelected);
  };

  const handleBulkApprove = useCallback(() => {
    if (selectedJobs.size > 0) {
      setApproveModalJobIds(Array.from(selectedJobs));
    }
  }, [selectedJobs]);

  const handleApprove = async (reason: string, comment: string) => {
    if (!approveModalJobIds) return;
    _setIsApproving(true);
    try {
      const { bulkApproveJobs } = await import('./actions');
      const result = await bulkApproveJobs(approveModalJobIds, reason, comment);

      if (!result.success) {
        throw new Error(result.error || '承認に失敗しました');
      }

      setJobs(jobs =>
        jobs.map(job =>
          approveModalJobIds.includes(job.id)
            ? { ...job, status: 'PUBLISHED' }
            : job
        )
      );
      setSelectedJobs(new Set());
      setApproveModalJobIds(null);
    } catch (e: any) {
      alert(e.message || '承認に失敗しました');
    } finally {
      _setIsApproving(false);
    }
  };

  const handleReject = async (reason: string, comment: string) => {
    if (!approveModalJobIds) return;
    _setIsApproving(true);
    try {
      const { bulkRejectJobs } = await import('./actions');
      const result = await bulkRejectJobs(approveModalJobIds, reason, comment);

      if (!result.success) {
        throw new Error(result.error || '却下に失敗しました');
      }

      setJobs(jobs => jobs.filter(job => !approveModalJobIds.includes(job.id)));
      setSelectedJobs(new Set());
      setApproveModalJobIds(null);
    } catch (e: any) {
      alert(e.message || '却下に失敗しました');
    } finally {
      _setIsApproving(false);
    }
  };

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
          return false;
      }
    }
    return true;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    let aValue: string;
    let bValue: string;

    switch (sortColumn) {
      case 'status':
        aValue = statusMap[a.status] || a.status;
        bValue = statusMap[b.status] || b.status;
        break;
      case 'publicPeriod':
        aValue = a.updated_at;
        bValue = b.updated_at;
        break;
      case 'company':
        aValue = a.company_accounts?.company_name || '';
        bValue = b.company_accounts?.company_name || '';
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

  const handleCSVDownload = useCallback(() => {
    const headers = [
      '求人ID',
      '求人タイトル',
      '企業名',
      'ステータス',
      '公開タイプ',
      '職種',
      '更新日時',
    ];

    const csvData = sortedJobs.map(job => {
      const { date, time } = formatDateTime(job.updated_at);
      return [
        job.id,
        `"${job.title.replace(/"/g, '""')}"`,
        `"${(job.company_accounts?.company_name || '不明').replace(/"/g, '""')}"`,
        statusMap[job.status] || job.status,
        publicationTypeMap[job.publication_type] || job.publication_type,
        `"${job.job_type && job.job_type.length > 0 ? job.job_type.join(', ').replace(/"/g, '""') : '未設定'}"`,
        `${date} ${time}`,
      ];
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.toTimeString().slice(0, 5).replace(/:/g, '');
    link.setAttribute('download', `承認待ち求人一覧_${dateStr}_${timeStr}.csv`);

    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [sortedJobs]);

  // AdminPageTitleからのイベントリスナー
  useEffect(() => {
    console.log('PendingTableClient: Setting up event listeners');
    const handlePendingCsvDownload = () => {
      console.log('PendingTableClient: Received pending-csv-download event');
      handleCSVDownload();
    };

    const handlePendingBulkApprove = () => {
      console.log('PendingTableClient: Received pending-bulk-approve event');
      handleBulkApprove();
    };

    window.addEventListener('pending-csv-download', handlePendingCsvDownload);
    window.addEventListener('pending-bulk-approve', handlePendingBulkApprove);

    return () => {
      window.removeEventListener(
        'pending-csv-download',
        handlePendingCsvDownload
      );
      window.removeEventListener(
        'pending-bulk-approve',
        handlePendingBulkApprove
      );
    };
  }, [handleCSVDownload, handleBulkApprove]);

  const columns = [
    {
      key: 'checkbox',
      label: '',
      sortable: false,
      width: 'w-[40px]',
    },
    {
      key: 'status',
      label: '確認状況',
      sortable: true,
      width: 'w-[120px]',
    },
    {
      key: 'publicPeriod',
      label: '掲載申請日時',
      sortable: true,
      width: 'w-[140px]',
    },
    {
      key: 'jobId',
      label: '求人確認',
      sortable: false,
      width: 'w-[120px]',
    },
    {
      key: 'company',
      label: '企業名・お仕事タイトル',
      sortable: true,
      width: 'flex-1',
    },
    {
      key: 'publicStatus',
      label: '公開範囲',
      sortable: false,
      width: 'w-[120px]',
    },
    {
      key: 'actions',
      label: '操作',
      sortable: false,
      width: 'w-[180px]',
    },
  ];

  const approveTargetJobs = approveModalJobIds
    ? jobs.filter(job => approveModalJobIds.includes(job.id))
    : [];

  const _rejectTargetJob = rejectModalJobId
    ? jobs.find(job => job.id === rejectModalJobId)
    : null;

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
      </div>

      <div className='bg-white rounded-lg w-[900px] overflow-x-auto'>
        <div className='w-[1600px]'>
          {/* 統計情報ヘッダー */}
          <div className='flex items-center px-5 py-3 bg-[#F0F8FF] border-b border-[#E5E5E5]'>
            <div className='w-[40px]'></div> {/* checkbox */}
            <div className='w-[120px]'></div> {/* 確認状況 */}
            <div className='w-[140px]'></div> {/* 掲載申請日時 */}
            <div className='w-[120px]'></div> {/* 求人確認 */}
            <div className='flex-1'></div> {/* 企業名・お仕事タイトル */}
            <div className='w-[120px]'></div> {/* 公開範囲 */}
            <div className='w-[180px]'></div> {/* 操作 */}
            <div className='w-[120px] text-center'>
              <span className="font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232] leading-[1.6] tracking-[1.2px]">
                スカウト送信数
              </span>
            </div>
            <div className='w-[100px] text-center'>
              <span className="font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232] leading-[1.6] tracking-[1.2px]">
                開封数
              </span>
            </div>
            <div className='w-[120px] text-center'>
              <span className="font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232] leading-[1.6] tracking-[1.2px]">
                返信数(返信率)
              </span>
            </div>
            <div className='w-[120px] text-center'>
              <span className="font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232] leading-[1.6] tracking-[1.2px]">
                応募数(応募率)
              </span>
            </div>
          </div>

          {/* 統計データ行 */}
          <div className='px-5 py-2 bg-[#FAFAFA] border-b border-[#E5E5E5]'>
            <div className='flex items-center mb-1'>
              <div className='w-[40px]'></div>
              <div className='w-[120px]'></div>
              <div className='w-[140px]'></div>
              <div className='w-[120px]'></div>
              <div className='flex-1'></div>
              <div className='w-[120px]'></div>
              <div className='w-[180px]'></div>
              <div className='w-[120px] text-center'>
                <span className="font-['Noto_Sans_JP'] text-[11px] font-medium text-[#666666]">
                  過去7日合計
                </span>
              </div>
              <div className='w-[100px] text-center'>
                <span className="font-['Noto_Sans_JP'] text-[11px] font-medium text-[#666666]">
                  0
                </span>
              </div>
              <div className='w-[120px] text-center'>
                <span className="font-['Noto_Sans_JP'] text-[11px] font-medium text-[#666666]">
                  0 (0%)
                </span>
              </div>
              <div className='w-[120px] text-center'>
                <span className="font-['Noto_Sans_JP'] text-[11px] font-medium text-[#666666]">
                  0 (0%)
                </span>
              </div>
            </div>

            <div className='flex items-center mb-1'>
              <div className='w-[40px]'></div>
              <div className='w-[120px]'></div>
              <div className='w-[140px]'></div>
              <div className='w-[120px]'></div>
              <div className='flex-1'></div>
              <div className='w-[120px]'></div>
              <div className='w-[180px]'></div>
              <div className='w-[120px] text-center'>
                <span className="font-['Noto_Sans_JP'] text-[11px] font-medium text-[#666666]">
                  過去30日合計
                </span>
              </div>
              <div className='w-[100px] text-center'>
                <span className="font-['Noto_Sans_JP'] text-[11px] font-medium text-[#666666]">
                  0
                </span>
              </div>
              <div className='w-[120px] text-center'>
                <span className="font-['Noto_Sans_JP'] text-[11px] font-medium text-[#666666]">
                  0 (0%)
                </span>
              </div>
              <div className='w-[120px] text-center'>
                <span className="font-['Noto_Sans_JP'] text-[11px] font-medium text-[#666666]">
                  0 (0%)
                </span>
              </div>
            </div>

            <div className='flex items-center'>
              <div className='w-[40px]'></div>
              <div className='w-[120px]'></div>
              <div className='w-[140px]'></div>
              <div className='w-[120px]'></div>
              <div className='flex-1'></div>
              <div className='w-[120px]'></div>
              <div className='w-[180px]'></div>
              <div className='w-[120px] text-center'>
                <span className="font-['Noto_Sans_JP'] text-[11px] font-medium text-[#666666]">
                  累計
                </span>
              </div>
              <div className='w-[100px] text-center'>
                <span className="font-['Noto_Sans_JP'] text-[11px] font-medium text-[#666666]">
                  0
                </span>
              </div>
              <div className='w-[120px] text-center'>
                <span className="font-['Noto_Sans_JP'] text-[11px] font-medium text-[#666666]">
                  0 (0%)
                </span>
              </div>
              <div className='w-[120px] text-center'>
                <span className="font-['Noto_Sans_JP'] text-[11px] font-medium text-[#666666]">
                  0 (0%)
                </span>
              </div>
            </div>
          </div>
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
                          <input
                            type='checkbox'
                            checked={selectedJobs.has(job.id)}
                            onChange={e =>
                              handleSelectJob(job.id, e.target.checked)
                            }
                            className='w-4 h-4 accent-[#0F9058] cursor-pointer'
                          />
                        ),
                        width: 'w-[40px]',
                      },
                      {
                        content: (
                          <span className="inline-block px-3 py-1 rounded-full font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] bg-yellow-500 text-white">
                            承認待ち
                          </span>
                        ),
                        width: 'w-[120px]',
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
                        width: 'w-[140px]',
                      },
                      {
                        content: (
                          <button
                            onClick={() =>
                              router.push(`/admin/job/pending/${job.id}`)
                            }
                            className="inline-block px-3 py-1 rounded-full bg-[#E8F5E8] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] hover:bg-[#D2F1DA] transition-colors cursor-pointer"
                          >
                            求人詳細
                          </button>
                        ),
                        width: 'w-[120px]',
                      },
                      {
                        content: (
                          <div>
                            <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                              {truncateText(
                                job.company_accounts?.company_name || '不明',
                                20
                              )}
                            </div>
                            <div className="font-['Noto_Sans_JP'] text-[12px] text-gray-600">
                              {truncateText(job.title, 30)}
                            </div>
                          </div>
                        ),
                        width: 'flex-1',
                      },
                      {
                        content: (
                          <span className="inline-block px-3 py-1 rounded-full bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px]">
                            {publicationTypeMap[job.publication_type] ||
                              job.publication_type}
                          </span>
                        ),
                        width: 'w-[120px]',
                      },
                      {
                        content: (
                          <div className='flex gap-2'>
                            <ActionButton
                              text='承認'
                              variant='approve'
                              onClick={() => setApproveModalJobIds([job.id])}
                              size='small'
                            />
                          </div>
                        ),
                        width: 'w-[180px]',
                      },
                      // 統計情報カラムを追加
                      {
                        content: (
                          <div className='text-center'>
                            <span className="font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                              0
                            </span>
                          </div>
                        ),
                        width: 'w-[120px]',
                      },
                      {
                        content: (
                          <div className='text-center'>
                            <span className="font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                              0
                            </span>
                          </div>
                        ),
                        width: 'w-[100px]',
                      },
                      {
                        content: (
                          <div className='text-center'>
                            <span className="font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                              0 (0%)
                            </span>
                          </div>
                        ),
                        width: 'w-[120px]',
                      },
                      {
                        content: (
                          <div className='text-center'>
                            <span className="font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                              0 (0%)
                            </span>
                          </div>
                        ),
                        width: 'w-[120px]',
                      },
                    ]}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className='flex justify-center mt-8'>
        <PaginationButtons
          onPrevious={() => {}}
          onNext={() => {}}
          previousDisabled={true}
          nextDisabled={true}
        />
      </div>

      <JobApprovalModal
        isOpen={approveModalJobIds !== null}
        onClose={() => setApproveModalJobIds(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        isProcessing={isApproving}
        jobTitle={
          approveTargetJobs.length > 1
            ? `${approveTargetJobs.length}件の求人`
            : approveTargetJobs[0]?.title || '求人'
        }
      />
    </div>
  );
}
