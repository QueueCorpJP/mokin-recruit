'use client';
import { useState } from 'react';
import { Article } from '@/lib/services/articleService';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { NewArticleButton } from '@/components/admin/ui/NewArticleButton';
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { ArrowIcon } from '@/components/admin/ui/ArrowIcon';
import { AdminConfirmModal } from '@/components/admin/ui/AdminConfirmModal';
import { AdminNotificationModal } from '@/components/admin/ui/AdminNotificationModal';

interface MediaPageClientProps {
  articles: Article[];
}

export default function MediaPageClient({
  articles: initialArticles,
}: MediaPageClientProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [deletedArticleTitle, setDeletedArticleTitle] = useState('');
  const itemsPerPage = 10;

  const getStatusBadge = (status: Article['status']) => {
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

  const getStatusText = (status: Article['status']) => {
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
      })
      .replace(/\//g, '/');
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

  const handleNewArticle = () => {
    window.location.href = '/admin/media/new';
  };

  const handleEdit = (article: Article) => {
    window.location.href = `/admin/media/edit?id=${article.id}`;
  };

  const handleRowClick = (article: Article) => {
    window.location.href = `/admin/media/${article.id}`;
  };

  const handleDelete = (article: Article) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  // TODO: サーバーアクションで削除処理を実装し、revalidatePathで再取得する形にリファクタリングする
  const handleConfirmDelete = async () => {
    // 仮実装: ローカル状態のみ更新
    if (articleToDelete) {
      setDeletedArticleTitle(articleToDelete.title);
      setShowDeleteModal(false);
      setArticleToDelete(null);
      setShowDeletedModal(true);
      setArticles(articles.filter(a => a.id !== articleToDelete.id));
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setArticleToDelete(null);
  };

  const handleCloseDeletedModal = () => {
    setShowDeletedModal(false);
    setDeletedArticleTitle('');
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    const totalPages = Math.ceil(articles.length / itemsPerPage);
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
    { key: 'title', label: '記事タイトル', sortable: true, width: 'flex-1' },
    {
      key: 'actions',
      label: 'アクション',
      sortable: false,
      width: 'w-[120px]',
    },
  ];

  // ソート処理
  const sortedArticles = [...articles].sort((a, b) => {
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
  const paginatedArticles = sortedArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sortedArticles.length / itemsPerPage);

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
        {/* メディア記事一覧 */}
        <div className='mt-2 space-y-2'>
          {paginatedArticles.map(article => {
            const dateTime = formatDate(
              article.updated_at || article.created_at
            );
            return (
              <AdminTableRow
                key={
                  article.id || `article-${paginatedArticles.indexOf(article)}`
                }
                onClick={() => handleRowClick(article)}
                columns={[
                  {
                    content: getStatusBadge(article.status),
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
                        {article.categories && article.categories.length > 0
                          ? article.categories
                              .map(cat => cat.name)
                              .sort((a, b) => a.localeCompare(b, 'ja'))
                              .join('、')
                          : article.category?.name || '-'}
                      </span>
                    ),
                    width: 'w-[150px]',
                  },
                  {
                    content: (
                      <span
                        className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px] block truncate"
                        title={article.title}
                      >
                        {article.title.length > 10
                          ? `${article.title.substring(0, 10)}...`
                          : article.title}
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
                    onClick={() => handleEdit(article)}
                  />,
                  <ActionButton
                    key='delete'
                    text='削除'
                    variant='delete'
                    onClick={() => handleDelete(article)}
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
        title='メディア削除'
        description={`このメディアを削除してよいですか？`}
        confirmText='削除する'
        cancelText='閉じる'
      />
      {/* 削除完了通知モーダル */}
      <AdminNotificationModal
        isOpen={showDeletedModal}
        onConfirm={handleCloseDeletedModal}
        title='メディア削除完了'
        description={`メディアの削除が完了しました。`}
        confirmText='メディア一覧に戻る'
      />
    </div>
  );
}
