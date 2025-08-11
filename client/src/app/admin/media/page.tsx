'use client';

import { Button } from "@/components/admin/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import { useEffect, useState } from 'react';
import { articleService, Article } from '@/lib/services/articleService';

export default function MediaPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (!dateString) return '未設定';
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const timeStr = date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { date: dateStr, time: timeStr };
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">エラー: {error}</div>;
  }

  return (
    <div className="min-h-screen">
      {/* 上部の機能エリア */}
      <div className="mb-6 flex justify-end">
        <Button className="bg-black text-white px-6 py-2 rounded-full">
          新規記事追加
        </Button>
      </div>

      {/* メディア記事一覧テーブル */}
      <div className="bg-white border border-gray-300 rounded">
        <Table>
          <TableHeader className="bg-black">
            <TableRow>
              <TableHead className="border-r border-gray-600 px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#fff'
                  }}>
                    ステータス
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
              <TableHead className="border-r border-gray-600 px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#fff'
                  }}>
                    最終更新日付
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
              <TableHead className="border-r border-gray-600 px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#fff'
                  }}>
                    カテゴリ
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
              <TableHead className="border-r border-gray-600 px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#fff'
                  }}>
                    記事タイトルが入ります。
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
              <TableHead className="px-3 py-2">
                <span style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6,
                  color: '#fff'
                }}>
                  {/* 操作列 */}
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article, index) => {
              const dateTime = formatDate(article.updated_at || article.created_at);
              return (
                <TableRow key={article.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <TableCell className="border-r border-gray-200 px-3 py-4">
                    <Button 
                      className={`px-3 py-1 rounded text-sm ${getStatusStyle(article.status)}`}
                      style={{
                        fontFamily: 'Inter',
                        fontSize: '14px',
                        fontWeight: 700,
                        lineHeight: 1.6
                      }}
                    >
                      {getStatusText(article.status)}
                    </Button>
                  </TableCell>
                  <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6
                  }}>
                    {typeof dateTime === 'object' ? (
                      <>
                        <div>{dateTime.date}</div>
                        <div>{dateTime.time}</div>
                      </>
                    ) : (
                      <div>{dateTime}</div>
                    )}
                  </TableCell>
                  <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6
                  }}>
                    {/* カテゴリ表示 - 現在は実装されていないため空 */}
                    -
                  </TableCell>
                  <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6
                  }}>
                    <button
                      onClick={() => window.open(`/admin/media/${article.id}`, '_blank')}
                      className="text-left hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                    >
                      {article.title}
                    </button>
                  </TableCell>
                  <TableCell className="px-3 py-4">
                    <Button 
                      variant="outline"
                      className="border border-gray-400 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50"
                      style={{
                        fontFamily: 'Inter',
                        fontSize: '14px',
                        fontWeight: 700,
                        lineHeight: 1.6
                      }}
                      onClick={() => {
                        if (confirm('この記事を削除しますか？')) {
                          // TODO: 削除機能を実装
                          console.log('Delete article:', article.id);
                        }
                      }}
                    >
                      削除する
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* ページネーション */}
      <div className="flex justify-center gap-4 mt-6">
        <Button className="bg-black text-white px-6 py-2 rounded-full">
          前へ
        </Button>
        <Button className="bg-black text-white px-6 py-2 rounded-full">
          次へ
        </Button>
      </div>
    </div>
  );
}