'use server';

import { requireCompanyAuthForAction } from '@/lib/auth/server';
import { createClient } from '@/lib/supabase/server';
import { INDUSTRY_GROUPS, type Industry } from '@/constants/industry-data';
import { prefectureNamesForMatch } from '@/constants/prefectures';

export interface CompanyAccountEditData {
  companyName: string;
  representativeName: string;
  industryText: string;
  headquartersAddress: string;
  companyOverview: string;
}

export interface CompanyAccountEditInput {
  representativeName: string;
  industries: Industry[];
  businessContent: string;
  location: { prefecture: string; address: string };
}

function findIndustriesByNames(names: string[]): Industry[] {
  const all: Industry[] = INDUSTRY_GROUPS.flatMap(g => g.industries);
  const nameSet = new Set(names);
  return all.filter(i => nameSet.has(i.name));
}

export async function getCompanyAccountForEdit(): Promise<
  | {
      success: true;
      data: CompanyAccountEditData & {
        industries: Industry[];
        location: { prefecture: string; address: string };
      };
    }
  | { success: false; error: string }
> {
  const auth = await requireCompanyAuthForAction();
  if (!auth.success) {
    return { success: false, error: auth.error };
  }

  const { companyAccountId } = auth.data;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('company_accounts')
    .select(
      'company_name, representative_name, industry, company_overview, headquarters_address'
    )
    .eq('id', companyAccountId)
    .maybeSingle();

  if (error || !data) {
    return { success: false, error: '企業情報の取得に失敗しました' };
  }

  const industryText: string = data.industry || '';
  const industries = industryText ? findIndustriesByNames([industryText]) : [];

  // 都道府県の推定分割（一致しなければ住所に全体を入れる）
  const prefectureList = [...prefectureNamesForMatch, '海外'];
  const fullAddress: string = data.headquarters_address || '';
  let prefecture = '';
  let address = '';
  const hit = prefectureList.find(p => fullAddress.startsWith(p));
  if (hit) {
    prefecture = hit;
    address = fullAddress.slice(hit.length).trim();
  } else {
    address = fullAddress;
  }

  return {
    success: true,
    data: {
      companyName: data.company_name || '',
      representativeName: data.representative_name || '',
      industryText,
      companyOverview: data.company_overview || '',
      headquartersAddress: fullAddress,
      industries,
      location: { prefecture, address },
    },
  };
}

export async function saveCompanyAccountEdit(
  input: CompanyAccountEditInput
): Promise<{ success: true } | { success: false; error: string }> {
  const auth = await requireCompanyAuthForAction();
  if (!auth.success) {
    return { success: false, error: auth.error };
  }

  const { companyAccountId } = auth.data;
  const supabase = await createClient();

  // 入力検証（必須項目）
  if (!input.representativeName?.trim()) {
    return { success: false, error: '代表者名を入力してください' };
  }
  if (!input.businessContent?.trim()) {
    return { success: false, error: '事業内容を入力してください' };
  }
  if (!input.location?.prefecture || !input.location?.address?.trim()) {
    return { success: false, error: '所在地を入力してください' };
  }
  if (!Array.isArray(input.industries) || input.industries.length === 0) {
    return { success: false, error: '業種を1つ以上選択してください' };
  }

  // 現在の値を取得して差分のみ更新
  const { data: current, error: fetchError } = await supabase
    .from('company_accounts')
    .select(
      'representative_name, industry, headquarters_address, company_overview'
    )
    .eq('id', companyAccountId)
    .maybeSingle();

  if (fetchError || !current) {
    console.error('会社情報取得エラー:', fetchError);
    return { success: false, error: '現在の企業情報の取得に失敗しました' };
  }

  const primaryIndustry = input.industries[0]?.name || '';
  const headquartersAddress =
    `${input.location.prefecture} ${input.location.address}`.trim();

  const updateData: Record<string, any> = {};
  if ((current.representative_name || '') !== input.representativeName) {
    updateData.representative_name = input.representativeName;
  }
  if ((current.industry || '') !== primaryIndustry) {
    updateData.industry = primaryIndustry;
  }
  if ((current.headquarters_address || '') !== headquartersAddress) {
    updateData.headquarters_address = headquartersAddress;
  }
  if ((current.company_overview || '') !== input.businessContent) {
    updateData.company_overview = input.businessContent;
  }

  if (Object.keys(updateData).length === 0) {
    return { success: true };
  }

  updateData.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('company_accounts')
    .update(updateData)
    .eq('id', companyAccountId);

  if (error) {
    console.error('会社情報更新エラー:', error);
    return { success: false, error: '企業アカウント情報の保存に失敗しました' };
  }

  return { success: true };
}
