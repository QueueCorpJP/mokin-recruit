'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server-client';

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
    const supabase = await getSupabaseServerClient();

    // ユーザー認証状態を確認
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const isAuthenticated = !!user;

    // 求人詳細を取得（初期表示に必要最小限のフィールドのみ）
    let jobQuery = supabase
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
      .eq('status', 'PUBLISHED');

    // 認証状態に応じてpublication_typeフィルターを適用
    if (isAuthenticated) {
      // ログインユーザーはpublicとmembersの両方を閲覧可能
      jobQuery = jobQuery.in('publication_type', ['public', 'members']);
    } else {
      // 未認証ユーザーはpublicのみ閲覧可能
      jobQuery = jobQuery.eq('publication_type', 'public');
    }

    const { data: job, error: jobError } = await jobQuery.maybeSingle();

    if (jobError || !job) {
      console.error('Failed to fetch job:', jobError);
      throw new Error('求人情報が見つかりませんでした');
    }

    // Type assertion to help TypeScript understand the shape
    const jobData = job as {
      id: string;
      title: string;
      job_description: string;
      position_summary: string;
      required_skills: string[];
      preferred_skills: string[];
      salary_min: number | null;
      salary_max: number | null;
      salary_note: string | null;
      employment_type: string;
      employment_type_note: string | null;
      work_location: string[];
      location_note: string | null;
      working_hours: string | null;
      overtime: string | null;
      overtime_info: string | null;
      holidays: string | null;
      selection_process: string | null;
      job_type: string[];
      industry: string[];
      appeal_points: string[];
      required_documents: string[];
      image_urls: string[];
      smoking_policy: string | null;
      company_account_id: string;
      status: string;
    };

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
      .eq('id', jobData.company_account_id)
      .maybeSingle();

    if (companyError) {
      console.error('Failed to fetch company:', companyError);
    }

    // Type assertion for company data
    const companyData = company as {
      id?: string;
      company_name?: string;
      representative_name?: string;
      representative_position?: string;
      industry?: string;
      industries?: string[];
      company_overview?: string;
      business_content?: string;
      headquarters_address?: string;
      address?: string;
      prefecture?: string;
      established_year?: number;
      capital_amount?: number;
      capital_unit?: string;
      employees_count?: number;
      company_phase?: string;
      company_urls?: string[];
      icon_image_url?: string;
      company_images?: string[];
    } | null;

    if (!companyData) {
      console.warn(
        `Company not found for job ${jobId}, company_account_id: ${jobData.company_account_id}`
      );
    }

    // 求人データに会社情報を追加
    const jobWithCompany = {
      ...jobData,
      company_name: companyData?.company_name || '企業名未設定',
      // 会社情報（最小限）
      representative_name: companyData?.representative_name,
      representative_position: companyData?.representative_position,
      company_industry: companyData?.industry,
      company_industries: companyData?.industries,
      company_overview: companyData?.company_overview,
      business_content: companyData?.business_content,
      headquarters_address: companyData?.headquarters_address,
      company_address: companyData?.address,
      company_prefecture: companyData?.prefecture,
      established_year: companyData?.established_year,
      capital_amount: companyData?.capital_amount,
      capital_unit: companyData?.capital_unit,
      employees_count: companyData?.employees_count,
      company_phase: companyData?.company_phase,
      company_urls: companyData?.company_urls,
      icon_image_url: companyData?.icon_image_url,
      company_images: companyData?.company_images,
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
          ? apiJob.company_industries.map((industry: any) =>
              typeof industry === 'string'
                ? industry
                : industry.name || industry
            )
          : Array.isArray(apiJob.industry)
            ? apiJob.industry.map((industry: any) =>
                typeof industry === 'string'
                  ? industry
                  : industry.name || industry
              )
            : [apiJob.company_industry || apiJob.industry || '業種未設定'],
        jobDescription: apiJob.job_description || 'テキストが入ります。',
        positionSummary: apiJob.position_summary || 'テキストが入ります。',
        skills: Array.isArray(apiJob.required_skills)
          ? apiJob.required_skills.join('、')
          : apiJob.required_skills || 'テキストが入ります。',
        otherRequirements: Array.isArray(apiJob.preferred_skills)
          ? apiJob.preferred_skills.join('、')
          : apiJob.preferred_skills || 'テキストが入ります。',
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
        overtime: apiJob.overtime || 'テキストが入ります。',
        overtimeMemo: apiJob.overtime_info || 'テキストが入ります。',
        holidays: apiJob.holidays || 'テキストが入ります。',
        selectionProcess: apiJob.selection_process || 'テキストが入ります。',
        appealPoints: (() => {
          const appealPointsData = apiJob.appeal_points as any;
          if (
            appealPointsData &&
            typeof appealPointsData === 'object' &&
            !Array.isArray(appealPointsData)
          ) {
            return {
              business: Array.isArray(appealPointsData.business)
                ? appealPointsData.business
                : ['CxO候補', '新規事業立ち上げ'],
              company: Array.isArray(appealPointsData.company)
                ? appealPointsData.company
                : ['成長フェーズ', '上場準備中'],
              team: Array.isArray(appealPointsData.team)
                ? appealPointsData.team
                : ['少数精鋭', '代表と距離が近い'],
              workstyle: Array.isArray(appealPointsData.workstyle)
                ? appealPointsData.workstyle
                : ['フレックス制度', 'リモートあり'],
            };
          } else if (
            Array.isArray(appealPointsData) &&
            appealPointsData.length > 0
          ) {
            const businessPoints = appealPointsData.filter(
              (point: string) =>
                point.includes('CxO') ||
                point.includes('新規事業') ||
                point.includes('経営') ||
                point.includes('幹部')
            );
            const companyPoints = appealPointsData.filter(
              (point: string) =>
                point.includes('成長') ||
                point.includes('上場') ||
                point.includes('拡大') ||
                point.includes('発展')
            );
            const teamPoints = appealPointsData.filter(
              (point: string) =>
                point.includes('少数') ||
                point.includes('代表') ||
                point.includes('チーム') ||
                point.includes('距離')
            );
            const workstylePoints = appealPointsData.filter(
              (point: string) =>
                point.includes('フレックス') ||
                point.includes('リモート') ||
                point.includes('在宅') ||
                point.includes('働き方')
            );

            return {
              business:
                businessPoints.length > 0
                  ? businessPoints
                  : ['CxO候補', '新規事業立ち上げ'],
              company:
                companyPoints.length > 0
                  ? companyPoints
                  : ['成長フェーズ', '上場準備中'],
              team:
                teamPoints.length > 0
                  ? teamPoints
                  : ['少数精鋭', '代表と距離が近い'],
              workstyle:
                workstylePoints.length > 0
                  ? workstylePoints
                  : ['フレックス制度', 'リモートあり'],
            };
          } else {
            return {
              business: ['CxO候補', '新規事業立ち上げ'],
              company: ['成長フェーズ', '上場準備中'],
              team: ['少数精鋭', '代表と距離が近い'],
              workstyle: ['フレックス制度', 'リモートあり'],
            };
          }
        })(),
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
