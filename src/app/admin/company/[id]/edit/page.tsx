import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { notFound } from 'next/navigation';
import CompanyEditClient from './CompanyEditClient';

// 企業アカウントの詳細データ型
export interface CompanyEditData {
  id: string;
  company_name: string;
  headquarters_address: string | null;
  representative_name: string | null;
  representative_position: string | null;
  industry: string;
  industries: string[] | null;
  company_overview: string | null;
  business_content: string | null;
  appeal_points: string | null;
  logo_image_path: string | null;
  contract_plan: any;
  plan: string;
  scout_limit?: number;
  status: string;
  created_at: string;
  updated_at: string;
  established_year: string | null;
  capital_amount: string | null;
  capital_unit: string | null;
  employees_count: string | null;
  prefecture: string | null;
  address: string | null;
  company_phase: string | null;
  company_urls: any[] | null;
  icon_image_url: string | null;
  company_images: string[] | null;
  company_attractions: any[] | null;
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
    description: string | null;
    created_at: string;
    updated_at: string;
  }>;
}

async function fetchCompanyById(id: string): Promise<CompanyEditData | null> {
  const supabase = getSupabaseAdminClient();

  console.log(`[Company Edit] Fetching company data for ID: ${id}`);

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
      appeal_points,
      logo_image_path,
      contract_plan,
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
      company_users!company_account_id (
        id,
        full_name,
        position_title,
        email,
        last_login_at
      ),
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
      `[Company Edit] Successfully fetched company: ${data.company_name}, Plan: ${data.plan}`
    );
    console.log('[Company Edit] Available fields:', Object.keys(data));
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

  // すべてのフィールドを実際のデータから取得、存在しない場合はnullにする
  const companyData: CompanyEditData = {
    id: data.id,
    company_name: data.company_name || '',
    headquarters_address: data.headquarters_address || null,
    representative_name: data.representative_name || null,
    representative_position: data.representative_position || null,
    industry: data.industry || '',
    industries: data.industries || null,
    company_overview: data.company_overview || null,
    business_content: data.business_content || null,
    appeal_points: data.appeal_points || null,
    logo_image_path: data.logo_image_path || null,
    contract_plan: data.contract_plan || null,
    plan: data.plan || '',
    scout_limit: data.scout_limit || undefined,
    status: data.status || '',
    created_at: data.created_at || '',
    updated_at: data.updated_at || '',
    established_year: data.established_year || null,
    capital_amount: data.capital_amount || null,
    capital_unit: data.capital_unit || null,
    employees_count: data.employees_count || null,
    prefecture: data.prefecture || null,
    address: data.address || null,
    company_phase: data.company_phase || null,
    company_urls: data.company_urls || null,
    icon_image_url: data.icon_image_url || null,
    company_images: data.company_images || null,
    company_attractions: data.company_attractions || null,
    company_users: data.company_users || [],
    company_groups: data.company_groups || [],
  };

  return companyData;
}

interface CompanyEditPageProps {
  params: {
    id: string;
  };
}

export default async function CompanyEditPage({
  params,
}: CompanyEditPageProps) {
  const company = await fetchCompanyById(params.id);

  if (!company) {
    notFound();
  }

  return <CompanyEditClient company={company} />;
}
