/**
 * 求人タイトルを生成するヘルパー関数
 */
export function generateJobTitle(jobTypes: string[], industries: string[]): string {
  const parts: string[] = [];
  
  // 職種を追加
  if (jobTypes && jobTypes.length > 0) {
    if (jobTypes.length === 1) {
      parts.push(jobTypes[0]);
    } else {
      parts.push(jobTypes.slice(0, 2).join('・')); // 最大2つまで
      if (jobTypes.length > 2) {
        parts[parts.length - 1] += 'など';
      }
    }
  }
  
  // 業界を追加
  if (industries && industries.length > 0) {
    if (industries.length === 1) {
      parts.push(`【${industries[0]}】`);
    } else {
      parts.push(`【${industries.slice(0, 2).join('・')}】`); // 最大2つまで
      if (industries.length > 2) {
        parts[parts.length - 1] = parts[parts.length - 1].replace('】', 'など】');
      }
    }
  }
  
  // 基本的な求人タイトルのパターン
  if (parts.length === 0) {
    return ''; // 空の場合は空文字を返す
  }
  
  if (parts.length === 1) {
    return parts[0];
  }
  
  return parts.join('');
}

/**
 * 求人タイトルのサジェスト候補を生成する
 */
export function generateJobTitleSuggestions(jobTypes: string[], industries: string[]): string[] {
  console.log('[DEBUG] generateJobTitleSuggestions called with:', { jobTypes, industries });
  
  const suggestions: string[] = [];
  
  if (jobTypes.length === 0 && industries.length === 0) {
    console.log('[DEBUG] Both arrays are empty, returning empty suggestions');
    return suggestions;
  }
  
  const baseTitle = generateJobTitle(jobTypes, industries);
  console.log('[DEBUG] Generated baseTitle:', baseTitle);
  
  if (baseTitle) {
    // パターン1: 基本形
    suggestions.push(baseTitle);
    
    // パターン2: 募集
    suggestions.push(`${baseTitle}募集`);
    
    // パターン3: エンジニア系の場合の特別パターン
    if (jobTypes.some(type => type.includes('エンジニア') || type.includes('開発'))) {
      suggestions.push(`${baseTitle}エンジニア募集`);
      if (industries.length > 0) {
        suggestions.push(`${industries[0]}での${jobTypes[0]}`);
      }
    }
    
    // パターン4: 営業系の場合の特別パターン
    if (jobTypes.some(type => type.includes('営業'))) {
      suggestions.push(`${baseTitle}スタッフ募集`);
      if (industries.length > 0) {
        suggestions.push(`${industries[0]}業界での${jobTypes[0]}`);
      }
    }
    
    // パターン5: マーケティング系の場合の特別パターン
    if (jobTypes.some(type => type.includes('マーケティング'))) {
      suggestions.push(`${baseTitle}担当者募集`);
    }
  }
  
  // 重複を除去
  const finalSuggestions = [...new Set(suggestions)].slice(0, 5); // 最大5つまで
  console.log('[DEBUG] Final suggestions:', finalSuggestions);
  return finalSuggestions;
}