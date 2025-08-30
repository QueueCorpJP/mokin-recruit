/**
 * Task utility functions (non-server functions)
 */

/**
 * タスクの優先度を計算
 * @returns 'HIGH' | 'MEDIUM' | 'LOW'
 */
export function calculateTaskPriority(taskType: string, createdAt?: Date): 'HIGH' | 'MEDIUM' | 'LOW' {
  const now = new Date();
  const hoursSince = createdAt ? (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60) : 0;

  switch (taskType) {
    case 'NO_JOB_POSTINGS':
      return 'HIGH'; // 求人がない場合は最優先
    
    case 'NEW_APPLICATION':
      return hoursSince < 12 ? 'HIGH' : 'MEDIUM';
    
    case 'UNREAD_APPLICATION':
      return hoursSince > 48 ? 'HIGH' : 'MEDIUM';
    
    case 'NEW_MESSAGE':
      return hoursSince < 24 ? 'HIGH' : 'MEDIUM';
    
    case 'UNREAD_MESSAGE':
      return 'HIGH'; // 72時間以上経過した未読は高優先度
    
    case 'UNREGISTERED_INTERVIEW':
      return hoursSince > 72 ? 'HIGH' : 'MEDIUM';
    
    default:
      return 'LOW';
  }
}

/**
 * 候補者名をフォーマット
 */
export function formatCandidateName(candidate: any): string {
  if (!candidate) return '候補者名未設定';
  
  const lastName = candidate.last_name || '';
  const firstName = candidate.first_name || '';
  const lastNameKana = candidate.last_name_kana || '';
  const firstNameKana = candidate.first_name_kana || '';
  
  // 漢字名がある場合は漢字名を使用
  if (lastName || firstName) {
    return `${lastName} ${firstName}`.trim();
  }
  
  // カナ名のみの場合はカナ名を使用
  if (lastNameKana || firstNameKana) {
    return `${lastNameKana} ${firstNameKana}`.trim();
  }
  
  return '候補者名未設定';
}