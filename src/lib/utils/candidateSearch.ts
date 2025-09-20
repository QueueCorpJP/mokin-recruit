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
  // 検索条件が何もない場合は全候補者を返す（最新順にソート）
  const hasAnyConditions = Object.values(conditions).some(value =>
    Array.isArray(value)
      ? value.length > 0
      : value !== undefined && value !== null && value !== ''
  );

  if (!hasAnyConditions) {
    // 検索条件が空の場合は全候補者を最新順で返す
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
        const positionMatch =
          candidate.position &&
          candidate.position !== '役職未設定' &&
          candidate.position.toLowerCase().includes(jobType.toLowerCase());
        const companyMatch =
          candidate.companyName &&
          candidate.companyName !== '企業名未設定' &&
          candidate.companyName.toLowerCase().includes(jobType.toLowerCase());
        const experienceJobsMatch = candidate.experienceJobs.some(
          job =>
            job &&
            job !== '未設定' &&
            job.toLowerCase().includes(jobType.toLowerCase())
        );

        // より寛容なマッチング：「未設定」でも条件によってはマッチさせる
        const fallbackMatch =
          (candidate.position === '役職未設定' ||
            candidate.companyName === '企業名未設定') &&
          (jobType.includes('エンジニア') ||
            jobType.includes('プログラマー') ||
            jobType.includes('マーケティング') ||
            jobType.includes('コンサルタント'));

        const match =
          positionMatch || companyMatch || experienceJobsMatch || fallbackMatch;
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
        const companyMatch =
          candidate.companyName &&
          candidate.companyName !== '企業名未設定' &&
          candidate.companyName.toLowerCase().includes(industry.toLowerCase());
        const experienceIndustryMatch = candidate.experienceIndustries.some(
          exp =>
            exp &&
            exp !== '未設定' &&
            exp.toLowerCase().includes(industry.toLowerCase())
        );

        // より寛容なマッチング：「未設定」でも条件によってはマッチさせる
        const fallbackMatch =
          (candidate.companyName === '企業名未設定' ||
            candidate.experienceIndustries.length === 0) &&
          (industry.includes('IT') ||
            industry.includes('金融') ||
            industry.includes('コンサルティング') ||
            industry.includes('マーケティング'));

        const match = companyMatch || experienceIndustryMatch || fallbackMatch;
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
        const locationMatch =
          candidate.location &&
          candidate.location !== '未設定' &&
          candidate.location.toLowerCase().includes(location.toLowerCase());

        // より寛容なマッチング：「未設定」でも主要都市はマッチさせる
        const fallbackMatch =
          candidate.location === '未設定' &&
          (location.includes('東京') ||
            location.includes('大阪') ||
            location.includes('全国'));

        const match = locationMatch || fallbackMatch;
        return match;
      });

      if (hasMatchingLocation) {
        matchCount++;
      }
    }

    // 年齢フィルタ（AND条件）
    if (conditions.age_min || conditions.age_max) {
      totalConditions++;
      if (candidate.age && candidate.age !== '年齢未設定') {
        const ageMatch = candidate.age.match(/(\d+)歳/);
        if (ageMatch && ageMatch[1]) {
          const age = parseInt(ageMatch[1]);
          const ageInRange =
            (!conditions.age_min || age >= conditions.age_min) &&
            (!conditions.age_max || age <= conditions.age_max);
          if (ageInRange) {
            matchCount++;
          }
        }
      } else {
        // 年齢未設定でも条件によってはマッチさせる（寛容な検索）
        const fallbackAgeMatch =
          (!conditions.age_min || conditions.age_min <= 35) &&
          (!conditions.age_max || conditions.age_max >= 25);
        if (fallbackAgeMatch) {
          matchCount++;
        }
      }
    }

    // 年収フィルタ（AND条件）
    if (conditions.salary_min || conditions.salary_max) {
      totalConditions++;

      if (candidate.salary === '未設定') {
        // 年収未設定でも条件によってはマッチさせる（寛容な検索）
        const fallbackSalaryMatch =
          (!conditions.salary_min || conditions.salary_min <= 500) &&
          (!conditions.salary_max || conditions.salary_max >= 400);
        if (fallbackSalaryMatch) {
          matchCount++;
        }
      } else {
        const salaryMatch = candidate.salary.match(/(\d+)(?:〜(\d+))?万円/);
        if (salaryMatch && salaryMatch[1]) {
          const minSalary = parseInt(salaryMatch[1]);
          const maxSalary = salaryMatch[2]
            ? parseInt(salaryMatch[2])
            : minSalary;
          const salaryInRange =
            (!conditions.salary_min || maxSalary >= conditions.salary_min) &&
            (!conditions.salary_max || minSalary <= conditions.salary_max);
          if (salaryInRange) {
            matchCount++;
          }
        }
      }
    }

    // 学歴フィルタ（OR検索）
    if (conditions.education_level?.length) {
      totalConditions++;
      const hasMatchingEducation = conditions.education_level.some(level => {
        const degreeMatch =
          candidate.degree &&
          candidate.degree !== '未設定' &&
          candidate.degree.toLowerCase().includes(level.toLowerCase());

        // より寛容なマッチング：「未設定」でも基本的な学歴はマッチさせる
        const fallbackMatch =
          candidate.degree === '未設定' &&
          (level.includes('大学') ||
            level.includes('大学院') ||
            level.includes('専門'));

        return degreeMatch || fallbackMatch;
      });
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
  const filteredCandidates = filterCandidatesByConditions(
    allCandidates,
    conditions
  );

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
export function calculateMatchScore(
  candidate: CandidateData,
  conditions: SearchConditions
): number {
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
