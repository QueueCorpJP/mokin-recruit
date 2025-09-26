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

// スカウトログデータの型定義
export interface ScoutLogEntry {
  id: string;
  sent_at: string;
  sender_name: string;
  candidate_name: string;
  job_title?: string;
  status: string;
}

export interface ScoutLogData {
  logs: ScoutLogEntry[];
  remainingTickets: number;
  monthlyUsageByGroup: {
    [groupId: string]: {
      groupName: string;
      usage: number;
    };
  };
}

async function fetchScoutLogs(companyId: string): Promise<ScoutLogData> {
  const supabase = getSupabaseAdminClient();

  // 企業の残りチケット数を取得
  const { data: companyData } = await supabase
    .from('company_accounts')
    .select('remaining_tickets')
    .eq('id', companyId)
    .single();

  const remainingTickets = companyData?.remaining_tickets || 0;

  // 企業のグループIDを取得
  const { data: groupData } = await supabase
    .from('company_groups')
    .select('id, group_name')
    .eq('company_account_id', companyId);

  const groupIds = groupData?.map(g => g.id) || [];
  const groups = groupData || [];

  // 過去6ヶ月のスカウト送信ログを取得
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: scoutLogs } = await supabase
    .from('scout_sends')
    .select(
      `
      id,
      sent_at,
      sender_name,
      candidate_name,
      job_title,
      status,
      company_group_id
    `
    )
    .eq('company_account_id', companyId)
    .gte('sent_at', sixMonthsAgo.toISOString())
    .order('sent_at', { ascending: false })
    .limit(100);

  // 月次グループ別使用量を計算
  const currentMonth = new Date();
  const monthStart = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );

  const monthlyUsageByGroup: ScoutLogData['monthlyUsageByGroup'] = {};

  groups.forEach(group => {
    const groupLogs =
      scoutLogs?.filter(
        log =>
          log.company_group_id === group.id &&
          new Date(log.sent_at) >= monthStart
      ) || [];

    monthlyUsageByGroup[group.id] = {
      groupName: group.group_name,
      usage: groupLogs.length,
    };
  });

  return {
    logs: scoutLogs || [],
    remainingTickets,
    monthlyUsageByGroup,
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

  const groupIds = groupData?.map(g => g.id) || [];

  // スカウトメッセージデータを取得（messagesテーブルから）
  const { data: scoutData, error: scoutError } = await supabase
    .from('messages')
    .select('id, sent_at, read_at, status, sender_company_group_id')
    .eq('message_type', 'SCOUT')
    .eq('sender_type', 'COMPANY_USER')
    .in('sender_company_group_id', groupIds);

  // 応募データを取得
  const { data: applicationData, error: applicationError } = await supabase
    .from('application')
    .select('id, created_at, company_account_id')
    .eq('company_account_id', companyId);

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
        updated_at,
        company_user_group_permissions (
          permission_level,
          company_user_id,
          company_users (
            id,
            full_name,
            email,
            position_title
          )
        )
      )
    `
    )
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  // 存在しないフィールドにデフォルト値を設定
  const companyData: CompanyEditData = {
    ...data,
    appeal_points: data.company_attractions || null,
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
  // 企業データ、分析データ、スカウトログを並列で取得
  const [company, analytics, scoutLogs] = await Promise.all([
    fetchCompanyById(params.id),
    fetchCompanyAnalytics(params.id),
    fetchScoutLogs(params.id),
  ]);

  if (!company) {
    notFound();
  }

  return (
    <CompanyDetailClient
      company={company}
      analytics={analytics}
      scoutLogs={scoutLogs}
    />
  );
}
