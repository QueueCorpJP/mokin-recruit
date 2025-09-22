import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { notFound } from 'next/navigation';
import CompanyDetailClient from './CompanyDetailClient';
import type { CompanyEditData } from './edit/page';

// 動的レンダリングを強制（企業編集後の最新データを確実に取得するため）
export const dynamic = 'force-dynamic';

// 企業分析データの型定義
export interface CompanyAnalyticsData {
  past7Days: {
    scoutSends: number;
    opens: number;
    openRate: number;
    replies: number;
    replyRate: number;
    applications: number;
    applicationRate: number;
  };
  past30Days: {
    scoutSends: number;
    opens: number;
    openRate: number;
    replies: number;
    replyRate: number;
    applications: number;
    applicationRate: number;
  };
  total: {
    scoutSends: number;
    opens: number;
    openRate: number;
    replies: number;
    replyRate: number;
    applications: number;
    applicationRate: number;
  };
}

async function fetchCompanyAnalytics(
  companyId: string
): Promise<CompanyAnalyticsData> {
  const supabase = getSupabaseAdminClient();

  // 7日前、30日前の日付を計算
  const now = new Date();
  const past7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // 企業のグループIDを取得
  const { data: groupData, error: groupError } = await supabase
    .from('company_groups')
    .select('id')
    .eq('company_account_id', companyId);

  if (groupError) {
    console.error('Error fetching company groups:', groupError);
  }

  const groupIds = groupData?.map(g => g.id) || [];

  // スカウトメッセージデータを取得（messagesテーブルから）
  const { data: scoutData, error: scoutError } = await supabase
    .from('messages')
    .select('id, sent_at, read_at, status, sender_company_group_id')
    .eq('message_type', 'SCOUT')
    .eq('sender_type', 'COMPANY_USER')
    .in('sender_company_group_id', groupIds);

  if (scoutError) {
    console.error('Error fetching scout messages:', scoutError);
  }

  // 応募データを取得
  const { data: applicationData, error: applicationError } = await supabase
    .from('application')
    .select('id, created_at, company_account_id')
    .eq('company_account_id', companyId);

  if (applicationError) {
    console.error('Error fetching application data:', applicationError);
  }

  const scouts = scoutData || [];
  const applications = applicationData || [];

  // 期間別の集計を行う
  const calculate = (startDate?: Date) => {
    const filteredScouts = startDate
      ? scouts.filter(s => s.sent_at && new Date(s.sent_at) >= startDate)
      : scouts;

    const filteredApplications = startDate
      ? applications.filter(
          a => a.created_at && new Date(a.created_at) >= startDate
        )
      : applications;

    const scoutSends = filteredScouts.length;
    const opens = filteredScouts.filter(s => s.read_at).length;
    const replies = filteredScouts.filter(s => s.status === 'REPLIED').length;
    const applicationCount = filteredApplications.length;

    const openRate =
      scoutSends > 0 ? Math.round((opens / scoutSends) * 100) : 0;
    const replyRate =
      scoutSends > 0 ? Math.round((replies / scoutSends) * 100) : 0;
    const applicationRate =
      scoutSends > 0 ? Math.round((applicationCount / scoutSends) * 100) : 0;

    return {
      scoutSends,
      opens,
      openRate,
      replies,
      replyRate,
      applications: applicationCount,
      applicationRate,
    };
  };

  return {
    past7Days: calculate(past7Days),
    past30Days: calculate(past30Days),
    total: calculate(),
  };
}

async function fetchCompanyById(id: string): Promise<CompanyEditData | null> {
  const supabase = getSupabaseAdminClient();

  console.log(`[Company Detail] Fetching company data for ID: ${id}`);

  const { data, error } = await supabase
    .from('company_accounts')
    .select(
      `
      id,
      company_name,
      headquarters_address,
      representative_name,
      representative_position,
      industry,
      industries,
      company_overview,
      business_content,
      status,
      created_at,
      updated_at,
      plan,
      scout_limit,
      established_year,
      capital_amount,
      capital_unit,
      employees_count,
      prefecture,
      address,
      company_phase,
      company_urls,
      icon_image_url,
      company_images,
      company_attractions,
      company_groups (
        id,
        group_name,
        description,
        created_at,
        updated_at
      )
    `
    )
    .eq('id', id)
    .single();

  if (data) {
    console.log(
      `[Company Detail] Successfully fetched company: ${data.company_name}, Plan: ${data.plan}`
    );
  }

  if (error) {
    console.error('Error fetching company:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      details: error.details,
    });
    return null;
  }

  // 存在しないフィールドにデフォルト値を設定
  const companyData: CompanyEditData = {
    ...data,
    appeal_points: null,
    logo_image_path: null,
    contract_plan: null,
    company_users: [],
    company_groups: data.company_groups || [],
  };

  return companyData;
}

interface CompanyDetailPageProps {
  params: {
    id: string;
  };
  searchParams?: {
    refresh?: string;
  };
}

export default async function CompanyDetailPage({
  params,
  searchParams,
}: CompanyDetailPageProps) {
  // refreshパラメータがある場合はログ出力（デバッグ用）
  if (searchParams?.refresh) {
    console.log(
      `[Company Detail Page] Refresh requested at: ${searchParams.refresh}`
    );
  }

  // 企業データと分析データを並列で取得
  const [company, analytics] = await Promise.all([
    fetchCompanyById(params.id),
    fetchCompanyAnalytics(params.id),
  ]);

  if (!company) {
    notFound();
  }

  return <CompanyDetailClient company={company} analytics={analytics} />;
}
