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
  industry: string;
  company_overview: string | null;
  appeal_points: string | null;
  logo_image_path: string | null;
  contract_plan: any;
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
  }>;
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
      appeal_points,
      logo_image_path,
      contract_plan,
      status,
      created_at,
      updated_at,
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
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching company:', error);
    return null;
  }

  return data as CompanyEditData;
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
