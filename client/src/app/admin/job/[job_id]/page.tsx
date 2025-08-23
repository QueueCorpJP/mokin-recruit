'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/admin/ui/table';

interface JobDetailPageProps {
  params: {
    job_id: string;
  };
}

interface JobDetail {
  id: string;
  title: string;
  company: string;
  status: '公開中' | '非公開' | '下書き' | '承認待ち';
  publicationType: '一般公開' | 'スカウト専用';
  salaryMin: number;
  salaryMax: number;
  location: string[];
  jobTypes: string[];
  industries: string[];
  jobDescription: string;
  positionSummary: string;
  skills: string;
  otherRequirements: string;
  employmentType: string;
  workingHours: string;
  holidays: string;
  selectionProcess: string;
  appealPoints: string[];
  createdAt: string;
  updatedAt: string;
}

const mockJobDetail: JobDetail = {
  id: '1',
  title: 'React/TypeScript エンジニア',
  company: 'モキン株式会社',
  status: '公開中',
  publicationType: '一般公開',
  salaryMin: 500,
  salaryMax: 800,
  location: ['東京都'],
  jobTypes: ['エンジニア'],
  industries: ['IT・Web・ゲーム'],
  jobDescription: '新規事業の開発・運用を担当していただきます。React/TypeScript を使用したフロントエンド開発がメインの業務となります。',
  positionSummary: '新規事業の中心メンバーとして、技術選定から実装まで幅広く担当していただけます。',
  skills: '・React、TypeScript での開発経験 3年以上\n・チーム開発の経験',
  otherRequirements: '・新しい技術に積極的に取り組める方\n・チームワークを大切にできる方',
  employmentType: '正社員',
  workingHours: '9:00～18:00（所定労働時間8時間）\n休憩：60分\nフレックス制：有',
  holidays: '完全週休2日制（土・日）、祝日\n年間休日：120日\n有給休暇：初年度10日\nその他休暇：年末年始休暇',
  selectionProcess: '1次面接（人事）→ 2次面接（現場責任者）→ 最終面接（役員）',
  appealPoints: ['フレックスタイム制', 'リモートワーク可'],
  createdAt: '2024-01-15',
  updatedAt: '2024-01-20',
};

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const { job_id } = params;

  const getStatusColor = (status: string) => {
    switch (status) {
      case '公開中':
        return 'text-green-600 bg-green-100';
      case '非公開':
        return 'text-gray-600 bg-gray-100';
      case '下書き':
        return 'text-yellow-600 bg-yellow-100';
      case '承認待ち':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatSalary = (min: number, max: number) => {
    return `${min}万円 〜 ${max}万円`;
  };

  const DisplayValue: React.FC<{ value: string; className?: string }> = ({
    value,
    className = '',
  }) => (
    <div
      className={`font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] ${className}`}
    >
      {value || '未入力'}
    </div>
  );

  const TagDisplay: React.FC<{ items: string[] }> = ({ items }) => (
    <div className='flex flex-wrap gap-2 items-center justify-start w-full'>
      {items.map(item => (
        <div
          key={item}
          className='bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px]'
        >
          <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
            {item}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <nav className="mb-8 text-sm text-gray-600">
          <span>管理画面トップ</span>
          <span className="mx-2">&gt;</span>
          <span>求人一覧</span>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900 font-medium">求人詳細</span>
        </nav>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {mockJobDetail.title}
                </h1>
              </div>
              <div className="flex gap-3">
                <Link href={`/admin/job/${job_id}/edit`}>
                  <Button
                    variant="green-outline"
                    size="figma-outline"
                    className="px-6 py-2 rounded-[32px] border-[#0f9058] text-[#0f9058] bg-white hover:bg-[#0f9058]/10"
                  >
                    編集
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="figma-outline"
                  className="px-6 py-2 rounded-[32px] bg-red-500 text-white hover:bg-red-600"
                >
                  削除
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* 求人情報テーブル */}
            <div className="mb-8">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className="w-32">会社名</TableHead>
                    <TableCell>{mockJobDetail.company}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>ステータス</TableHead>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(mockJobDetail.status)}`}>
                        {mockJobDetail.status}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>公開タイプ</TableHead>
                    <TableCell>{mockJobDetail.publicationType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>職種</TableHead>
                    <TableCell>
                      <TagDisplay items={mockJobDetail.jobTypes} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>業種</TableHead>
                    <TableCell>
                      <TagDisplay items={mockJobDetail.industries} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>想定年収</TableHead>
                    <TableCell>{formatSalary(mockJobDetail.salaryMin, mockJobDetail.salaryMax)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>勤務地</TableHead>
                    <TableCell>
                      <TagDisplay items={mockJobDetail.location} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>雇用形態</TableHead>
                    <TableCell>{mockJobDetail.employmentType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>作成日</TableHead>
                    <TableCell>{mockJobDetail.createdAt}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>更新日</TableHead>
                    <TableCell>{mockJobDetail.updatedAt}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* 求人詳細セクション（company/job/newの確認ページと同じデザイン） */}
            <div className="border-t pt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">求人詳細</h2>
              
              {/* ポジション概要（業務内容＋魅力） */}
              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    ポジション概要
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-8 items-start justify-start px-0 py-6'>
                  {/* 業務内容 */}
                  <div className='w-full'>
                    <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                      業務内容
                    </label>
                    <DisplayValue
                      value={mockJobDetail.jobDescription}
                      className='whitespace-pre-wrap'
                    />
                  </div>
                  {/* 当ポジションの魅力 */}
                  <div className='w-full'>
                    <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                      当ポジションの魅力
                    </label>
                    <DisplayValue
                      value={mockJobDetail.positionSummary}
                      className='whitespace-pre-wrap'
                    />
                  </div>
                </div>
              </div>

              {/* 求める人物像 */}
              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    求める人物像
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-8 items-start justify-start px-0 py-6'>
                  {/* スキル・経験 */}
                  <div className='w-full'>
                    <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                      スキル・経験
                    </label>
                    <DisplayValue value={mockJobDetail.skills} className='whitespace-pre-wrap' />
                  </div>
                  {/* その他・求める人物像など */}
                  <div className='w-full'>
                    <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                      その他・求める人物像など
                    </label>
                    <DisplayValue
                      value={mockJobDetail.otherRequirements}
                      className='whitespace-pre-wrap'
                    />
                  </div>
                </div>
              </div>

              {/* 条件・待遇 */}
              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    条件・待遇
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-8 items-start justify-start px-0 py-6'>
                  {/* 想定年収 */}
                  <div className='w-full'>
                    <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                      想定年収
                    </label>
                    <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      {formatSalary(mockJobDetail.salaryMin, mockJobDetail.salaryMax)}
                    </div>
                  </div>
                  <div
                    className='w-full my-2'
                    style={{ height: '1px', background: '#EFEFEF' }}
                  />
                  {/* 就業時間 */}
                  <div className='w-full'>
                    <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                      就業時間
                    </label>
                    <DisplayValue
                      value={mockJobDetail.workingHours}
                      className='whitespace-pre-wrap'
                    />
                  </div>
                  {/* 休日・休暇 */}
                  <div className='w-full'>
                    <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                      休日・休暇
                    </label>
                    <DisplayValue value={mockJobDetail.holidays} className='whitespace-pre-wrap' />
                  </div>
                </div>
              </div>

              {/* 選考フロー */}
              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    選考情報
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                  <div className='flex flex-col gap-2 items-start justify-start w-full'>
                    <DisplayValue
                      value={mockJobDetail.selectionProcess}
                      className='whitespace-pre-wrap'
                    />
                  </div>
                </div>
              </div>

              {/* アピールポイント */}
              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    アピールポイント
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                  <div className='flex flex-col gap-4 items-start justify-start w-full'>
                    <TagDisplay items={mockJobDetail.appealPoints} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t flex justify-center gap-4">
              <Link href="/admin/job">
                <Button
                  variant="green-outline"
                  size="figma-outline"
                  className="px-10 py-3 rounded-[32px] border-[#0f9058] text-[#0f9058] bg-white hover:bg-[#0f9058]/10"
                >
                  求人一覧に戻る
                </Button>
              </Link>
              <Link href={`/admin/job/${job_id}/edit`}>
                <Button
                  variant="green-gradient"
                  size="figma-default"
                  className="px-10 py-3 rounded-[32px] bg-gradient-to-r from-[#198D76] to-[#1CA74F] text-white"
                >
                  求人を編集
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}