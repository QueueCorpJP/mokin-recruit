import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
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
  company_account_id: string | null;
  company_accounts?: {
    id: string;
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
  image_urls: string[] | null;
  smoking_policy: string | null;
  smoking_policy_note: string | null;
  required_documents: string[] | null;
  internal_memo: string | null;
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
  try {
    console.log('🔍 Attempting to fetch job detail for jobId:', jobId);

    // 環境変数を確認
    console.log('🔧 Environment check:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasAnonKey: !!(
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.SUPABASE_ANON_KEY
      ),
    });

    const supabase = getSupabaseAdminClient();
    console.log('✅ Supabase client created successfully');

    const { data, error } = await supabase
      .from('job_postings')
      .select(
        `
        *,
        company_accounts (
          id,
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
      console.error('❌ Supabase query error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return null;
    }

    console.log('✅ Job detail fetched successfully');
    return data as JobDetail;
  } catch (error) {
    console.error('❌ Fetch error (catch block):', {
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : String(error),
      type: error instanceof Error ? error.constructor.name : typeof error,
    });
    return null;
  }
}

async function fetchScoutStats(jobId: string): Promise<ScoutStats> {
  try {
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
      console.error('Error fetching scout messages:', {
        message: scoutError.message,
        details: scoutError.details,
        hint: scoutError.hint,
        code: scoutError.code,
      });
    }

    // 応募数（applicationテーブルから）
    const { data: applications, error: appError } = await supabase
      .from('application')
      .select('created_at, status')
      .eq('job_posting_id', jobId);

    if (appError) {
      console.error('Error fetching applications:', {
        message: appError.message,
        details: appError.details,
        hint: appError.hint,
        code: appError.code,
      });
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
  } catch (error) {
    console.error('Error fetching applications:', {
      message: 'TypeError: fetch failed',
      details: error instanceof Error ? error.stack : String(error),
      hint: '',
      code: '',
    });

    // エラーの場合はデフォルトの統計値を返す
    return {
      scout_sent_7d: 0,
      scout_opened_7d: 0,
      scout_replied_7d: 0,
      scout_applied_7d: 0,
      scout_sent_30d: 0,
      scout_opened_30d: 0,
      scout_replied_30d: 0,
      scout_applied_30d: 0,
      scout_sent_total: 0,
      scout_opened_total: 0,
      scout_replied_total: 0,
      scout_applied_total: 0,
    };
  }
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
      {/* 求人タイトルをブレッドクラム用に設定するスクリプト */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.jobTitle = ${JSON.stringify(jobDetail.title)};`,
        }}
      />
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

              {/* 求人ID */}
              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    求人ID
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                  <DisplayValue value={jobDetail.id} />
                </div>
              </div>

              {/* 承認状況 */}
              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    承認状況
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                  <DisplayValue
                    value={statusMap[jobDetail.status] || jobDetail.status}
                  />
                </div>
              </div>

              {/* 企業ID */}
              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    企業ID
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                  <DisplayValue
                    value={
                      jobDetail.company_account_id ||
                      jobDetail.company_accounts?.id ||
                      '不明'
                    }
                  />
                </div>
              </div>

              {/* 企業名 */}
              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    企業名
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                  <DisplayValue
                    value={jobDetail.company_accounts?.company_name || '不明'}
                  />
                </div>
              </div>

              {/* グループ */}
              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    グループ
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                  <DisplayValue
                    value={jobDetail.company_groups?.group_name || '不明'}
                  />
                </div>
              </div>

              {/* 公開範囲 */}
              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    公開範囲
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                  <DisplayValue
                    value={
                      publicationTypeMap[jobDetail.publication_type] ||
                      jobDetail.publication_type
                    }
                  />
                </div>
              </div>

              {/* 求人タイトル */}
              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    求人タイトル
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                  <DisplayValue value={jobDetail.title} />
                </div>
              </div>

              {/* イメージ画像 */}
              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    イメージ画像
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                  <div className='flex flex-wrap gap-4 items-center justify-start w-full'>
                    {jobDetail.image_urls && jobDetail.image_urls.length > 0 ? (
                      jobDetail.image_urls.map((url, idx) => (
                        <div
                          key={idx}
                          className='relative w-40 h-28 rounded-[5px] overflow-hidden bg-gray-100 flex items-center justify-center'
                        >
                          <Image
                            src={url}
                            alt={`preview-${idx}`}
                            width={160}
                            height={112}
                            className='object-cover'
                          />
                        </div>
                      ))
                    ) : (
                      <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#999999]">
                        写真が選択されていません
                      </div>
                    )}
                  </div>
                </div>
              </div>

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

              {/* 受動喫煙防止措置 */}
              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    受動喫煙防止措置
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                  <div className='flex flex-col gap-2 items-start justify-start w-full'>
                    <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      {jobDetail.smoking_policy || '未選択'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 応募時のレジュメ提出 */}
              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    応募時のレジュメ提出
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                  <div className='flex flex-col gap-4 items-start justify-start w-full'>
                    <div className='w-full mb-4'>
                      <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">
                        提出書類
                      </label>
                      <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                        {jobDetail.required_documents &&
                        jobDetail.required_documents.length > 0
                          ? jobDetail.required_documents.join('、')
                          : '未入力'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 社内メモ */}
              <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-8'>
                <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                  <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    社内メモ
                  </div>
                </div>
                <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                  <div className='flex flex-col gap-2 items-start justify-start w-full'>
                    <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap">
                      {jobDetail.internal_memo || '未入力'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* アクション（企業一覧に戻る ＋ 承認/非承認モーダル） */}
            {(() => {
              const JobDetailActions = dynamic(
                () => import('./JobDetailActions'),
                { ssr: false }
              );
              return (
                <JobDetailActions jobId={job_id} jobTitle={jobDetail.title} />
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
