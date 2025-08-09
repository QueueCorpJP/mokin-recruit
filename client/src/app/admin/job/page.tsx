'use client';

import React, { useState } from "react";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";

export default function Job() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  // 求人データのサンプル
  const jobData = Array(20).fill(null).map((_, index) => ({
    id: index + 1,
    updateDate: 'yyyy/mm/dd',
    updateTime: 'hh:mm',
    status: index % 2 === 0 ? '承認待ち' : '完全公開',
    publicPeriod: '完全公開',
    company: '企業名が入ります。',
    position: 'ABCD/12345',
    jobId: '【会社 yyyy...】',
    title: '求人タイトルがA入ります'
  }));

  return (
    <div className="min-h-screen">
      {/* 上部の検索・フィルター機能 */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="text-red-500 text-sm">
            <div>企業：求人一覧</div>
            <div>求人タイトル</div>
            <div>求人本文</div>
            <div>職種</div>
            <div>求人ID</div>
            <div>全選択期間</div>
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="を選択期間で検索"
              className="border border-gray-400"
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
        </div>
        
        <div className="text-sm text-red-500">
          <div>部分一致で検索</div>
          <div>↓各項目は以下のように作成できます</div>
        </div>
      </div>

      {/* 求人一覧テーブル */}
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
                    更新日時
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
                    ステータス
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
                    公開期間
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
                    職種
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
                    求人ID
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
                    求人タイトル
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobData.map((job, index) => (
              <TableRow key={job.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  <div>{job.updateDate}</div>
                  <div>{job.updateTime}</div>
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4">
                  <Button 
                    className={`px-3 py-1 rounded text-white text-sm ${
                      job.status === '承認待ち' ? 'bg-orange-500' : 'bg-green-600'
                    }`}
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6
                    }}
                  >
                    {job.status}
                  </Button>
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
                    {job.publicPeriod}
                  </Button>
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {job.company}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4">
                  <Button 
                    className="bg-black text-white px-3 py-1 rounded text-sm"
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6
                    }}
                  >
                    編集画入る
                  </Button>
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  <div>{job.position}</div>
                  <div>{job.jobId}</div>
                </TableCell>
                <TableCell className="px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {job.title}
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