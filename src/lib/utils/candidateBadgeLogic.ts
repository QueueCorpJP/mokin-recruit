/**
 * 候補者の志向バッジを判定するロジック
 */

export interface BadgeResult {
  badgeType: 'change' | 'professional' | 'multiple';
  badgeText: string;
}

export interface CandidateBadgeData {
  recent_job_types?: string[];
  desired_job_types?: string[];
  selectionCompanies?: Array<{
    jobTypes?: string[];
  }>;
}

/**
 * 候補者の志向バッジを判定する
 */
export function calculateCandidateBadge(candidate: CandidateBadgeData): BadgeResult {
  // デフォルトはキャリアチェンジ志向
  let badgeType: 'change' | 'professional' | 'multiple' = 'change';
  let badgeText = 'キャリアチェンジ志向';

  // 直近の職種を取得
  const currentJobTypes = candidate.recent_job_types || [];
  
  // 選考中の求人の職種を取得
  const selectionJobTypes = new Set<string>();
  if (candidate.selectionCompanies) {
    candidate.selectionCompanies.forEach(company => {
      if (company.jobTypes && Array.isArray(company.jobTypes)) {
        company.jobTypes.forEach((jobType: string | unknown) => {
          if (typeof jobType === 'string') {
            selectionJobTypes.add(jobType);
          }
        });
      }
    });
  }

  // 希望職種を取得
  const desiredJobTypes = candidate.desired_job_types || [];

  // 判定ロジック（優先順）:
  // 1. 多職種志向：選考中の求人の種類が3種類以上ある
  if (selectionJobTypes.size >= 3) {
    badgeType = 'multiple';
    badgeText = '多職種志向';
  }
  // 2. 専門性追求志向：直近の在籍企業と同一職種の求人のみ選考中
  else if (
    currentJobTypes.length > 0 && 
    selectionJobTypes.size > 0 &&
    Array.from(selectionJobTypes).every(jobType => 
      currentJobTypes.some((currentJob: string | unknown) => 
        String(currentJob).toLowerCase() === String(jobType).toLowerCase()
      )
    )
  ) {
    badgeType = 'professional';
    badgeText = '専門性追求志向';
  }
  // 3. キャリアチェンジ志向：直近の在籍企業と希望職種が違うものが含まれる
  else if (
    currentJobTypes.length > 0 &&
    desiredJobTypes.length > 0 &&
    desiredJobTypes.some((desiredJob: string | unknown) => 
      !currentJobTypes.some((currentJob: string | unknown) => 
        String(currentJob).toLowerCase() === String(desiredJob).toLowerCase()
      )
    )
  ) {
    badgeType = 'change';
    badgeText = 'キャリアチェンジ志向';
  }

  return { badgeType, badgeText };
}