import type { SearchConditions } from '../actions/search-history';

/**
 * 検索タイトルを生成するヘルパー関数
 */
export function generateSearchTitle(conditions: SearchConditions): string {
  const parts: string[] = [];
  
  if (conditions.keyword && conditions.keyword.trim()) {
    parts.push(`キーワード: ${conditions.keyword}`);
  }
  
  if (conditions.experienceJobTypes && conditions.experienceJobTypes.length > 0) {
    const jobTypeNames = conditions.experienceJobTypes.map(j => j.name).join(', ');
    parts.push(`経験職種: ${jobTypeNames}`);
  }
  
  if (conditions.experienceIndustries && conditions.experienceIndustries.length > 0) {
    const industryNames = conditions.experienceIndustries.map(i => i.name).join(', ');
    parts.push(`経験業界: ${industryNames}`);
  }
  
  if (conditions.desiredJobTypes && conditions.desiredJobTypes.length > 0) {
    const jobTypeNames = conditions.desiredJobTypes.map(j => j.name).join(', ');
    parts.push(`希望職種: ${jobTypeNames}`);
  }
  
  if (conditions.desiredIndustries && conditions.desiredIndustries.length > 0) {
    const industryNames = conditions.desiredIndustries.map(i => i.name).join(', ');
    parts.push(`希望業界: ${industryNames}`);
  }
  
  if (conditions.desiredLocations && conditions.desiredLocations.length > 0) {
    const locationNames = conditions.desiredLocations.map(l => l.name).join(', ');
    parts.push(`希望勤務地: ${locationNames}`);
  }
  
  if (conditions.currentSalaryMin || conditions.currentSalaryMax) {
    const min = conditions.currentSalaryMin ? `${conditions.currentSalaryMin}万円` : '';
    const max = conditions.currentSalaryMax ? `${conditions.currentSalaryMax}万円` : '';
    const separator = min && max ? '～' : '';
    parts.push(`現在年収: ${min}${separator}${max}`);
  }
  
  if (conditions.ageMin || conditions.ageMax) {
    const min = conditions.ageMin ? `${conditions.ageMin}歳` : '';
    const max = conditions.ageMax ? `${conditions.ageMax}歳` : '';
    const separator = min && max ? '～' : '';
    parts.push(`年齢: ${min}${separator}${max}`);
  }
  
  if (parts.length === 0) {
    return '全候補者検索';
  }
  
  return parts.join(' | ');
}