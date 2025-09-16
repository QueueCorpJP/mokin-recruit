'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BlockedCompanyItem } from './page';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { AdminModal } from '@/components/admin/ui/AdminModal';
import { deleteBlockedCompany, addBlockedCompany } from './actions';

interface Props {
  blockedCompanies: BlockedCompanyItem[];
  candidateId: string;
}

interface CompanyEntry {
  id: string;
  companyName: string;
  createdAt: string;
  recordId: string; // 元のブロック企業レコードID
}

export default function BlockedCompanyClient({
  blockedCompanies,
  candidateId,
}: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const itemsPerPage = 10;

  // ブロック企業データをフラット化（company_namesは配列なので展開）
  const companyEntries: CompanyEntry[] = blockedCompanies.flatMap(item =>
    item.company_names.map((companyName, index) => ({
      id: `${item.id}-${index}`,
      companyName,
      createdAt: item.created_at,
      recordId: item.id,
    }))
  );

  const formatDateTime = useCallback(
    (iso: string): { date: string; time: string } => {
      const d = new Date(iso);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');

      const date = `${year}/${month}/${day}`;
      const time = `${hours}:${minutes}`;
      return { date, time };
    },
    []
  );

  const handleDeleteCompany = useCallback(
    async (companyName: string) => {
      if (isDeleting) return;

      setIsDeleting(companyName);

      try {
        const result = await deleteBlockedCompany(candidateId, companyName);
        if (result.success) {
          router.refresh();
        } else {
          alert(result.error || '削除に失敗しました');
        }
      } catch (error) {
        console.error('Error deleting company:', error);
        alert('削除中にエラーが発生しました');
      } finally {
        setIsDeleting(null);
      }
    },
    [candidateId, isDeleting, router]
  );

  const handleAddNewCompany = useCallback(() => {
    setShowAddModal(true);
    setNewCompanyName('');
  }, []);

  const handleConfirmAdd = useCallback(
    async (inputValue: string) => {
      if (!inputValue.trim()) {
        alert('企業名を入力してください');
        return;
      }

      if (isAdding) return;

      setIsAdding(true);

      try {
        const result = await addBlockedCompany(candidateId, inputValue.trim());
        if (result.success) {
          setShowAddModal(false);
          setNewCompanyName('');
          router.refresh();
        } else {
          alert(result.error || '追加に失敗しました');
        }
      } catch (error) {
        console.error('Error adding company:', error);
        alert('追加中にエラーが発生しました');
      } finally {
        setIsAdding(false);
      }
    },
    [candidateId, isAdding, router]
  );

  const handleCancelAdd = useCallback(() => {
    setShowAddModal(false);
    setNewCompanyName('');
  }, []);

  const handleSort = useCallback(
    (column: string) => {
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
    },
    [sortColumn, sortDirection]
  );

  // ソート処理
  const sortedEntries = [...companyEntries].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    let aValue: string;
    let bValue: string;

    switch (sortColumn) {
      case 'date':
        aValue = a.createdAt;
        bValue = b.createdAt;
        break;
      case 'company':
        aValue = a.companyName;
        bValue = b.companyName;
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

  // ページネーション
  const totalPages = Math.ceil(sortedEntries.length / itemsPerPage);
  const paginatedEntries = sortedEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const _handleCsvDownload = useCallback(() => {
    const headers = ['日付', '時刻', '企業名'];
    const csvData = companyEntries.map(entry => {
      const { date, time } = formatDateTime(entry.createdAt);
      return [date, time, `"${entry.companyName.replace(/"/g, '""')}"`];
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
    link.setAttribute('download', `ブロック企業一覧_${dateStr}_${timeStr}.csv`);

    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [companyEntries, formatDateTime]);

  const columns = [
    {
      key: 'date',
      label: '登録日時',
      sortable: true,
      width: 'w-[140px]',
    },
    {
      key: 'company',
      label: '企業名',
      sortable: true,
      width: 'flex-1',
    },
    {
      key: 'actions',
      label: 'アクション',
      sortable: false,
      width: 'w-[120px]',
    },
  ];

  return (
    <div className='bg-gray-50 flex flex-col overflow-x-hidden min-h-screen'>
      {/* 新規追加モーダル */}
      <AdminModal
        isOpen={showAddModal}
        onClose={handleCancelAdd}
        onConfirm={handleConfirmAdd}
        title='ブロック企業を追加'
        description='ブロックする企業名を入力してください'
        inputValue={newCompanyName}
        onInputChange={setNewCompanyName}
        confirmText={isAdding ? '追加中...' : '追加'}
        cancelText='キャンセル'
        placeholder='企業名を入力'
      />

      <div className='mb-6 flex justify-end items-center max-w-full px-6 pt-6'>
        <AdminButton
          text='新規追加'
          onClick={handleAddNewCompany}
          variant='green-outline'
        />
      </div>

      {/* テーブル */}
      <div className='px-6'>
        <div className='bg-white rounded-lg w-full overflow-x-auto'>
          <div className='min-w-[800px]'>
            <MediaTableHeader
              columns={columns}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <div className='p-2'>
              <div className='space-y-2'>
                {paginatedEntries.length > 0 ? (
                  paginatedEntries.map(entry => {
                    const { date, time } = formatDateTime(entry.createdAt);
                    return (
                      <AdminTableRow
                        key={entry.id}
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
                            content: entry.companyName,
                            width: 'flex-1',
                          },
                          {
                            content: (
                              <div className='flex gap-2'>
                                <ActionButton
                                  text={
                                    isDeleting === entry.companyName
                                      ? '削除中...'
                                      : '削除'
                                  }
                                  variant='delete'
                                  onClick={e => {
                                    e?.stopPropagation();
                                    handleDeleteCompany(entry.companyName);
                                  }}
                                  size='small'
                                  disabled={isDeleting === entry.companyName}
                                />
                              </div>
                            ),
                            width: 'w-[120px]',
                          },
                        ]}
                      />
                    );
                  })
                ) : (
                  <div className='py-20 text-center text-gray-500'>
                    <p className='text-lg'>ブロックされた企業がありません</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ページネーション */}
        <div className='flex justify-center mt-8'>
          <PaginationButtons
            onPrevious={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            onNext={() =>
              setCurrentPage(prev => Math.min(prev + 1, totalPages))
            }
            previousDisabled={currentPage === 1}
            nextDisabled={currentPage === totalPages || totalPages === 0}
          />
        </div>
      </div>
    </div>
  );
}
