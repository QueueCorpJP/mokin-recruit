'use server';

import { revalidatePath } from 'next/cache';

export interface CompanySuggestion {
  id: string;
  name: string;
  address?: string;
  corporateNumber?: string;
}

export async function searchCompaniesAction(query: string): Promise<CompanySuggestion[]> {
  console.log('=== Server Action Called ===');
  console.log('Query received:', query);
  
  if (!query || query.trim().length < 2) {
    console.log('Query too short, returning empty array');
    return [];
  }

  try {
    const gbizApiUrl = 'https://info.gbiz.go.jp/hojin/v1/hojin';
    const params = new URLSearchParams({
      name: query.trim(),
      limit: '5',
    });

    const response = await fetch(`${gbizApiUrl}?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-hojinInfo-api-token': process.env.GBIZ_API_TOKEN || '',
      },
    });

    if (!response.ok) {
      console.log('API request failed:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    console.log('API Response data:', data);
    
    // 正しいフィールド名: "hojin-infos" (ハイフンあり)
    if (!data['hojin-infos'] || !Array.isArray(data['hojin-infos'])) {
      console.log('No hojin-infos found in response');
      return [];
    }

    const companies = data['hojin-infos']
      .filter((company: any) => company.name) // 企業名が存在するもののみ
      .map((company: any, index: number) => ({
        id: company.corporate_number || `temp-${Date.now()}-${index}`,
        name: company.name,
        address: company.location || '',
        corporateNumber: company.corporate_number || '',
      }));

    // 重複除去とリミット適用
    const finalResults = companies.filter((company: CompanySuggestion, index: number, self: CompanySuggestion[]) => 
      index === self.findIndex(c => c.name === company.name)
    ).slice(0, 5);
    
    console.log('Final results before return:', finalResults);
    return finalResults;
    
  } catch (error) {
    console.error('Error in server action:', error);
    return [];
  }
}