import { createClient } from '@/lib/supabase/client';
import type { CandidateData } from '@/components/company/CandidateCard';

// グループ情報を取得する関数（クライアントサイド）
export async function getCompanyGroups() {
  try {
    const supabase = createClient();
    
    // 現在のユーザーのセッションから会社情報を取得
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      if (process.env.NODE_ENV === 'development') console.error('Auth error:', authError);
      return [];
    }

    // company_usersテーブルから会社ユーザーIDを取得
    const { data: companyUser, error: userError } = await supabase
      .from('company_users')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (userError || !companyUser) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching company user:', userError);
      return [];
    }
    
    // company_user_group_permissionsテーブルから所属するグループ一覧を取得
    const { data: userPermissions, error } = await supabase
      .from('company_user_group_permissions')
      .select(`
        company_group:company_groups (
          id,
          group_name
        )
      `)
      .eq('company_user_id', companyUser.id);

    if (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching groups:', error);
      return [];
    }

    // グループ形式に変換
    return (userPermissions || [])
      .map((perm: any) => perm.company_group)
      .filter((group: any) => group && group.id && group.group_name)
      .map((group: any) => ({
        value: group.id,
        label: group.group_name
      }));
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error in getCompanyGroups:', error);
    return [];
  }
}

// 検索条件の型定義
interface SearchConditions {
  keyword?: string;
  experienceJobTypes?: Array<{id: string; name: string; experienceYears?: string}>;
  experienceIndustries?: Array<{id: string; name: string; experienceYears?: string}>;
  currentSalaryMin?: string;
  currentSalaryMax?: string;
  ageMin?: string;
  ageMax?: string;
  desiredJobTypes?: Array<{id: string; name: string}>;
  desiredIndustries?: Array<{id: string; name: string}>;
  desiredLocations?: Array<{id: string; name: string}>;
  education?: string;
  englishLevel?: string;
  qualifications?: string;
}


// 検索パラメータから検索条件を復元してストアに設定する関数
export function loadSearchParamsToStore(searchParams: URLSearchParams, searchStore: any) {
  // Basic search
  if (searchParams.get('search_group')) {
    searchStore.setSearchGroup(searchParams.get('search_group'));
  }
  if (searchParams.get('keyword')) {
    searchStore.setKeyword(searchParams.get('keyword'));
  }
  
  // Experience job types
  if (searchParams.get('experience_job_types')) {
    const jobTypes = searchParams.get('experience_job_types')!.split(',').map((name, index) => ({
      id: `job-${index}`,
      name: name.trim(),
    }));
    searchStore.setExperienceJobTypes(jobTypes);
  }
  
  // Experience industries
  if (searchParams.get('experience_industries')) {
    const industries = searchParams.get('experience_industries')!.split(',').map((name, index) => ({
      id: `industry-${index}`,
      name: name.trim(),
    }));
    searchStore.setExperienceIndustries(industries);
  }
  
  // Current Salary
  if (searchParams.get('current_salary_min')) {
    searchStore.setCurrentSalaryMin(searchParams.get('current_salary_min'));
  }
  if (searchParams.get('current_salary_max')) {
    searchStore.setCurrentSalaryMax(searchParams.get('current_salary_max'));
  }
  
  // Desired Salary
  if (searchParams.get('desired_salary_min')) {
    searchStore.setDesiredSalaryMin(searchParams.get('desired_salary_min'));
  }
  if (searchParams.get('desired_salary_max')) {
    searchStore.setDesiredSalaryMax(searchParams.get('desired_salary_max'));
  }
  
  // Company and education
  if (searchParams.get('current_company')) {
    searchStore.setCurrentCompany(searchParams.get('current_company'));
  }
  if (searchParams.get('education')) {
    searchStore.setEducation(searchParams.get('education'));
  }
  if (searchParams.get('english_level')) {
    searchStore.setEnglishLevel(searchParams.get('english_level'));
  }
  
  // Age
  if (searchParams.get('age_min')) {
    searchStore.setAgeMin(searchParams.get('age_min'));
  }
  if (searchParams.get('age_max')) {
    searchStore.setAgeMax(searchParams.get('age_max'));
  }
  
  // Desired conditions
  if (searchParams.get('desired_job_types')) {
    const desiredJobTypes = searchParams.get('desired_job_types')!.split(',').map((name, index) => ({
      id: `desired-job-${index}`,
      name: name.trim(),
    }));
    searchStore.setDesiredJobTypes(desiredJobTypes);
  }
  
  if (searchParams.get('desired_industries')) {
    const desiredIndustries = searchParams.get('desired_industries')!.split(',').map((name, index) => ({
      id: `desired-industry-${index}`,
      name: name.trim(),
    }));
    searchStore.setDesiredIndustries(desiredIndustries);
  }
  
  if (searchParams.get('desired_locations')) {
    const desiredLocations = searchParams.get('desired_locations')!.split(',').map((name, index) => ({
      id: `location-${index}`,
      name: name.trim(),
    }));
    searchStore.setDesiredLocations(desiredLocations);
  }
  
  if (searchParams.get('work_styles')) {
    const workStyles = searchParams.get('work_styles')!.split(',').map((name, index) => ({
      id: `work-style-${index}`,
      name: name.trim(),
    }));
    searchStore.setWorkStyles(workStyles);
  }
  
  // Other conditions
  if (searchParams.get('transfer_time')) {
    searchStore.setTransferTime(searchParams.get('transfer_time'));
  }
  if (searchParams.get('selection_status')) {
    searchStore.setSelectionStatus(searchParams.get('selection_status'));
  }
  if (searchParams.get('last_login_min')) {
    searchStore.setLastLoginMin(searchParams.get('last_login_min'));
  }
  
  // 資格
  if (searchParams.get('qualifications')) {
    searchStore.setQualifications(searchParams.get('qualifications'));
  }
  
  // その他の言語
  if (searchParams.get('other_language')) {
    searchStore.setOtherLanguage(searchParams.get('other_language'));
  }
  if (searchParams.get('other_language_level')) {
    searchStore.setOtherLanguageLevel(searchParams.get('other_language_level'));
  }
  
  // 類似企業条件
  if (searchParams.get('similar_company_industry')) {
    searchStore.setSimilarCompanyIndustry(searchParams.get('similar_company_industry'));
  }
  if (searchParams.get('similar_company_location')) {
    searchStore.setSimilarCompanyLocation(searchParams.get('similar_company_location'));
  }
  
  // 職種・業界のAND検索
  if (searchParams.get('job_type_and_search')) {
    searchStore.setJobTypeAndSearch(searchParams.get('job_type_and_search'));
  }
  if (searchParams.get('industry_and_search')) {
    searchStore.setIndustryAndSearch(searchParams.get('industry_and_search'));
  }
}

// 検索パラメータから初期設定を取得する関数（後方互換性のため残す）
export function parseSearchParams(searchParams: URLSearchParams) {
  return {
    searchGroup: searchParams.get('search_group') || '',
    jobTypes: searchParams.get('job_types')?.split(',').map((name, index) => ({
      id: `job-${index}`,
      name: name.trim(),
    })) || [],
    industries: searchParams.get('industries')?.split(',').map((name, index) => ({
      id: `industry-${index}`,
      name: name.trim(),
    })) || [],
    keyword: searchParams.get('keyword') || '',
    salaryMin: searchParams.get('salary_min') || '',
    salaryMax: searchParams.get('salary_max') || '',
    locations: searchParams.get('locations')?.split(',') || [],
    workStyles: searchParams.get('work_styles')?.split(',') || [],
  };
}


