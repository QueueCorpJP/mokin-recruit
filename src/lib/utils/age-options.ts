// 年齢オプションのヘルパー関数

export const AGE_OPTIONS = [
  { value: '', label: '指定なし' },
  { value: '20', label: '20歳' },
  { value: '25', label: '25歳' },
  { value: '30', label: '30歳' },
  { value: '35', label: '35歳' },
  { value: '40', label: '40歳' },
  { value: '45', label: '45歳' },
  { value: '50', label: '50歳' },
  
];

/**
 * 最小年齢に基づいて最大年齢のオプションをフィルタリング
 * @param minValue 選択された最小年齢
 * @returns フィルタリングされた最大年齢のオプション
 */
export function getFilteredMaxAgeOptions(minValue: string) {
  if (!minValue) {
    return AGE_OPTIONS;
  }
  
  const minNum = parseInt(minValue);
  return AGE_OPTIONS.filter(option => {
    if (!option.value) return true; // "指定なし"は常に表示
    return parseInt(option.value) >= minNum;
  });
}

/**
 * 最大年齢に基づいて最小年齢のオプションをフィルタリング
 * @param maxValue 選択された最大年齢
 * @returns フィルタリングされた最小年齢のオプション
 */
export function getFilteredMinAgeOptions(maxValue: string) {
  if (!maxValue) {
    return AGE_OPTIONS;
  }
  
  const maxNum = parseInt(maxValue);
  return AGE_OPTIONS.filter(option => {
    if (!option.value) return true; // "指定なし"は常に表示
    return parseInt(option.value) <= maxNum;
  });
}