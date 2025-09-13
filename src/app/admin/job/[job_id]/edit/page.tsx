import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import AdminJobEditClient from './AdminJobEditClient';
import { CompanyGroup } from '@/app/company/job/types';

interface JobEditPageProps {
  params: Promise<{
    job_id: string;
  }>;
}

interface JobDetail {
  id: string;
  title: string;
  company_group_id: string;
  company_accounts?: {
    company_name: string;
  };
  company_groups?: {
    group_name: string;
  };
  status: string;
  publication_type: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_note: string | null;
  work_location: string[] | null;
  location_note: string | null;
  job_type: string[] | null;
  industry: string[] | null;
  job_description: string;
  position_summary: string | null;
  required_skills: string | null;
  preferred_skills: string | null;
  employment_type: string;
  employment_type_note: string | null;
  working_hours: string | null;
  overtime: string | null;
  overtime_info: string | null;
  holidays: string | null;
  selection_process: string | null;
  appeal_points: string[] | null;
  smoking_policy: string | null;
  smoking_policy_note: string | null;
  required_documents: string[] | null;
  internal_memo: string | null;
  image_urls: string[] | null;
  created_at: string;
  updated_at: string;
}

async function fetchJobDetail(jobId: string): Promise<JobDetail | null> {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('job_postings')
    .select(`
      *,
      company_accounts (
        company_name
      ),
      company_groups (
        group_name
      )
    `)
    .eq('id', jobId)
    .single();

  if (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching job detail:', error);
    return null;
  }

  return data as JobDetail;
}

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

export default async function JobEditPage({ params }: JobEditPageProps) {
  const { job_id } = await params;
  
  const [jobDetail, companyGroups] = await Promise.all([
    fetchJobDetail(job_id),
    fetchCompanyGroups()
  ]);

  if (!jobDetail) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">求人が見つかりません</h1>
        <p>指定された求人が見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <AdminJobEditClient
          jobDetail={jobDetail}
          companyGroups={companyGroups}
          jobId={job_id}
        />
      </div>
    </div>
  );
}