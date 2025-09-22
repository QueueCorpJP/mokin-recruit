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
      industry,
      company_overview,
      status,
      created_at,
      updated_at,
      plan,
      appeal_points,
      logo_url,
      image_urls,
      company_users (
        id,
        full_name,
        position_title,
        email,
        last_login_at
      ),
      company_groups (
        id,
        group_name,
        created_at
      )
    `
    )
    .eq('id', id)
    .single();

  if (data) {
    console.log(
      `[Company Edit] Successfully fetched company: ${data.company_name}, Plan: ${data.plan}`
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
    representative_position: null,
    industries: null,
    business_content: null,
    established_year: null,
    capital_amount: null,
    capital_unit: null,
    employees_count: null,
    prefecture: null,
    address: null,
    company_phase: null,
    company_urls: null,
    icon_image_url: data.logo_url || null,
    company_images: data.image_urls || null,
    company_attractions: null,
    logo_image_path: data.logo_url || null,
    contract_plan: null,
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
