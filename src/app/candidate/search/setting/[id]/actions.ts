'use server';

import { createClient } from '@/lib/supabase/client';

export interface JobDetailData {
  id: string;
  title: string;
  companyName: string;
  companyId: string;
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
// 初期表示に必要最小限のデータのみ取得して高速化
async function getJobDetailServer(jobId: string) {
  try {
    const supabase = createClient();

    // 求人詳細を取得（初期表示に必要最小限のフィールドのみ）
    const { data: job, error: jobError } = await supabase
      .from('job_postings')
      .select(
        `
        id,
        title,
        job_description,
        position_summary,
        required_skills,
        preferred_skills,
        salary_min,
        salary_max,
        salary_note,
        employment_type,
        employment_type_note,
        work_location,
        location_note,
        working_hours,
        overtime,
        overtime_info,
        holidays,
        selection_process,
        job_type,
        industry,
        appeal_points,
        required_documents,
        image_urls,
        smoking_policy,
        company_account_id,
        status
      `
      )
      .eq('id', jobId)
      .eq('status', 'PUBLISHED')
      .in('publication_type', ['public', 'members'])
      .maybeSingle();

    if (jobError || !job) {
      console.error('Failed to fetch job:', jobError);
      throw new Error('求人情報が見つかりませんでした');
    }

    // 会社情報は基本的な情報のみ取得（名前と基本情報）
    const { data: company, error: companyError } = await supabase
      .from('company_accounts')
      .select(
        `
        id,
        company_name,
        representative_name,
        representative_position,
        industry,
        industries,
        company_overview,
        business_content,
        headquarters_address,
        address,
        prefecture,
        established_year,
        capital_amount,
        capital_unit,
        employees_count,
        company_phase,
        company_urls,
        icon_image_url,
        company_images
      `
      )
      .eq('id', job.company_account_id)
      .maybeSingle();

    if (companyError) {
      console.error('Failed to fetch company:', companyError);
    }

    if (!company) {
      console.warn(
        `Company not found for job ${jobId}, company_account_id: ${job.company_account_id}`
      );
    }

    // 求人データに会社情報を追加
    const jobWithCompany = {
      ...job,
      company_name: company?.company_name || '企業名未設定',
      // 会社情報（最小限）
      representative_name: company?.representative_name,
      representative_position: company?.representative_position,
      company_industry: company?.industry,
      company_industries: company?.industries,
      company_overview: company?.company_overview,
      business_content: company?.business_content,
      headquarters_address: company?.headquarters_address,
      company_address: company?.address,
      company_prefecture: company?.prefecture,
      established_year: company?.established_year,
      capital_amount: company?.capital_amount,
      capital_unit: company?.capital_unit,
      employees_count: company?.employees_count,
      company_phase: company?.company_phase,
      company_urls: company?.company_urls,
      icon_image_url: company?.icon_image_url,
      company_images: company?.company_images,
    };

    return {
      success: true,
      data: jobWithCompany,
    };
  } catch (error) {
    console.error('Failed to fetch job detail from database:', error);
    throw error;
  }
}

export async function getJobDetailData(
  jobId: string
): Promise<JobDetailData | null> {
  try {
    // 高速化のため、並列処理は行わず単一クエリで必要データを取得
    const response = await getJobDetailServer(jobId);
    if (response.success && response.data) {
      // APIデータを詳細ページのデータ構造にマッピング
      const apiJob = response.data;
      const mappedJobData: JobDetailData = {
        id: apiJob.id,
        title: apiJob.title || '求人タイトル未設定',
        companyName: apiJob.company_name || '企業名未設定',
        companyId: apiJob.company_account_id,
        companyLogo: apiJob.icon_image_url || undefined,
        images:
          apiJob.company_images &&
          Array.isArray(apiJob.company_images) &&
          apiJob.company_images.length > 0
            ? apiJob.company_images
            : apiJob.image_urls || ['/company.jpg'],
        jobTypes: Array.isArray(apiJob.job_type)
          ? apiJob.job_type
          : [apiJob.job_type || '職種未設定'],
        industries: Array.isArray(apiJob.company_industries)
          ? apiJob.company_industries
          : Array.isArray(apiJob.industry)
            ? apiJob.industry
            : [apiJob.company_industry || apiJob.industry || '業種未設定'],
        jobDescription: apiJob.job_description || 'テキストが入ります。',
        positionSummary: apiJob.position_summary || 'テキストが入ります。',
        skills: apiJob.required_skills || 'テキストが入ります。',
        otherRequirements: apiJob.preferred_skills || 'テキストが入ります。',
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
        selectionProcess: apiJob.selection_process || 'テキストが入ります。',
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
        // 企業情報（データベースから取得した実際の値を使用）
        representative: (() => {
          const name = apiJob.representative_name || '';
          const position = apiJob.representative_position || '';
          if (name && position) return `${position} ${name}`;
          if (name) return name;
          if (position) return position;
          return '代表者未設定';
        })(),
        establishedYear: apiJob.established_year
          ? apiJob.established_year.toString()
          : '未設定',
        capital: (() => {
          if (apiJob.capital_amount && apiJob.capital_amount > 0) {
            const unit = apiJob.capital_unit || '万円';
            return `${apiJob.capital_amount}${unit}`;
          }
          return '未設定';
        })(),
        employeeCount: apiJob.employees_count
          ? apiJob.employees_count.toString()
          : '未設定',
        industry: (() => {
          if (
            apiJob.company_industries &&
            Array.isArray(apiJob.company_industries) &&
            apiJob.company_industries.length > 0
          ) {
            return apiJob.company_industries.join('、');
          }
          if (apiJob.company_industry && apiJob.company_industry.trim()) {
            return apiJob.company_industry;
          }
          return '業種未設定';
        })(),
        businessContent: (() => {
          if (apiJob.business_content && apiJob.business_content.trim()) {
            return apiJob.business_content;
          }
          if (apiJob.company_overview && apiJob.company_overview.trim()) {
            return apiJob.company_overview;
          }
          return '事業内容未設定';
        })(),
        address: (() => {
          if (apiJob.company_address && apiJob.company_address.trim()) {
            return apiJob.company_address;
          }
          if (
            apiJob.headquarters_address &&
            apiJob.headquarters_address.trim()
          ) {
            return apiJob.headquarters_address;
          }
          if (apiJob.company_prefecture && apiJob.company_prefecture.trim()) {
            return apiJob.company_prefecture;
          }
          return '所在地未設定';
        })(),
        companyPhase: apiJob.company_phase || '未設定',
        website: (() => {
          if (
            apiJob.company_urls &&
            Array.isArray(apiJob.company_urls) &&
            apiJob.company_urls.length > 0
          ) {
            return apiJob.company_urls
              .map((url: any) => {
                if (typeof url === 'string') return url;
                if (typeof url === 'object' && url.url) return url.url;
                return null;
              })
              .filter(Boolean)
              .join(', ');
          }
          return 'URL未設定';
        })(),
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
