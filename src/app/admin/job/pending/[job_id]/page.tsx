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
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { PendingJobDetailActions } from './PendingJobDetailActions';

interface PendingJobDetailPageProps {
  params: Promise<{
    job_id: string;
  }>;
}

interface JobDetail {
  id: string;
  title: string;
  company_accounts?: {
    company_name: string;
  };
  company_groups?: {
    group_name: string;
  };
  status: string;
  publication_type: string;
  salary_min: number | null;
  salary_max: number | null;
  work_location: string[] | null;
  job_type: string[] | null;
  industry: string[] | null;
  job_description: string;
  position_summary: string | null;
  required_skills: string | null;
  preferred_skills: string | null;
  employment_type: string;
  working_hours: string | null;
  holidays: string | null;
  selection_process: string | null;
  appeal_points: string[] | null;
  created_at: string;
  updated_at: string;
}

async function fetchJobDetail(jobId: string): Promise<JobDetail | null> {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('job_postings')
    .select(`
      *,
      company_accounts (
        company_name
      ),
      company_groups (
        group_name
      )
    `)
    .eq('id', jobId)
    .single();

  if (error) {
    console.error('Error fetching job detail:', error);
    return null;
  }

  return data as JobDetail;
}

export default async function PendingJobDetailPage({ params }: PendingJobDetailPageProps) {
  const { job_id } = await params;
  const jobDetail = await fetchJobDetail(job_id);

  if (!jobDetail) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mt-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">求人が見つかりません</h1>
            <Link href="/admin/job/pending">
              <Button variant="green-gradient">承認待ち一覧に戻る</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'text-green-600 bg-green-100';
      case 'CLOSED':
        return 'text-gray-600 bg-gray-100';
      case 'DRAFT':
        return 'text-yellow-600 bg-yellow-100';
      case 'PENDING_APPROVAL':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const statusMap: Record<string, string> = {
    DRAFT: '下書き',
    PENDING_APPROVAL: '承認待ち',
    PUBLISHED: '掲載済',
    CLOSED: '公開停止',
  };

  const publicationTypeMap: Record<string, string> = {
    public: '一般公開',
    members: '登録会員限定',
    scout: 'スカウト限定',
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
          <span>承認待ち一覧</span>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900 font-medium">求人詳細</span>
        </nav>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {jobDetail.title}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(jobDetail.status)}`}>
                    {statusMap[jobDetail.status] || jobDetail.status}
                  </span>
                  <span className="text-sm text-gray-600">
                    申請日時: {new Date(jobDetail.updated_at).toLocaleString('ja-JP')}
                  </span>
                </div>
              </div>
              <PendingJobDetailActions jobId={job_id} />
            </div>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className="w-32">会社名</TableHead>
                    <TableCell>{jobDetail.company_accounts?.company_name || '不明'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>ステータス</TableHead>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(jobDetail.status)}`}>
                        {statusMap[jobDetail.status] || jobDetail.status}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>公開タイプ</TableHead>
                    <TableCell>{publicationTypeMap[jobDetail.publication_type] || jobDetail.publication_type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>職種</TableHead>
                    <TableCell>
                      <TagDisplay items={jobDetail.job_type || []} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>業種</TableHead>
                    <TableCell>
                      <TagDisplay items={jobDetail.industry || []} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>想定年収</TableHead>
                    <TableCell>
                      {jobDetail.salary_min && jobDetail.salary_max 
                        ? formatSalary(jobDetail.salary_min, jobDetail.salary_max)
                        : '未設定'
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>勤務地</TableHead>
                    <TableCell>
                      <TagDisplay items={jobDetail.work_location || []} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>雇用形態</TableHead>
                    <TableCell>{jobDetail.employment_type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>作成日</TableHead>
                    <TableCell>{new Date(jobDetail.created_at).toLocaleDateString('ja-JP')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>更新日</TableHead>
                    <TableCell>{new Date(jobDetail.updated_at).toLocaleDateString('ja-JP')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="border-t pt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">求人詳細</h2>
              
              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    ポジション概要
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-8 items-start justify-start px-0 py-6'>
                  <div className='w-full'>
                    <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                      業務内容
                    </label>
                    <DisplayValue
                      value={jobDetail.job_description}
                      className='whitespace-pre-wrap'
                    />
                  </div>
                  <div className='w-full'>
                    <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                      当ポジションの魅力
                    </label>
                    <DisplayValue
                      value={jobDetail.position_summary || ''}
                      className='whitespace-pre-wrap'
                    />
                  </div>
                </div>
              </div>

              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    求める人物像
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-8 items-start justify-start px-0 py-6'>
                  <div className='w-full'>
                    <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                      スキル・経験
                    </label>
                    <DisplayValue value={jobDetail.required_skills || ''} className='whitespace-pre-wrap' />
                  </div>
                  <div className='w-full'>
                    <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                      その他・求める人物像など
                    </label>
                    <DisplayValue
                      value={jobDetail.preferred_skills || ''}
                      className='whitespace-pre-wrap'
                    />
                  </div>
                </div>
              </div>

              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    条件・待遇
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-8 items-start justify-start px-0 py-6'>
                  <div className='w-full'>
                    <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                      想定年収
                    </label>
                    <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      {jobDetail.salary_min && jobDetail.salary_max 
                        ? formatSalary(jobDetail.salary_min, jobDetail.salary_max)
                        : '未設定'
                      }
                    </div>
                  </div>
                  <div
                    className='w-full my-2'
                    style={{ height: '1px', background: '#EFEFEF' }}
                  />
                  <div className='w-full'>
                    <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                      就業時間
                    </label>
                    <DisplayValue
                      value={jobDetail.working_hours || ''}
                      className='whitespace-pre-wrap'
                    />
                  </div>
                  <div className='w-full'>
                    <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                      休日・休暇
                    </label>
                    <DisplayValue value={jobDetail.holidays || ''} className='whitespace-pre-wrap' />
                  </div>
                </div>
              </div>

              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    選考情報
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                  <div className='flex flex-col gap-2 items-start justify-start w-full'>
                    <DisplayValue
                      value={jobDetail.selection_process || ''}
                      className='whitespace-pre-wrap'
                    />
                  </div>
                </div>
              </div>

              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    アピールポイント
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                  <div className='flex flex-col gap-4 items-start justify-start w-full'>
                    <TagDisplay items={jobDetail.appeal_points || []} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t flex justify-center gap-4">
              <Link href="/admin/job/pending">
                <Button
                  variant="green-outline"
                  size="figma-outline"
                  className="px-10 py-3 rounded-[32px] border-[#0f9058] text-[#0f9058] bg-white hover:bg-[#0f9058]/10"
                >
                  承認待ち一覧に戻る
                </Button>
              </Link>
              <PendingJobDetailActions jobId={job_id} showLabels />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}