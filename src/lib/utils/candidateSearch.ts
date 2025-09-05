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
  // 検索条件が何もない場合は全候補者を返す
  const hasAnyConditions = Object.values(conditions).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null
  );
  
  if (!hasAnyConditions) {
    return candidates;
  }
  
  return candidates.filter(candidate => {
    
    let matchCount = 0;
    let totalConditions = 0;
    
    // 職種フィルタ（OR検索、部分一致）
    if (conditions.job_types?.length) {
      totalConditions++;
      const hasMatchingJobType = conditions.job_types.some(jobType => {
        // position, experienceJobs, companyNameから部分一致で検索
        const positionMatch = candidate.position && candidate.position.toLowerCase().includes(jobType.toLowerCase());
        const companyMatch = candidate.companyName && candidate.companyName.toLowerCase().includes(jobType.toLowerCase());
        const experienceJobsMatch = candidate.experienceJobs.some(job => 
          job && job.toLowerCase().includes(jobType.toLowerCase())
        );
        
        const match = positionMatch || companyMatch || experienceJobsMatch;
        return match;
      });
      
      if (hasMatchingJobType) {
        matchCount++;
      }
    }

    // 業界フィルタ（OR検索、部分一致）
    if (conditions.industries?.length) {
      totalConditions++;
      const hasMatchingIndustry = conditions.industries.some(industry => {
        // companyName, experienceIndustriesから部分一致で検索
        const companyMatch = candidate.companyName && candidate.companyName.toLowerCase().includes(industry.toLowerCase());
        const experienceIndustryMatch = candidate.experienceIndustries.some(exp => 
          exp && exp.toLowerCase().includes(industry.toLowerCase())
        );
        
        const match = companyMatch || experienceIndustryMatch;
        return match;
      });
      
      if (hasMatchingIndustry) {
        matchCount++;
      }
    }

    // 地域フィルタ（OR検索、部分一致）
    if (conditions.locations?.length) {
      totalConditions++;
      const hasMatchingLocation = conditions.locations.some(location => {
        const match = candidate.location && candidate.location.toLowerCase().includes(location.toLowerCase());
        return match;
      });
      
      if (hasMatchingLocation) {
        matchCount++;
      }
    }

    // 年齢フィルタ（AND条件）
    if (conditions.age_min || conditions.age_max) {
      totalConditions++;
      const ageMatch = candidate.age.match(/(\d+)歳/);
      if (ageMatch) {
        const age = parseInt(ageMatch[1]);
        const ageInRange = (!conditions.age_min || age >= conditions.age_min) && 
                          (!conditions.age_max || age <= conditions.age_max);
        if (ageInRange) {
          matchCount++;
        }
      }
    }

    // 年収フィルタ（AND条件）
    if (conditions.salary_min || conditions.salary_max) {
      totalConditions++;
      const salaryMatch = candidate.salary.match(/(\d+)(?:〜(\d+))?万円/);
      if (salaryMatch) {
        const minSalary = parseInt(salaryMatch[1]);
        const maxSalary = salaryMatch[2] ? parseInt(salaryMatch[2]) : minSalary;
        const salaryInRange = (!conditions.salary_min || maxSalary >= conditions.salary_min) && 
                             (!conditions.salary_max || minSalary <= conditions.salary_max);
        if (salaryInRange) {
          matchCount++;
        }
      }
    }

    // 学歴フィルタ（OR検索）
    if (conditions.education_level?.length) {
      totalConditions++;
      const hasMatchingEducation = conditions.education_level.some(level => 
        candidate.degree && candidate.degree.toLowerCase().includes(level.toLowerCase())
      );
      if (hasMatchingEducation) {
        matchCount++;
      }
    }

    // OR検索：いずれかの条件にマッチすれば表示
    const shouldShow = totalConditions === 0 || matchCount > 0;
    
    return shouldShow;
  });
}

/**
 * モック検索関数 - 実際のDBクエリの代替
 */
export function searchCandidatesWithMockData(
  conditions: SearchConditions,
  allCandidates: CandidateData[]
): CandidateData[] {
  const filteredCandidates = filterCandidatesByConditions(allCandidates, conditions);
  
  // フィルタ結果が空の場合、空の配列を返す
  if (filteredCandidates.length === 0) {
    return [];
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