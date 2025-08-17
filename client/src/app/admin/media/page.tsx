'use client';

import { useEffect, useState } from 'react';
import { articleService, Article } from '@/lib/services/articleService';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { NewArticleButton } from '@/components/admin/ui/NewArticleButton';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { ArrowIcon } from '@/components/admin/ui/ArrowIcon';

export default function MediaPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await articleService.getArticles({
          limit: 30,
          offset: 0
        });
        setArticles(response.articles);
      } catch (err) {
        console.error('記事の取得に失敗しました:', err);
        setError(err instanceof Error ? err.message : '記事の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const getStatusBadge = (status: Article['status']) => {
    const statusText = getStatusText(status);
    const statusClass = status === 'PUBLISHED' 
      ? 'bg-[#D2F1DA] text-[#0F9058]' 
      : 'bg-gray-100 text-gray-600';
    
    return (
      <span className={`inline-block px-3 py-1 rounded-[5px] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] ${statusClass}`}>
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
    const dateStr = date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '/');
    const timeStr = date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
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

  const handleEdit = (articleId: string) => {
    window.open(`/admin/media/${articleId}`, '_blank');
  };

  const handleDelete = async (articleId: string, articleTitle: string) => {
    if (confirm(`記事「${articleTitle}」を削除しますか？`)) {
      try {
        // TODO: 削除APIを実装
        console.log('Delete article:', articleId);
        // 削除後にリストを更新
        setArticles(articles.filter(a => a.id !== articleId));
      } catch (error) {
        console.error('削除に失敗しました:', error);
      }
    }
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
    { key: 'datetime', label: '最終更新日付', sortable: true, width: 'w-[180px]' },
    { key: 'category', label: 'カテゴリ', sortable: true, width: 'w-[150px]' },
    { key: 'title', label: '記事タイトル', sortable: true, width: 'flex-1' },
    { key: 'actions', label: 'アクション', sortable: false, width: 'w-[200px]' }
  ];

  // ページネーション
  const paginatedArticles = articles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(articles.length / itemsPerPage);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">エラー: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 上部の機能エリア */}
      <div className="mb-6 flex justify-between items-center">
        <h1 
          className="text-2xl font-bold"
          style={{
            fontFamily: 'Inter',
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: 1.6,
            color: '#323232'
          }}
        >
          メディア記事一覧
        </h1>
        <NewArticleButton />
      </div>

      {/* テーブルコンテナ */}
      <div className="bg-white rounded-lg overflow-x-auto">
        {/* テーブルヘッダー */}
        <div className="flex items-center px-5 py-3 bg-[#F8F8F8] border-b border-[#E5E5E5]">
          {columns.map((column) => (
            <div
              key={column.key}
              className={`${column.width || 'flex-1'} px-3 ${column.sortable ? 'cursor-pointer select-none' : ''}`}
              onClick={() => column.sortable && handleSort(column.key)}
            >
              <div className="flex items-center gap-2">
                <span className="font-['Noto_Sans_JP'] text-[14px] font-bold text-[#323232] leading-[1.6] tracking-[1.4px]">
                  {column.label}
                </span>
                {column.sortable && (
                  <div className="flex flex-col gap-0.5">
                    <ArrowIcon
                      direction="up"
                      size={8}
                      color="#0F9058"
                    />
                    <ArrowIcon
                      direction="down"
                      size={8}
                      color="#0F9058"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* メディア記事一覧 */}
        <div className="mt-2 space-y-2">
          {paginatedArticles.map((article) => {
            const dateTime = formatDate(article.updated_at || article.created_at);
            
            return (
              <AdminTableRow
                key={article.id || `article-${paginatedArticles.indexOf(article)}`}
                columns={[
                  {
                    content: getStatusBadge(article.status),
                    width: 'w-[120px]'
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
                    width: 'w-[180px]'
                  },
                  {
                    content: (
                      <span className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                        {article.category?.name || '-'}
                      </span>
                    ),
                    width: 'w-[150px]'
                  },
                  {
                    content: article.title,
                    width: 'flex-1'
                  }
                ]}
                actions={[
                  <ActionButton key="edit" text="編集" variant="edit" onClick={() => article.id && handleEdit(article.id)} />,
                  <ActionButton key="delete" text="削除" variant="delete" onClick={() => article.id && handleDelete(article.id, article.title)} />
                ]}
              />
            );
          })}
        </div>
      </div>

      {/* ページネーション */}
      <div className="flex justify-center mt-8">
        <PaginationButtons
          onPrevious={handlePrevious}
          onNext={handleNext}
          previousDisabled={currentPage === 1}
          nextDisabled={currentPage === totalPages || totalPages === 0}
        />
      </div>
    </div>
  );
}