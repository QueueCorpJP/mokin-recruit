'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/admin/ui/card';
import { Badge } from '@/components/admin/ui/badge';
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea';
import { Button } from '@/components/ui/button';

interface AdminDashboardClientProps {
  jobPendingCount: number;
  pendingMessageCount: number;
  resumePendingCount: number;
}

export default function AdminDashboardClient({
  jobPendingCount,
  pendingMessageCount,
  resumePendingCount,
}: AdminDashboardClientProps) {
  const [memo, setMemo] = useState('');

  const todoItems = [
    { label: '求人', href: '/admin/job/pending', count: jobPendingCount },
    {
      label: 'メッセージ',
      href: '/admin/message/pending',
      count: pendingMessageCount,
    },
    { label: 'レジュメ', href: '/admin/candidate', count: resumePendingCount },
  ];

  return (
    <div className='min-h-screen'>
      {/* 要対応リストセクション */}
      <Card className='mb-8 border-none shadow-none bg-transparent'>
        <CardHeader className='px-0'>
          <CardTitle className='text-[32px] font-bold text-[#323232]'>
            要対応リスト
          </CardTitle>
        </CardHeader>
        <CardContent className='px-0'>
          <div className='flex gap-4'>
            {todoItems.map(item => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant='default'
                  className='bg-[#0c0c0c] hover:bg-[#333] text-white px-4 py-2'
                >
                  <div className='flex items-center gap-2'>
                    <span>{item.label}</span>
                    <Badge
                      variant='secondary'
                      className='bg-white text-[#323232] font-bold'
                    >
                      {item.count}
                    </Badge>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 運営メモセクション */}
      <Card className='border-none shadow-none bg-transparent'>
        <CardHeader className='px-0'>
          <CardTitle className='text-[32px] font-bold text-[#323232]'>
            運営メモ
          </CardTitle>
        </CardHeader>
        <CardContent className='px-0'>
          <Card className='bg-white border border-black'>
            <CardContent className='p-4'>
              <AdminTextarea
                value={memo}
                onChange={setMemo}
                placeholder='運営に関するメモを自由に入力できます。'
                className='min-h-[120px] border-none resize-none font-bold text-[16px]'
              />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
