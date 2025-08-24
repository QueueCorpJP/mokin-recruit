// 雇用形態の英語→日本語変換
export const getEmploymentTypeInJapanese = (employmentType: string): string => {
  const mapping: Record<string, string> = {
    FULL_TIME: '正社員',
    PART_TIME: 'パート・アルバイト',
    CONTRACT: '契約社員',
    INTERN: 'インターン',
    // 後方互換性のため日本語も保持
    正社員: '正社員',
    契約社員: '契約社員',
    業務委託: '業務委託',
    その他: 'その他',
  };
  return mapping[employmentType] || employmentType;
};

// 日本語→英語変換（フォーム送信用）
export const getEmploymentTypeInEnglish = (employmentType: string): string => {
  const mapping: Record<string, string> = {
    '正社員': 'FULL_TIME',
    'パート・アルバイト': 'PART_TIME',
    '契約社員': 'CONTRACT',
    'インターン': 'INTERN',
    // 既に英語の場合はそのまま
    FULL_TIME: 'FULL_TIME',
    PART_TIME: 'PART_TIME',
    CONTRACT: 'CONTRACT',
    INTERN: 'INTERN',
  };
  return mapping[employmentType] || 'FULL_TIME';
};