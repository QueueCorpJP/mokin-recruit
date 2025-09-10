import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { notFound } from 'next/navigation';
import CompanyEditClient from './CompanyEditClient';

// 動的レンダリングを強制（企業編集後の最新データを確実に取得するため）
export const dynamic = 'force-dynamic';

// 企業アカウントの詳細データ型
export interface CompanyEditData {
  id: string;
  company_name: string;
  headquarters_address: string | null;
  representative_name: string | null;
  industry: string;
  company_overview: string | null;
  appeal_points: string | null;
  logo_image_path: string | null;
  contract_plan: any;
  plan: string;
  status: string;
  created_at: string;
  updated_at: string;
  company_users: Array<{
    id: string;
    full_name: string;
    position_title: string | null;
    email: string;
    last_login_at: string | null;
  }>;
  company_groups: Array<{
    id: string;
    group_name: string;
    created_at: string;
    updated_at: string;
    description: string | null;
  }>;
  groupTicketData?: Record<string, { messageCount: number; applicationCount: number }>;
}

async function fetchCompanyById(id: string): Promise<CompanyEditData | null> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
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
      plan,
      company_groups (
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
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching company:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      details: error.details
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
    company_groups: data.company_groups || []
  };

  return companyData;
}

interface CompanyEditPageProps {
  params: {
    id: string;
  };
}

export default async function CompanyEditPage({ params }: CompanyEditPageProps) {
  const company = await fetchCompanyById(params.id);

  if (!company) {
    notFound();
  }

  return <CompanyEditClient company={company} />;
}
