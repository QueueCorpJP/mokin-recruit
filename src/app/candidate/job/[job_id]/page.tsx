import { notFound } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { Metadata } from 'next';
import { JobDetailView } from './JobDetailView';

interface PageProps {
  params: {
    job_id: string;
  };
}

// Job posting の型定義（データベーススキーマに基づく）
interface JobPostingDetail {
  id: string;
  title: string;
  job_description: string;
  position_summary?: string;
  salary_min?: number;
  salary_max?: number;
  salary_note?: string;
  employment_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
  employment_type_note?: string;
  working_hours?: string;
  overtime_info?: string;
  holidays?: string;
  remote_work_available?: boolean;
  required_skills?: string;
  preferred_skills?: string;
  selection_process?: string;
  appeal_points?: string[];
  smoking_policy?: string;
  smoking_policy_note?: string;
  required_documents?: string[];
  location_note?: string;
  work_location?: string[];
  job_type?: string[];
  industry?: string[];
  image_urls?: string[];
  published_at?: string;
  created_at: string;
  updated_at: string;
  company_account: {
    id: string;
    company_name: string;
    industry: string;
    headquarters_address?: string;
    company_overview?: string;
  } | null;
  company_group: {
    id: string;
    group_name: string;
    description?: string;
  } | null;
}

async function getJobDetail(jobId: string): Promise<JobPostingDetail | null> {
  const supabase = await getSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from('job_postings')
      .select(`
        id,
        title,
        job_description,
        position_summary,
        salary_min,
        salary_max,
        salary_note,
        employment_type,
        employment_type_note,
        working_hours,
        overtime_info,
        holidays,
        remote_work_available,
        required_skills,
        preferred_skills,
        selection_process,
        appeal_points,
        smoking_policy,
        smoking_policy_note,
        required_documents,
        location_note,
        work_location,
        job_type,
        industry,
        image_urls,
        published_at,
        created_at,
        updated_at,
        company_account:company_accounts!company_account_id (
          id,
          company_name,
          industry,
          headquarters_address,
          company_overview
        ),
        company_group:company_groups!company_group_id (
          id,
          group_name,
          description
        )
      `)
      .eq('id', jobId)
      .eq('status', 'PUBLISHED') // 公開されている求人のみ取得
      .single();

    if (error) {
      console.error('Error fetching job detail:', error);
      return null;
    }

    return data as JobPostingDetail;
  } catch (error) {
    console.error('Unexpected error fetching job detail:', error);
    return null;
  }
}

// 共有キャッシュで重複取得を避ける
const jobDetailCache = new Map<string, JobPostingDetail | null>();

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // キャッシュから取得、なければDBから取得
  let jobDetail = jobDetailCache.get(params.job_id);
  if (!jobDetail && jobDetail !== null) {
    jobDetail = await getJobDetail(params.job_id);
    jobDetailCache.set(params.job_id, jobDetail);
  }

  if (!jobDetail) {
    return {
      title: '求人が見つかりません',
      description: 'お探しの求人情報が見つかりません。',
    };
  }

  const companyName = jobDetail.company_account?.company_name || '企業名不明';
  const description = jobDetail.position_summary || jobDetail.job_description.slice(0, 160);

  return {
    title: `${jobDetail.title} - ${companyName} | 求人詳細`,
    description: description,
    keywords: [
      jobDetail.title,
      companyName,
      ...(jobDetail.job_type || []),
      ...(jobDetail.industry || []),
      ...(jobDetail.work_location || []),
    ],
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  // キャッシュから取得、なければDBから取得
  let jobDetail = jobDetailCache.get(params.job_id);
  if (!jobDetail && jobDetail !== null) {
    jobDetail = await getJobDetail(params.job_id);
    jobDetailCache.set(params.job_id, jobDetail);
  }

  if (!jobDetail) {
    notFound();
  }

  // キャッシュをクリアしてメモリリークを防ぐ
  jobDetailCache.delete(params.job_id);

  return <JobDetailView jobDetail={jobDetail} />;
}