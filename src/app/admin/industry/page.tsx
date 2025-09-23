import IndustryClient from './IndustryClient';
import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export type IndustryListItem = {
  id: string;
  name: string;
  candidate_count: number;
  company_count: number;
  created_at: string;
  updated_at: string;
};

async function fetchIndustryList(): Promise<IndustryListItem[]> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('custom_industries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as IndustryListItem[];
}

export default async function IndustryPage() {
  const industries = await fetchIndustryList();
  return <IndustryClient industries={industries} />;
}
