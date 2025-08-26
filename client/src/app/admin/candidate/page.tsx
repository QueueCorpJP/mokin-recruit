import CandidateClient from './CandidateClient';
import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export type CandidateListItem = {
  id: string;
  last_login_at: string | null;
  last_name: string;
  first_name: string;
  current_position: string | null;
  gender: 'male' | 'female' | 'unspecified' | null;
  birth_date: string | null;
  desired_salary: string | null;
  phone_number: string | null;
  email: string;
  current_residence: string | null;
};

async function fetchAdminCandidateList(): Promise<CandidateListItem[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('candidates')
    .select(
      `
      id,
      last_login_at,
      last_name,
      first_name,
      current_position,
      gender,
      birth_date,
      desired_salary,
      phone_number,
      email,
      current_residence
    `
    )
    .order('last_login_at', { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return data as unknown as CandidateListItem[];
}

export default async function CandidatePage() {
  const candidates = await fetchAdminCandidateList();
  return <CandidateClient candidates={candidates} />;
}
