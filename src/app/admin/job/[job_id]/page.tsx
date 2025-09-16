import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

interface JobDetailPageProps {
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

interface ScoutStats {
  scout_sent_7d: number;
  scout_opened_7d: number;
  scout_replied_7d: number;
  scout_applied_7d: number;
  scout_sent_30d: number;
  scout_opened_30d: number;
  scout_replied_30d: number;
  scout_applied_30d: number;
  scout_sent_total: number;
  scout_opened_total: number;
  scout_replied_total: number;
  scout_applied_total: number;
}

async function fetchJobDetail(jobId: string): Promise<JobDetail | null> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('job_postings')
    .select(
      `
      *,
      company_accounts (
        company_name
      ),
      company_groups (
        group_name
      )
    `
    )
    .eq('id', jobId)
    .single();

  if (error) {
    console.error('Error fetching job detail:', error);
    return null;
  }

  return data as JobDetail;
}

async function fetchScoutStats(jobId: string): Promise<ScoutStats> {
  const supabase = getSupabaseAdminClient();

  const now = new Date();
  const date7DaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const date30DaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // スカウト送信数（メッセージテーブルから）
  const { data: scoutMessages, error: scoutError } = await supabase
    .from('messages')
    .select('sent_at, read_at, status')
    .eq('message_type', 'SCOUT')
    .in(
      'room_id',
      (
        await supabase
          .from('rooms')
          .select('id')
          .eq('related_job_posting_id', jobId)
      ).data?.map(room => room.id) || []
    );

  if (scoutError) {
    console.error('Error fetching scout messages:', scoutError);
  }

  // 応募数（applicationテーブルから）
  const { data: applications, error: appError } = await supabase
    .from('application')
    .select('created_at, status')
    .eq('job_posting_id', jobId);

  if (appError) {
    console.error('Error fetching applications:', appError);
  }

  const scoutMessagesData = scoutMessages || [];
  const applicationsData = applications || [];

  // 統計を計算
  const stats = {
    scout_sent_7d: scoutMessagesData.filter(
      m => new Date(m.sent_at) >= date7DaysAgo
    ).length,
    scout_opened_7d: scoutMessagesData.filter(
      m => m.read_at && new Date(m.read_at) >= date7DaysAgo
    ).length,
    scout_replied_7d: scoutMessagesData.filter(
      m => m.status === 'REPLIED' && new Date(m.sent_at) >= date7DaysAgo
    ).length,
    scout_applied_7d: applicationsData.filter(
      a => new Date(a.created_at) >= date7DaysAgo
    ).length,

    scout_sent_30d: scoutMessagesData.filter(
      m => new Date(m.sent_at) >= date30DaysAgo
    ).length,
    scout_opened_30d: scoutMessagesData.filter(
      m => m.read_at && new Date(m.read_at) >= date30DaysAgo
    ).length,
    scout_replied_30d: scoutMessagesData.filter(
      m => m.status === 'REPLIED' && new Date(m.sent_at) >= date30DaysAgo
    ).length,
    scout_applied_30d: applicationsData.filter(
      a => new Date(a.created_at) >= date30DaysAgo
    ).length,

    scout_sent_total: scoutMessagesData.length,
    scout_opened_total: scoutMessagesData.filter(m => m.read_at).length,
    scout_replied_total: scoutMessagesData.filter(m => m.status === 'REPLIED')
      .length,
    scout_applied_total: applicationsData.length,
  };

  return stats;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { job_id } = await params;
  const [jobDetail, scoutStats] = await Promise.all([
    fetchJobDetail(job_id),
    fetchScoutStats(job_id),
  ]);

  if (!jobDetail) {
    return (
      <div className='p-8 bg-gray-50 min-h-screen'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mt-20'>
            <h1 className='text-2xl font-bold text-gray-900 mb-4'>
              求人が見つかりません
            </h1>
            <Link href='/admin/job'>
              <Button variant='green-gradient'>求人一覧に戻る</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const _getStatusColor = (status: string) => {
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

  const calculateRate = (numerator: number, denominator: number) => {
    if (denominator === 0) return '0%';
    return `${Math.round((numerator / denominator) * 100)}%`;
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
    <div className='bg-gray-50 min-h-screen'>
      <div className='mx-auto'>
        {/* 上部テーブル */}
        <div className='mb-6 flex-col justify-center w-full'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>求人分析</h2>

          <table className='border-collapse border border-gray-400'>
            <tbody>
              <tr>
                <td className="w-[176px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]"></td>
                <td className="w-[176px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]">
                  スカウト送信数
                </td>
                <td className="w-[176px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]">
                  開封数
                </td>
                <td className="w-[176px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]">
                  返信数(返信率)
                </td>
                <td className="w-[176px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]">
                  応募数(応募率)
                </td>
              </tr>
              <tr>
                <td className="w-[176px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#666666]">
                  過去7日合計
                </td>
                <td className="w-[176px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  {scoutStats.scout_sent_7d}
                </td>
                <td className="w-[176px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  {scoutStats.scout_opened_7d}
                </td>
                <td className="w-[176px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  {scoutStats.scout_replied_7d} (
                  {calculateRate(
                    scoutStats.scout_replied_7d,
                    scoutStats.scout_sent_7d
                  )}
                  )
                </td>
                <td className="w-[176px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  {scoutStats.scout_applied_7d} (
                  {calculateRate(
                    scoutStats.scout_applied_7d,
                    scoutStats.scout_sent_7d
                  )}
                  )
                </td>
              </tr>
              <tr>
                <td className="w-[176px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#666666]">
                  過去30日合計
                </td>
                <td className="w-[176px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  {scoutStats.scout_sent_30d}
                </td>
                <td className="w-[176px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  {scoutStats.scout_opened_30d}
                </td>
                <td className="w-[176px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  {scoutStats.scout_replied_30d} (
                  {calculateRate(
                    scoutStats.scout_replied_30d,
                    scoutStats.scout_sent_30d
                  )}
                  )
                </td>
                <td className="w-[176px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  {scoutStats.scout_applied_30d} (
                  {calculateRate(
                    scoutStats.scout_applied_30d,
                    scoutStats.scout_sent_30d
                  )}
                  )
                </td>
              </tr>
              <tr>
                <td className="w-[176px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#666666]">
                  累計
                </td>
                <td className="w-[176px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  {scoutStats.scout_sent_total}
                </td>
                <td className="w-[176px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  {scoutStats.scout_opened_total}
                </td>
                <td className="w-[176px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  {scoutStats.scout_replied_total} (
                  {calculateRate(
                    scoutStats.scout_replied_total,
                    scoutStats.scout_sent_total
                  )}
                  )
                </td>
                <td className="w-[176px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  {scoutStats.scout_applied_total} (
                  {calculateRate(
                    scoutStats.scout_applied_total,
                    scoutStats.scout_sent_total
                  )}
                  )
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 選考メモセクション */}
        <div className='w-full mb-[37px]'>
          <div className='flex items-start gap-8'>
            <div className='w-[200px] flex-shrink-0'>
              <label className='block text-[16px] font-bold text-gray-900'>
                選考メモ
              </label>
            </div>
            <div className='flex-1'>
              <div className='w-full px-4 py-3 min-h-[100px] text-gray-900 whitespace-pre-wrap'>
                メモが入力されていません
              </div>
            </div>
          </div>
        </div>

        <div className='bg-[#f9f9f9] w-[900px]'>
          <div className='flex items-start justify-between'>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              {jobDetail.title}
            </h1>
          </div>

          <div className='p-6'>
            {/* 求人詳細セクション（company/job/newの確認ページと同じデザイン） */}
            <div className=''>
              <h2 className='text-lg font-semibold text-gray-900 mb-6'>
                求人詳細
              </h2>

              {/* 会社名 */}
              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    会社名
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                  <DisplayValue
                    value={jobDetail.company_accounts?.company_name || '不明'}
                  />
                </div>
              </div>

              {/* ステータス・公開タイプ */}
              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    ステータス
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                  <div className='flex gap-4'>
                    <DisplayValue
                      value={statusMap[jobDetail.status] || jobDetail.status}
                    />
                    <DisplayValue
                      value={`(${publicationTypeMap[jobDetail.publication_type] || jobDetail.publication_type})`}
                    />
                  </div>
                </div>
              </div>

              {/* 職種 */}
              {jobDetail.job_type && jobDetail.job_type.length > 0 && (
                <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                  <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      職種
                    </div>
                  </div>
                  <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                    <TagDisplay items={jobDetail.job_type} />
                  </div>
                </div>
              )}

              {/* 業種 */}
              {jobDetail.industry && jobDetail.industry.length > 0 && (
                <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                  <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      業種
                    </div>
                  </div>
                  <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                    <TagDisplay items={jobDetail.industry} />
                  </div>
                </div>
              )}

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
                      value={jobDetail.job_description}
                      className='whitespace-pre-wrap'
                    />
                  </div>
                  {/* 当ポジションの魅力 */}
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
                    <DisplayValue
                      value={jobDetail.required_skills || ''}
                      className='whitespace-pre-wrap'
                    />
                  </div>
                  {/* その他・求める人物像など */}
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
                      {jobDetail.salary_min && jobDetail.salary_max
                        ? formatSalary(
                            jobDetail.salary_min,
                            jobDetail.salary_max
                          )
                        : '未設定'}
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
                      value={jobDetail.working_hours || ''}
                      className='whitespace-pre-wrap'
                    />
                  </div>
                  {/* 休日・休暇 */}
                  <div className='w-full'>
                    <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                      休日・休暇
                    </label>
                    <DisplayValue
                      value={jobDetail.holidays || ''}
                      className='whitespace-pre-wrap'
                    />
                  </div>
                </div>
              </div>

              {/* 選考情報 */}
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

              {/* アピールポイント */}
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

            {/* 基本情報 */}
            <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
              <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                  基本情報
                </div>
              </div>
              <div className='flex-1 flex flex-col gap-8 items-start justify-start px-0 py-6'>
                {/* 作成日時 */}
                <div className='w-full'>
                  <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                    作成日時
                  </label>
                  <DisplayValue
                    value={new Date(jobDetail.created_at).toLocaleString(
                      'ja-JP'
                    )}
                  />
                </div>
                {/* 更新日時 */}
                <div className='w-full'>
                  <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                    更新日時
                  </label>
                  <DisplayValue
                    value={new Date(jobDetail.updated_at).toLocaleString(
                      'ja-JP'
                    )}
                  />
                </div>
                {/* 雇用形態 */}
                <div className='w-full'>
                  <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                    雇用形態
                  </label>
                  <DisplayValue value={jobDetail.employment_type} />
                </div>
                {/* 勤務地 */}
                <div className='w-full'>
                  <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                    勤務地
                  </label>
                  <DisplayValue
                    value={
                      jobDetail.work_location &&
                      jobDetail.work_location.length > 0
                        ? jobDetail.work_location.join('、')
                        : '未設定'
                    }
                  />
                </div>
              </div>
            </div>

            <div className='mt-8 pt-8 border-t flex justify-center gap-4'>
              <Link href='/admin/job'>
                <Button
                  variant='green-outline'
                  size='figma-outline'
                  className='px-10 py-3 rounded-[32px] border-[#0f9058] text-[#0f9058] bg-white hover:bg-[#0f9058]/10'
                >
                  編集する
                </Button>
              </Link>
              <Link href={`/admin/job/${job_id}/edit`}>
                <Button
                  variant='green-gradient'
                  size='figma-default'
                  className='px-10 py-3 rounded-[32px] bg-gradient-to-r from-[#198D76] to-[#1CA74F] text-white'
                >
                  求人承認/非承認
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
