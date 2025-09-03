import { createClient } from '@/lib/supabase/client';
import type { CandidateData } from '@/components/company/CandidateCard';

// 候補者データを取得する関数（クライアントサイド版）
export async function getCandidatesFromDatabase(): Promise<CandidateData[]> {
  try {
    const supabase = createClient();
    
    const { data: candidates, error } = await supabase
      .from('candidates')
      .select(`
        id,
        last_name,
        first_name,
        current_company,
        current_position,
        prefecture,
        birth_date,
        gender,
        current_income,
        desired_salary,
        skills,
        experience_years,
        desired_industries,
        desired_job_types,
        last_login_at,
        recent_job_company_name,
        recent_job_department_position,
        recent_job_industries,
        recent_job_types,
        recent_job_description,
        education(
          final_education,
          school_name
        ),
        work_experience(
          industry_name,
          experience_years
        ),
        job_type_experience(
          job_type_name,
          experience_years
        ),
        career_status_entries(
          company_name,
          industries,
          progress_status
        )
      `)
      .eq('status', 'ACTIVE')
      .order('last_login_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    // データを CandidateData 形式に変換
    const transformedCandidates: CandidateData[] = candidates?.map((candidate: any) => {
      // 年齢計算
      const calculateAge = (birthDate: string) => {
        if (!birthDate) return '';
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        return `${age}歳`;
      };

      // 最終ログイン時間の計算
      const getLastLoginText = (lastLoginAt: string) => {
        if (!lastLoginAt) return '未ログイン';
        const lastLogin = new Date(lastLoginAt);
        const now = new Date();
        const diffMs = now.getTime() - lastLogin.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return '1時間以内';
        if (diffHours < 24) return `${diffHours}時間前`;
        if (diffDays < 7) return `${diffDays}日前`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
        return `${Math.floor(diffDays / 30)}ヶ月前`;
      };

      // 給与範囲の変換
      const formatSalary = (income: number | null) => {
        if (!income) return '';
        const salaryRange = Math.floor(income / 1000000);
        return `${salaryRange * 100}〜${(salaryRange + 1) * 100}万円`;
      };

      // 実際のデータを活用してフィールドを設定
      const experienceJobs = candidate.job_type_experience?.map((exp: any) => exp.job_type_name).filter(Boolean) || 
                            (candidate.desired_job_types ? candidate.desired_job_types.slice(0, 3) : []) ||
                            (candidate.current_position ? [candidate.current_position] : []);

      const experienceIndustries = candidate.work_experience?.map((exp: any) => exp.industry_name).filter(Boolean) || 
                                  (candidate.desired_industries ? candidate.desired_industries.slice(0, 3) : []);

      // 選考中企業の情報を構築
      const selectionCompanies = candidate.career_status_entries?.filter((entry: any) => entry.progress_status)
        .map((entry: any) => ({
          company: entry.company_name || '企業名未設定',
          detail: Array.isArray(entry.industries) ? entry.industries.join('、') : (entry.industries || '業界情報なし')
        })) || [];

      // 職歴情報の構築
      const careerHistory = [{
        period: candidate.recent_job_company_name ? '直近' : '現在',
        company: candidate.current_company || candidate.recent_job_company_name || '企業名未設定',
        role: candidate.current_position || candidate.recent_job_department_position || '役職未設定'
      }];

      return {
        id: candidate.id,
        isPickup: false,
        isHidden: false,
        isAttention: false,
        badgeType: 'change' as const,
        badgeText: '',
        lastLogin: getLastLoginText(candidate.last_login_at),
        companyName: candidate.current_company || candidate.recent_job_company_name || '企業名未設定',
        department: candidate.recent_job_department_position || '部署名未設定',
        position: candidate.current_position || '役職未設定',
        location: candidate.prefecture || '未設定',
        age: calculateAge(candidate.birth_date),
        gender: candidate.gender === 'male' ? '男性' : candidate.gender === 'female' ? '女性' : '未設定',
        salary: formatSalary(candidate.current_income),
        university: candidate.education?.[0]?.school_name || '大学名未設定',
        degree: candidate.education?.[0]?.final_education || '学歴未設定',
        language: candidate.skills ? candidate.skills.join('、') : '言語スキル未設定',
        languageLevel: '',
        experienceJobs: experienceJobs.slice(0, 3),
        experienceIndustries: experienceIndustries.slice(0, 3),
        careerHistory,
        selectionCompanies: selectionCompanies.slice(0, 3),
      };
    }) || [];

    return transformedCandidates;

  } catch (error) {
    console.error('Failed to fetch candidates:', error);
    return [];
  }
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
  
  // Salary
  if (searchParams.get('current_salary_min')) {
    searchStore.setCurrentSalaryMin(searchParams.get('current_salary_min'));
  }
  if (searchParams.get('current_salary_max')) {
    searchStore.setCurrentSalaryMax(searchParams.get('current_salary_max'));
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
}

// 検索パラメータから初期設定を取得する関数（後方互換性のため残す）
export function parseSearchParams(searchParams: URLSearchParams) {
  return {
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