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

export default function MediaPage() {
  // メディア記事データのサンプル
  const articleData = Array(30).fill(null).map((_, index) => ({
    id: index + 1,
    status: index % 2 === 0 ? '公開中' : '下書き',
    updateDate: 'yyyy/mm/dd',
    updateTime: 'hh:mm',
    category: index % 3 === 0 ? 'カテゴリA' : index % 3 === 1 ? 'カテゴリA,カテゴリB' : 'カテゴリA,カテゴリB',
    title: '記事タイトルが入ります。記事タイトルが入ります。'
  }));

  const getStatusStyle = (status: string) => {
    if (status === '公開中') {
      return 'bg-green-600 text-white';
    } else {
      return 'bg-yellow-600 text-white';
    }
  };

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
            {articleData.map((article, index) => (
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
                    {article.status}
                  </Button>
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  <div>{article.updateDate}</div>
                  <div>{article.updateTime}</div>
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {article.category}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {article.title}
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
                  >
                    削除する
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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