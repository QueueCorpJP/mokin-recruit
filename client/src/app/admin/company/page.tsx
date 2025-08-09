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

export default function CompanyPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // 企業データのサンプル
  const companyData = Array(25).fill(null).map((_, index) => ({
    id: index + 1,
    lastLoginDate: 'yyyy/mm/dd',
    lastLoginTime: 'hh:mm',
    companyId: '【追加 yyyy/mm/dd】',
    companyName: '企業名が入ります。',
    planName: 'プラン名が入ります',
    loginUser: '最終ログインユーザー（IDが入ります）',
    companyGroup: '企業グループ名が入ります',
    location: '所在地が入ります。所在地が入ります。'
  }));

  return (
    <div className="min-h-screen">
      {/* 上部の機能エリア */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="text-red-500 text-sm">
            <div>企業ID</div>
            <div>企業名</div>
            <div>企業グループ</div>
            <div>所在地</div>
            <div>全選択期間</div>
            <div>部分一致で検索</div>
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
          
          <div className="text-red-500 text-sm">
            <div>部分一致で検索</div>
            <div>↓各項目は以下のように作成できます</div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button className="bg-black text-white px-6 py-2 rounded-full">
            新規企業追加
          </Button>
          <Button className="bg-white border border-black text-black px-6 py-2 rounded-full">
            CSVダウンロード
          </Button>
        </div>
      </div>

      {/* 企業一覧テーブル */}
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
                    最終ログイン日時
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
                    プラン
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
                    最終ログインユーザー
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
              <TableHead className="px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    所在地
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companyData.map((company, index) => (
              <TableRow key={company.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  <div>{company.lastLoginDate}</div>
                  <div>{company.lastLoginTime}</div>
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {company.companyId}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {company.companyName}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {company.planName}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {company.loginUser}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {company.companyGroup}
                </TableCell>
                <TableCell className="px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {company.location}
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