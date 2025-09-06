// 年収オプションのヘルパー関数

export const SALARY_OPTIONS = [
  { value: '', label: '指定なし' },
  { value: '500', label: '500万円' },
  { value: '600', label: '600万円' },
  { value: '800', label: '800万円' },
  { value: '1000', label: '1,000万円' },
  { value: '1200', label: '1,200万円' },
  { value: '1500', label: '1,500万円' },
  { value: '2000', label: '2,000万円' },
  { value: '3000', label: '3,000万円' },
  { value: '5000', label: '5,000万円' },
];

/**
 * 最小値に基づいて最大値のオプションをフィルタリング
 * @param minValue 選択された最小値
 * @returns フィルタリングされた最大値のオプション
 */
export function getFilteredMaxOptions(minValue: string) {
  if (!minValue) {
    return SALARY_OPTIONS;
  }
  
  const minNum = parseInt(minValue);
  return SALARY_OPTIONS.filter(option => {
    if (!option.value) return true; // "指定なし"は常に表示
    return parseInt(option.value) >= minNum;
  });
}

/**
 * 最大値に基づいて最小値のオプションをフィルタリング
 * @param maxValue 選択された最大値
 * @returns フィルタリングされた最小値のオプション
 */
export function getFilteredMinOptions(maxValue: string) {
  if (!maxValue) {
    return SALARY_OPTIONS;
  }
  
  const maxNum = parseInt(maxValue);
  return SALARY_OPTIONS.filter(option => {
    if (!option.value) return true; // "指定なし"は常に表示
    return parseInt(option.value) <= maxNum;
  });
}