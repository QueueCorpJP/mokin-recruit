'use client';

import { useEffect, useState } from 'react';
import { articleService, Article } from '@/lib/services/articleService';
import { MediaTableRow } from '@/components/admin/ui/MediaTableRow';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { NewArticleButton } from '@/components/admin/ui/NewArticleButton';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';

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

  const getStatusStyle = (status: Article['status']) => {
    if (status === 'PUBLISHED') {
      return 'bg-green-600 text-white';
    } else if (status === 'DRAFT') {
      return 'bg-yellow-600 text-white';
    } else {
      return 'bg-gray-600 text-white';
    }
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
    { key: 'datetime', label: '日時', sortable: true, width: 'w-[180px]' },
    { key: 'status', label: 'ステータス', sortable: true, width: 'w-[120px]' },
    { key: 'title', label: 'タイトル', sortable: true, width: 'flex-1' },
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
      <div className="mb-6 flex justify-end">
        <NewArticleButton />
      </div>

      {/* テーブルコンテナ */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* テーブルヘッダー */}
        <MediaTableHeader
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {/* メディア記事一覧 */}
        <div className="divide-y divide-gray-200">
          {paginatedArticles.map((article) => {
            const dateTime = formatDate(article.updated_at || article.created_at);
            
            return (
              <MediaTableRow
                key={article.id}
                date={dateTime.date}
                time={dateTime.time}
                status={getStatusText(article.status)}
                content={article.title}
                onEdit={() => handleEdit(article.id)}
                onDelete={() => handleDelete(article.id, article.title)}
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