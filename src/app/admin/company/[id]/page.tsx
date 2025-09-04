import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { notFound } from 'next/navigation';
import CompanyDetailClient from './CompanyDetailClient';
import type { CompanyEditData } from './edit/page';

// 動的レンダリングを強制（企業編集後の最新データを確実に取得するため）
export const dynamic = 'force-dynamic';

async function fetchCompanyById(id: string): Promise<CompanyEditData | null> {
  const supabase = getSupabaseAdminClient();

  console.log(`[Company Detail] Fetching company data for ID: ${id}`);

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
        updated_at
      )
    `)
    .eq('id', id)
    .single();

  if (data) {
    console.log(`[Company Detail] Successfully fetched company: ${data.company_name}, Plan: ${data.plan}`);
  }

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
