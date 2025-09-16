'use client';
import { useState } from 'react';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { ArrowIcon } from '@/components/admin/ui/ArrowIcon';
import { AdminConfirmModal } from '@/components/admin/ui/AdminConfirmModal';
import { AdminNotificationModal } from '@/components/admin/ui/AdminNotificationModal';
import { deleteNotice } from './actions';

interface Notice {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  created_at?: string;
  updated_at?: string;
  category?: {
    name: string;
  };
  categories?: {
    name: string;
  }[];
}

export interface AdminNoticeListItem {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  published_at?: string;
  created_at: string;
  updated_at: string;
  views_count: number;
}

interface NoticePageClientProps {
  notices: Notice[];
}

export default function NoticePageClient({
  notices: initialNotices,
}: NoticePageClientProps) {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);
  const [deletedNoticeTitle, setDeletedNoticeTitle] = useState('');
  const itemsPerPage = 10;

  const getStatusBadge = (status: Notice['status']) => {
    const statusText = getStatusText(status);
    const statusClass =
      status === 'PUBLISHED'
        ? 'bg-[#D2F1DA] text-[#0F9058]'
        : 'bg-gray-100 text-gray-600';
    return (
      <span
        className={`inline-block px-3 py-1 rounded-[5px] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] ${statusClass}`}
      >
        {statusText}
      </span>
    );
  };

  const getStatusText = (status: Notice['status']) => {
    switch (status) {
      case 'PUBLISHED':
        return '公開中';
      case 'DRAFT':
        return '下書き';
      case 'ARCHIVED':
        return 'アーカイブ';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return { date: '未設定', time: '' };
    const date = new Date(dateString);
    const dateStr = date
      .toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    const timeStr = date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return { date: dateStr, time: timeStr };
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

  const handleNewNotice = () => {
    window.location.href = '/admin/notice/new';
  };

  const handleEdit = (notice: Notice) => {
    window.location.href = `/admin/notice/edit?id=${notice.id}`;
  };

  const handleRowClick = (notice: Notice) => {
    window.location.href = `/admin/notice/${notice.id}`;
  };

  const handleDelete = (notice: Notice) => {
    setNoticeToDelete(notice);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (noticeToDelete) {
      try {
        const result = await deleteNotice(noticeToDelete.id);
        if (result.success) {
          setDeletedNoticeTitle(noticeToDelete.title);
          setShowDeleteModal(false);
          setNoticeToDelete(null);
          setShowDeletedModal(true);
          setNotices(notices.filter(a => a.id !== noticeToDelete.id));
        } else {
          console.error('削除に失敗しました:', result.error);
          alert(`削除に失敗しました: ${result.error}`);
        }
      } catch (error) {
        console.error('削除エラー:', error);
        alert('削除中にエラーが発生しました');
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setNoticeToDelete(null);
  };

  const handleCloseDeletedModal = () => {
    setShowDeletedModal(false);
    setDeletedNoticeTitle('');
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    const totalPages = Math.ceil(notices.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const columns = [
    { key: 'status', label: 'ステータス', sortable: true, width: 'w-[120px]' },
    {
      key: 'datetime',
      label: '最終更新日付',
      sortable: true,
      width: 'w-[180px]',
    },
    { key: 'category', label: 'カテゴリ', sortable: true, width: 'w-[150px]' },
    { key: 'title', label: 'お知らせタイトル', sortable: true, width: 'flex-1' },
    {
      key: 'actions',
      label: 'アクション',
      sortable: false,
      width: 'w-[120px]',
    },
  ];

  // ソート処理
  const sortedNotices = [...notices].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;
    let aValue: string;
    let bValue: string;
    switch (sortColumn) {
      case 'status':
        aValue = getStatusText(a.status);
        bValue = getStatusText(b.status);
        break;
      case 'datetime':
        aValue = a.updated_at || a.created_at || '';
        bValue = b.updated_at || b.created_at || '';
        break;
      case 'category':
        aValue =
          a.categories && a.categories.length > 0
            ? a.categories
                .map(cat => cat.name)
                .sort((x, y) => x.localeCompare(y, 'ja'))
                .join('、')
            : a.category?.name || '';
        bValue =
          b.categories && b.categories.length > 0
            ? b.categories
                .map(cat => cat.name)
                .sort((x, y) => x.localeCompare(y, 'ja'))
                .join('、')
            : b.category?.name || '';
        break;
      case 'title':
        aValue = a.title;
        bValue = b.title;
        break;
      default:
        return 0;
    }
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  // ページネーション
  const paginatedNotices = sortedNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sortedNotices.length / itemsPerPage);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* テーブルコンテナ */}
      <div className='bg-white rounded-lg overflow-hidden'>
        {/* テーブルヘッダー */}
        <div className='flex items-center px-5 py-3 bg-[#F8F8F8] border-b border-[#E5E5E5]'>
          {columns.map(column => (
            <div
              key={column.key}
              className={`${column.width || 'flex-1'} px-3 ${column.sortable ? 'cursor-pointer select-none' : ''}`}
              onClick={() => column.sortable && handleSort(column.key)}
            >
              <div className='flex items-center gap-2'>
                <span className="font-['Noto_Sans_JP'] text-[14px] font-bold text-[#323232] leading-[1.6] tracking-[1.4px]">
                  {column.label}
                </span>
                {column.sortable && (
                  <div className='flex flex-col gap-0.5'>
                    <ArrowIcon direction='up' size={8} color='#0F9058' />
                    <ArrowIcon direction='down' size={8} color='#0F9058' />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* お知らせ一覧 */}
        <div className='mt-2 space-y-2'>
          {paginatedNotices.map(notice => {
            const dateTime = formatDate(
              notice.updated_at || notice.created_at
            );
            return (
              <AdminTableRow
                key={
                  notice.id || `notice-${paginatedNotices.indexOf(notice)}`
                }
                onClick={() => handleRowClick(notice)}
                columns={[
                  {
                    content: getStatusBadge(notice.status),
                    width: 'w-[120px]',
                  },
                  {
                    content: (
                      <div>
                        <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                          {dateTime.date}
                        </div>
                        <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                          {dateTime.time}
                        </div>
                      </div>
                    ),
                    width: 'w-[180px]',
                  },
                  {
                    content: (
                      <span className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                        {notice.categories && notice.categories.length > 0
                          ? notice.categories
                              .map(cat => cat.name)
                              .sort((a, b) => a.localeCompare(b, 'ja'))
                              .join('、')
                          : notice.category?.name || '-'}
                      </span>
                    ),
                    width: 'w-[150px]',
                  },
                  {
                    content: (
                      <span
                        className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px] block truncate"
                        title={notice.title}
                      >
                        {notice.title.length > 10
                          ? `${notice.title.substring(0, 10)}...`
                          : notice.title}
                      </span>
                    ),
                    width: 'flex-1',
                  },
                ]}
                actions={[
                  <ActionButton
                    key='edit'
                    text='編集'
                    variant='edit'
                    onClick={() => handleEdit(notice)}
                  />,
                  <ActionButton
                    key='delete'
                    text='削除'
                    variant='delete'
                    onClick={() => handleDelete(notice)}
                  />,
                ]}
              />
            );
          })}
        </div>
      </div>
      {/* ページネーション */}
      <div className='flex justify-center gap-[74px] mt-8'>
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-6 py-3 rounded-full font-['Inter'] text-[16px] font-bold leading-[1.6] transition-colors ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#0F9058] text-white hover:bg-[#0A7A46]'
          }`}
          style={{
            minWidth: '120px',
            height: '48px',
          }}
        >
          前へ
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-6 py-3 rounded-full font-['Inter'] text-[16px] font-bold leading-[1.6] transition-colors ${
            currentPage === totalPages || totalPages === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#0F9058] text-white hover:bg-[#0A7A46]'
          }`}
          style={{
            minWidth: '120px',
            height: '48px',
          }}
        >
          次へ
        </button>
      </div>
      {/* 削除確認モーダル */}
      <AdminConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title='お知らせ削除'
        description={`このお知らせを削除してよいですか？`}
        confirmText='削除する'
        cancelText='閉じる'
      />
      {/* 削除完了通知モーダル */}
      <AdminNotificationModal
        isOpen={showDeletedModal}
        onConfirm={handleCloseDeletedModal}
        title='お知らせ削除完了'
        description={`お知らせの削除が完了しました。`}
        confirmText='お知らせ一覧に戻る'
      />
    </div>
  );
}