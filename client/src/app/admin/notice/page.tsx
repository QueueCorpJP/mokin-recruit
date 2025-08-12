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

export default function NoticePage() {
  // 運営お知らせデータのサンプル
  const noticeData = Array(30).fill(null).map((_, index) => ({
    id: index + 1,
    status: index % 2 === 0 ? '公開中' : '下書き',
    updateDate: 'yyyy/mm/dd',
    updateTime: 'hh:mm',
    title: 'お知らせタイトルが入ります。お知らせタイトルが入ります。'
  }));

  const getStatusStyle = (status: string) => {
    if (status === '公開中') {
      return 'bg-green-600 text-white';
    } else {
      return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen">
      {/* 上部の機能エリア */}
      <div className="mb-6 flex justify-end">
        <Button className="bg-black text-white px-6 py-2 rounded-full">
          新規お知らせ追加
        </Button>
      </div>

      {/* 運営お知らせ一覧テーブル */}
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
                    最終更新日時
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
              <TableHead className="px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#fff'
                  }}>
                    お知らせタイトルが入ります。
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {noticeData.map((notice, index) => (
              <TableRow key={notice.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <TableCell className="border-r border-gray-200 px-3 py-4">
                  <Button 
                    className={`px-3 py-1 rounded text-sm ${getStatusStyle(notice.status)}`}
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      fontWeight: 700,
                      lineHeight: 1.6
                    }}
                  >
                    {notice.status}
                  </Button>
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  <div>{notice.updateDate}</div>
                  <div>{notice.updateTime}</div>
                </TableCell>
                <TableCell className="px-3 py-4 flex items-center justify-between">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6
                  }}>
                    {notice.title}
                  </span>
                  <Button 
                    variant="outline"
                    className="border border-gray-400 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 ml-4"
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      fontWeight: 700,
                      lineHeight: 1.6
                    }}
                  >
                    詳細する
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