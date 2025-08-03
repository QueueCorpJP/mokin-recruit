'use server'

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export interface JobDetailData {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  images: string[];
  jobTypes: string[];
  industries: string[];
  jobDescription: string;
  positionSummary: string;
  skills: string;
  otherRequirements: string;
  salaryMin?: string;
  salaryMax?: string;
  salaryNote?: string;
  locations: string[];
  locationNote?: string;
  employmentType: string;
  employmentTypeNote?: string;
  workingHours: string;
  overtime: string;
  overtimeMemo?: string;
  holidays: string;
  selectionProcess: string;
  appealPoints: {
    business: string[];
    company: string[];
    team: string[];
    workstyle: string[];
  };
  smoke: string;
  resumeRequired: string[];
  requiredDocuments: string[];
  // 企業情報
  representative: string;
  establishedYear: string;
  capital: string;
  employeeCount: string;
  industry: string;
  businessContent: string;
  address: string;
  companyPhase: string;
  website: string;
}

// Server Component用のgetJobDetail実装（直接データベースアクセス）
async function getJobDetailServer(jobId: string) {
  try {
    const supabase = getSupabaseAdminClient();
    
    // 求人詳細を取得（必要フィールドのみ）
    const { data: job, error: jobError } = await supabase
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
        work_location,
        job_type,
        industry,
        appeal_points,
        required_documents,
        image_urls,
        company_account_id,
        status
      `)
      .eq('id', jobId)
      .eq('status', 'PUBLISHED')
      .in('publication_type', ['public', 'members'])
      .maybeSingle();

    if (jobError || !job) {
      console.error('Failed to fetch job:', jobError);
      throw new Error('求人情報が見つかりませんでした');
    }

    // 会社情報を取得
    const { data: company, error: companyError } = await supabase
      .from('company_accounts')
      .select(`
        id,
        company_name,
        representative_name,
        industry,
        company_overview,
        headquarters_address,
        status,
        created_at,
        updated_at
      `)
      .eq('id', job.company_account_id)
      .maybeSingle();

    if (companyError) {
      console.error('Failed to fetch company:', companyError);
    }

    if (!company) {
      console.warn(`Company not found for job ${jobId}, company_account_id: ${job.company_account_id}`);
    }

    // 求人データに会社情報を追加
    const jobWithCompany = {
      ...job,
      company_name: company?.company_name || '企業名未設定',
      // 会社情報
      representative_name: company?.representative_name,
      company_industry: company?.industry,
      company_overview: company?.company_overview,
      headquarters_address: company?.headquarters_address,
      company_status: company?.status
    };

    return {
      success: true,
      data: jobWithCompany
    };
  } catch (error) {
    console.error('Failed to fetch job detail from database:', error);
    throw error;
  }
}

export async function getJobDetailData(jobId: string): Promise<JobDetailData | null> {
  try {
    const response = await getJobDetailServer(jobId);
    if (response.success && response.data) {
      // APIデータを詳細ページのデータ構造にマッピング
      const apiJob = response.data;
      const mappedJobData: JobDetailData = {
        id: apiJob.id,
        title: apiJob.title || '求人タイトル未設定',
        companyName: apiJob.company_name || '企業名未設定',
        companyLogo: apiJob.image_urls?.[0],
        images: apiJob.image_urls || ['/company.jpg'],
        jobTypes: Array.isArray(apiJob.job_type)
          ? apiJob.job_type
          : [apiJob.job_type || '職種未設定'],
        industries: Array.isArray(apiJob.industry)
          ? apiJob.industry
          : [apiJob.industry || '業種未設定'],
        jobDescription: apiJob.job_description || 'テキストが入ります。',
        positionSummary: apiJob.position_summary || 'テキストが入ります。',
        skills: apiJob.required_skills || 'テキストが入ります。',
        otherRequirements:
          apiJob.preferred_skills || 'テキストが入ります。',
        salaryMin: apiJob.salary_min?.toString() || '応相談',
        salaryMax: apiJob.salary_max?.toString() || '応相談',
        salaryNote: apiJob.salary_note || 'テキストが入ります。',
        locations: Array.isArray(apiJob.work_location)
          ? apiJob.work_location
          : [apiJob.work_location || '勤務地未設定'],
        locationNote: apiJob.location_note || 'テキストが入ります。',
        employmentType: apiJob.employment_type || 'テキストが入ります。',
        employmentTypeNote:
          apiJob.employment_type_note || 'テキストが入ります。',
        workingHours: apiJob.working_hours || 'テキストが入ります。',
        overtime: apiJob.overtime,
        overtimeMemo: apiJob.overtime_info,
        holidays: apiJob.holidays || 'テキストが入ります。',
        selectionProcess:
          apiJob.selection_process || 'テキストが入ります。',
        appealPoints: {
          business: Array.isArray(apiJob.appeal_points?.business)
            ? apiJob.appeal_points.business
            : ['CxO候補', '新規事業立ち上げ'],
          company: Array.isArray(apiJob.appeal_points?.company)
            ? apiJob.appeal_points.company
            : ['成長フェーズ', '上場準備中'],
          team: Array.isArray(apiJob.appeal_points?.team)
            ? apiJob.appeal_points.team
            : ['少数精鋭', '代表と距離が近い'],
          workstyle: Array.isArray(apiJob.appeal_points?.workstyle)
            ? apiJob.appeal_points.workstyle
            : ['フレックス制度', 'リモートあり'],
        },
        smoke: apiJob.smoking_policy || '屋内禁煙',
        resumeRequired: Array.isArray(apiJob.required_documents)
          ? apiJob.required_documents
          : ['履歴書の提出が必須', '職務経歴書の提出が必須'],
        requiredDocuments: Array.isArray(apiJob.required_documents)
          ? apiJob.required_documents
          : [],
        // 企業情報
        representative: apiJob.representative_name || 'テキストが入ります。',
        establishedYear: '2020', // データベースに存在しない項目のため固定値
        capital: '100', // データベースに存在しない項目のため固定値
        employeeCount: '100', // データベースに存在しない項目のため固定値
        industry:
          apiJob.company_industry || 'テキスト1、テキスト2、テキスト3',
        businessContent: apiJob.company_overview || 'テキストが入ります。',
        address: apiJob.headquarters_address || '都道府県テキスト\nテキストが入ります。',
        companyPhase: 'テキストが入ります。', // データベースに存在しない項目のため固定値
        website: 'URLタイトルテキスト https://', // データベースに存在しない項目のため固定値
      };
      return mappedJobData;
    } else {
      console.error('Failed to fetch job data: Invalid response');
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch job data:', error);
    return null;
  }
}