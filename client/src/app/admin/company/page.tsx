import { getServerAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import CompanyClient from './CompanyClient';
import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import type { CompanyListItem } from './CompanyClient';

async function fetchAdminCompanyList(): Promise<CompanyListItem[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('company_accounts')
    .select(
      `
      id,
      company_name,
      plan,
      created_at,
      company_users (
        id,
        full_name,
        email,
        last_login_at
      ),
      company_groups (
        group_name,
        created_at
      )
    `
    )
    .order('created_at', { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return data as unknown as CompanyListItem[];
}

export default async function CompanyPage() {
 
  const companies = await fetchAdminCompanyList();
  return <CompanyClient companies={companies} />;
}
