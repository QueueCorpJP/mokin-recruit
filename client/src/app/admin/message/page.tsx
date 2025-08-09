'use client';

import { useState } from 'react';
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";

export default function MessagePage() {
  const [searchTerm, setSearchTerm] = useState('');

  // メッセージデータのサンプル
  const messageData = Array(20).fill(null).map((_, index) => ({
    id: index + 1,
    date: 'yyyy/mm/dd',
    time: 'hh:mm',
    companyName: '企業IDが入ります。',
    companyNumber: '企業名が入ります。',
    companyGroup: '企業グループ名が入ります。',
    candidateName: '候補者名が入る。',
    status: '書類提出',
    messagePage: '求人名が入ります。求人名が入ります。',
    detailButton: '詳細'
  }));

  return (
    <div className="min-h-screen">
      {/* 検索・フィルター機能 */}
      <div className="mb-6">
        <div className="flex gap-4 items-center mb-4">
          <div className="text-red-500 text-sm">
            <div>絞り込み</div>
            <div>企業ID</div>
            <div>求人ID</div>
            <div>求人タイトル</div>
            <div>全制御画面</div>
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="検索"
              className="w-60 border border-gray-400"
              style={{
                fontFamily: 'Inter',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: 1.6
              }}
            />
            <Button className="bg-black text-white px-4 py-2 rounded">
              検索
            </Button>
          </div>
          
          <div className="text-red-500 text-sm ml-auto">
            <div>部分一致で検索</div>
          </div>
        </div>
      </div>

      {/* メッセージ一覧テーブル */}
      <div className="bg-white border border-gray-300 rounded">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="border-r border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    日付
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
              <TableHead className="border-r border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    企業ID
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
              <TableHead className="border-r border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    企業名
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
              <TableHead className="border-r border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    企業グループ
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
              <TableHead className="border-r border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    候補者名
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
              <TableHead className="border-r border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    選考状況
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
                    color: '#000'
                  }}>
                    求人ページ
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messageData.map((message, index) => (
              <TableRow key={message.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  <div className="flex items-center gap-2">
                    <Button className="bg-black text-white px-2 py-1 rounded text-xs">
                      {message.detailButton}
                    </Button>
                    <div>
                      <div>{message.date}</div>
                      <div>{message.time}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {message.companyName}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {message.companyNumber}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {message.companyGroup}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {message.candidateName}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4">
                  <Button 
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6
                    }}
                  >
                    {message.status}
                  </Button>
                </TableCell>
                <TableCell className="px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {message.messagePage}
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