import type { SearchConditions } from '../actions/search-history';

/**
 * 検索タイトルを生成するヘルパー関数
 */
export function generateSearchTitle(conditions: SearchConditions): string {
  const parts: string[] = [];
  
  // キーワード検索
  if (conditions.keywords && conditions.keywords.length > 0) {
    const keywords = conditions.keywords.filter(k => k && k.trim()).join(', ');
    if (keywords) {
      parts.push(`キーワード: ${keywords}`);
    }
  }
  
  // 経験職種（job_types）
  if (conditions.job_types && conditions.job_types.length > 0) {
    const jobTypeNames = conditions.job_types.join(', ');
    parts.push(`経験職種: ${jobTypeNames}`);
  }
  
  // 経験業界（industries）
  if (conditions.industries && conditions.industries.length > 0) {
    const industryNames = conditions.industries.join(', ');
    parts.push(`経験業界: ${industryNames}`);
  }
  
  // 希望職種（desired_job_types）
  if (conditions.desired_job_types && conditions.desired_job_types.length > 0) {
    const jobTypeNames = conditions.desired_job_types.join(', ');
    parts.push(`希望職種: ${jobTypeNames}`);
  }
  
  // 希望業界（desired_industries）
  if (conditions.desired_industries && conditions.desired_industries.length > 0) {
    const industryNames = conditions.desired_industries.join(', ');
    parts.push(`希望業界: ${industryNames}`);
  }
  
  // 希望勤務地（locations）
  if (conditions.locations && conditions.locations.length > 0) {
    const locationNames = conditions.locations.join(', ');
    parts.push(`希望勤務地: ${locationNames}`);
  }
  
  // 現在年収（salary_min, salary_max）
  if (conditions.salary_min || conditions.salary_max) {
    const min = conditions.salary_min ? `${conditions.salary_min}万円` : '';
    const max = conditions.salary_max ? `${conditions.salary_max}万円` : '';
    const separator = min && max ? '～' : '';
    parts.push(`現在年収: ${min}${separator}${max}`);
  }
  
  // 年齢（age_min, age_max）
  if (conditions.age_min || conditions.age_max) {
    const min = conditions.age_min ? `${conditions.age_min}歳` : '';
    const max = conditions.age_max ? `${conditions.age_max}歳` : '';
    const separator = min && max ? '～' : '';
    parts.push(`年齢: ${min}${separator}${max}`);
  }
  
  // 希望年収（desired_salary_min, desired_salary_max）
  if (conditions.desired_salary_min || conditions.desired_salary_max) {
    const min = conditions.desired_salary_min ? `${conditions.desired_salary_min}万円` : '';
    const max = conditions.desired_salary_max ? `${conditions.desired_salary_max}万円` : '';
    const separator = min && max ? '～' : '';
    parts.push(`希望年収: ${min}${separator}${max}`);
  }
  
  // 転職希望時期
  if (conditions.transfer_time) {
    const timeLabels: { [key: string]: string } = {
      'immediately': 'すぐにでも',
      '1month': '1ヶ月以内',
      '3month': '3ヶ月以内',
      '6month': '6ヶ月以内',
      '1year': '1年以内',
      'good': '良い求人があれば'
    };
    const label = timeLabels[conditions.transfer_time] || conditions.transfer_time;
    parts.push(`転職希望時期: ${label}`);
  }
  
  // 選考状況
  if (conditions.selection_status) {
    const statusLabels: { [key: string]: string } = {
      'not-started': 'まだ始めていない',
      'information-gathering': '情報収集中',
      'document-screening': '書類選考に進んでいる企業がある',
      'interview': '面接・面談を受けている企業がある',
      'offer': '内定をもらっている'
    };
    const label = statusLabels[conditions.selection_status] || conditions.selection_status;
    parts.push(`選考状況: ${label}`);
  }
  
  if (parts.length === 0) {
    return '全候補者検索';
  }
  
  return parts.join(' | ');
}