import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import AdminJobNewClient from './JobNewClient';
import { CompanyGroup } from '@/app/company/job/types';

async function fetchCompanyGroups(): Promise<CompanyGroup[]> {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('company_groups')
    .select(`
      id,
      group_name,
      company_accounts (
        company_name
      )
    `)
    .order('group_name');

  if (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching company groups:', error);
    return [];
  }

  return data as CompanyGroup[];
}

export default async function AdminJobNewPage() {
  const companyGroups = await fetchCompanyGroups();

  return (
    <AdminJobNewClient 
      initialCompanyGroups={companyGroups}
    />
  );
}