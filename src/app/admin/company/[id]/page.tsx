import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { notFound } from 'next/navigation';
import CompanyDetailClient from './CompanyDetailClient';
import type { CompanyEditData } from './edit/page';

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

interface CompanyDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const company = await fetchCompanyById(params.id);

  if (!company) {
    notFound();
  }

  return <CompanyDetailClient company={company} />;
}
