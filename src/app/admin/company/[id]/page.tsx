import React from 'react';
import { createServerAdminClient } from '@/lib/supabase/server-admin';
import { notFound } from 'next/navigation';
import CompanyDetailClient from './CompanyDetailClient';
import type { CompanyEditData } from './edit/page';

// 動的レンダリングを強制（企業編集後の最新データを確実に取得するため）
export const dynamic = 'force-dynamic';

async function fetchCompanyById(id: string): Promise<CompanyEditData | null> {
  // 直接サービスロールキーを使用してRLSの問題を回避
  const supabase = createServerAdminClient();

  console.log(`[Company Detail] Fetching company data for ID: ${id}`);

  // Step 1: Get basic company data
  const { data: companyData, error: companyError } = await supabase
    .from('company_accounts')
    .select(`
      id,
      company_name,
      headquarters_address,
      representative_name,
      industry,
      company_overview,
      status,
      created_at,
      updated_at,
      plan
    `)
    .eq('id', id)
    .single();

  if (companyError) {
    console.error('Company fetch error:', companyError);
    throw new Error(companyError.message);
  }

  console.log(`[Company Detail] Found company: ${companyData.company_name}`);

  // Step 2: Get groups separately with explicit permissions
  const { data: groupsData, error: groupsError } = await supabase
    .from('company_groups')
    .select(`
      id,
      group_name,
      description,
      created_at,
      updated_at,
      company_user_group_permissions (
        id,
        permission_level,
        company_users (
          id,
          full_name,
          email,
          position_title,
          last_login_at
        )
      )
    `)
    .eq('company_account_id', id);

  if (groupsError) {
    console.error('Groups fetch error:', groupsError);
    // Continue with empty groups if fetch fails
    console.warn('Continuing with empty groups due to fetch error');
  }

  console.log(`[Company Detail] Found ${groupsData?.length || 0} groups`);

  // Step 3: Get message and application counts for each group
  const groupTicketData: { [groupId: string]: { messageCount: number; applicationCount: number } } = {};

  if (groupsData && groupsData.length > 0) {
    for (const group of groupsData) {
      // Count messages for this group
      const { count: messageCount, error: messageError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('company_group_id', group.id);

      // Count applications for this group
      const { count: applicationCount, error: applicationError } = await supabase
        .from('application')
        .select('*', { count: 'exact', head: true })
        .eq('company_group_id', group.id);

      groupTicketData[group.id] = {
        messageCount: messageCount || 0,
        applicationCount: applicationCount || 0
      };

      console.log(`[Company Detail] Group ${group.group_name}: messages=${messageCount || 0}, applications=${applicationCount || 0}`);
    }
  }

  // Combine the data
  const combinedData = {
    ...companyData,
    company_groups: groupsData || []
  };

  // 存在しないフィールドにデフォルト値を設定
  const finalCompanyData: CompanyEditData = {
    ...combinedData,
    appeal_points: null,
    logo_image_path: null,
    contract_plan: null,
    company_users: [],
    company_groups: combinedData.company_groups || [],
    groupTicketData
  };

  console.log(`[Company Detail] Successfully fetched company: ${finalCompanyData.company_name}`);
  console.log(`[Company Detail] Company groups:`, finalCompanyData.company_groups?.map(group => ({
    id: group.id,
    name: group.group_name,
    memberCount: group.company_user_group_permissions?.length || 0,
    members: group.company_user_group_permissions?.map(perm => ({
      id: perm.id,
      permission: perm.permission_level,
      user: perm.company_users ? {
        id: perm.company_users.id,
        name: perm.company_users.full_name,
        email: perm.company_users.email
      } : null
    })) || []
  })));

  return finalCompanyData;
}

interface CompanyDetailPageProps {
  params: {
    id: string;
  };
  searchParams?: {
    refresh?: string;
  };
}

export default async function CompanyDetailPage({ params, searchParams }: CompanyDetailPageProps) {
  // refreshパラメータがある場合はログ出力（デバッグ用）
  if (searchParams?.refresh) {
    console.log(`[Company Detail Page] Refresh requested at: ${searchParams.refresh}`);
  }

  const company = await fetchCompanyById(params.id);

  if (!company) {
    notFound();
  }

  return <CompanyDetailClient company={company} />;
}
