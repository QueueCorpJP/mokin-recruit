import { createClient } from '@/lib/supabase/server';
import type { CandidateData } from '@/components/company/CandidateCard';

// 候補者データを取得する関数（サーバーサイド版）
export async function getCandidatesFromDatabase(): Promise<CandidateData[]> {
  try {
    const supabase = await createClient();
    
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
        recent_job_company_name,
        recent_job_department_position,
        recent_job_types,
        desired_job_types,
        last_login_at,
        education!left(
          final_education,
          school_name,
          department,
          graduation_year,
          graduation_month
        ),
        skills!left(
          english_level,
          qualifications,
          other_languages
        ),
        career_histories!left(
          start_date,
          end_date,
          company_name,
          position_title,
          department
        ),
        selection_companies!left(
          company_name,
          position_details
        )
      `)
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

      // キャリア履歴の変換
      const careerHistory = candidate.career_histories?.map((history: any) => ({
        period: `${history.start_date}〜${history.end_date || '現在'}`,
        company: history.company_name || '',
        role: `${history.department || ''}${history.position_title || ''}`,
      })) || [];

      // 選考中企業の変換
      const selectionCompanies = candidate.selection_companies?.map((company: any) => ({
        company: company.company_name || '',
        detail: company.position_details || '',
      })) || [];

      // 経験職種と業界（モックデータとして設定）
      const experienceJobs = candidate.recent_job_types?.split(',') || [];
      const experienceIndustries = ['業種テキスト', '業種テキスト', '業種テキスト'];

      return {
        id: candidate.id,
        isPickup: false,
        isHidden: false,
        isAttention: true,
        badgeType: 'change' as const,
        badgeText: 'キャリアチェンジ志向',
        lastLogin: getLastLoginText(candidate.last_login_at),
        companyName: candidate.recent_job_company_name || candidate.current_company || '',
        department: candidate.recent_job_department_position || '',
        position: candidate.current_position || '',
        location: candidate.prefecture || '',
        age: calculateAge(candidate.birth_date),
        gender: candidate.gender === 'male' ? '男性' : candidate.gender === 'female' ? '女性' : '',
        salary: formatSalary(candidate.current_income),
        university: candidate.education?.school_name || '',
        degree: candidate.education?.final_education === 'university' ? '大学卒' : 
               candidate.education?.final_education === 'graduate_school' ? '大学院卒' : 
               candidate.education?.final_education === 'high_school' ? '高校卒' : '',
        language: candidate.skills?.other_languages ? '英語' : '',
        languageLevel: candidate.skills?.english_level || '',
        experienceJobs,
        experienceIndustries,
        careerHistory,
        selectionCompanies,
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