import { CandidateData } from '@/components/company/CandidateCard';

interface SearchConditions {
  job_types?: string[];
  industries?: string[];
  locations?: string[];
  age_min?: number;
  age_max?: number;
  salary_min?: number;
  salary_max?: number;
  experience_years_min?: number;
  skills?: string[];
  languages?: string[];
  career_change?: boolean;
  professional_focus?: boolean;
  education_level?: string[];
}

/**
 * 候補者を検索条件でフィルタリングする
 */
export function filterCandidatesByConditions(
  candidates: CandidateData[], 
  conditions: SearchConditions
): CandidateData[] {
  console.log('Filtering candidates:', candidates.length, 'conditions:', conditions);
  return candidates.filter(candidate => {
    console.log('Checking candidate:', candidate.id, 'experienceJobs:', candidate.experienceJobs, 'experienceIndustries:', candidate.experienceIndustries);
    // 職種フィルタ（AND検索：すべての職種を満たす必要がある）
    if (conditions.job_types?.length) {
      const hasAllJobTypes = conditions.job_types.every(jobType => 
        candidate.experienceJobs.some(job => 
          job.toLowerCase().includes(jobType.toLowerCase()) ||
          jobType.toLowerCase().includes(job.toLowerCase())
        )
      );
      if (!hasAllJobTypes) return false;
    }

    // 業界フィルタ（AND検索：すべての業界を満たす必要がある）
    if (conditions.industries?.length) {
      const hasAllIndustries = conditions.industries.every(industry => 
        candidate.experienceIndustries.some(exp => 
          exp.toLowerCase().includes(industry.toLowerCase()) ||
          industry.toLowerCase().includes(exp.toLowerCase())
        )
      );
      if (!hasAllIndustries) return false;
    }

    // 地域フィルタ
    if (conditions.locations?.length) {
      const hasMatchingLocation = conditions.locations.some(location => 
        candidate.location.includes(location) || location.includes(candidate.location)
      );
      if (!hasMatchingLocation) return false;
    }

    // 年齢フィルタ
    if (conditions.age_min || conditions.age_max) {
      const ageMatch = candidate.age.match(/(\d+)歳/);
      if (ageMatch) {
        const age = parseInt(ageMatch[1]);
        if (conditions.age_min && age < conditions.age_min) return false;
        if (conditions.age_max && age > conditions.age_max) return false;
      }
    }

    // 年収フィルタ（簡略実装）
    if (conditions.salary_min || conditions.salary_max) {
      const salaryMatch = candidate.salary.match(/(\d+)(?:〜(\d+))?万円/);
      if (salaryMatch) {
        const minSalary = parseInt(salaryMatch[1]);
        const maxSalary = salaryMatch[2] ? parseInt(salaryMatch[2]) : minSalary;
        if (conditions.salary_min && maxSalary < conditions.salary_min) return false;
        if (conditions.salary_max && minSalary > conditions.salary_max) return false;
      }
    }

    // キャリアチェンジ志向フィルタ
    if (conditions.career_change && candidate.badgeType !== 'change') {
      return false;
    }

    // 専門性追求志向フィルタ
    if (conditions.professional_focus && candidate.badgeType !== 'professional') {
      return false;
    }

    // 学歴フィルタ
    if (conditions.education_level?.length) {
      const hasMatchingEducation = conditions.education_level.some(level => 
        candidate.degree.includes(level)
      );
      if (!hasMatchingEducation) return false;
    }

    return true;
  });
}

/**
 * モック検索関数 - 実際のDBクエリの代替
 */
export function searchCandidatesWithMockData(
  conditions: SearchConditions,
  allCandidates: CandidateData[]
): CandidateData[] {
  console.log('searchCandidatesWithMockData called with:', conditions, 'candidates:', allCandidates.length);
  
  const filteredCandidates = filterCandidatesByConditions(allCandidates, conditions);
  
  console.log('Filtered candidates:', filteredCandidates.length);
  
  // フィルタ結果が空の場合、すべての候補者を返す（開発用）
  if (filteredCandidates.length === 0) {
    console.log('No filtered results, returning all candidates');
    return allCandidates;
  }
  
  // 検索結果をランダムにシャッフル（実際の実装では関連性でソート）
  const shuffled = [...filteredCandidates].sort(() => Math.random() - 0.5);
  
  return shuffled;
}

/**
 * 検索条件の適合度を計算（簡略版）
 */
export function calculateMatchScore(candidate: CandidateData, conditions: SearchConditions): number {
  let score = 0;
  let totalCriteria = 0;

  // 職種マッチ
  if (conditions.job_types?.length) {
    totalCriteria++;
    const matches = conditions.job_types.filter(jobType => 
      candidate.experienceJobs.some(job => 
        job.toLowerCase().includes(jobType.toLowerCase())
      )
    ).length;
    score += matches / conditions.job_types.length;
  }

  // 業界マッチ
  if (conditions.industries?.length) {
    totalCriteria++;
    const matches = conditions.industries.filter(industry => 
      candidate.experienceIndustries.some(exp => 
        exp.toLowerCase().includes(industry.toLowerCase())
      )
    ).length;
    score += matches / conditions.industries.length;
  }

  // 地域マッチ
  if (conditions.locations?.length) {
    totalCriteria++;
    const hasMatch = conditions.locations.some(location => 
      candidate.location.includes(location)
    );
    if (hasMatch) score += 1;
  }

  return totalCriteria > 0 ? score / totalCriteria : 0;
}