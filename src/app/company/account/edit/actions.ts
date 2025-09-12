'use server';

import { requireCompanyAuthForAction } from '@/lib/auth/server';
import { createClient } from '@/lib/supabase/server';
import { INDUSTRY_GROUPS, type Industry } from '@/constants/industry-data';
import { prefectureNamesForMatch } from '@/constants/prefectures';
import { uploadCompanyIcon, uploadCompanyImages } from '@/lib/storage-server';

export interface CompanyAccountEditData {
  companyName: string;
  representativeName: string;
  representativePosition: string;
  industryText: string;
  headquartersAddress: string;
  companyOverview: string;
  logoUrl?: string | null;
  imageUrls?: string[];
  companyUrls: Array<{ title: string; url: string }>;
  establishedYear: number | null;
  capitalAmount: number | null;
  capitalUnit: string;
  employeesCount: number | null;
  companyPhase: string;
  businessContent: string;
  prefecture: string;
  address: string;
  companyAttractions: Array<{ title: string; content: string }>;
}

export interface CompanyAccountEditInput {
  representativeName: string;
  representativePosition: string;
  industries: Industry[];
  businessContent: string;
  location: { prefecture: string; address: string };
  iconUrl?: string | null;
  imageUrls?: string[];
  companyUrls: Array<{ title: string; url: string }>;
  establishedYear: number | null;
  capitalAmount: number | null;
  capitalUnit: string;
  employeesCount: number | null;
  companyPhase: string;
  companyAttractions: Array<{ title: string; content: string }>;
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
      'company_name, representative_name, representative_position, industry, company_overview, headquarters_address, icon_image_url, company_images, company_urls, established_year, capital_amount, capital_unit, employees_count, company_phase, business_content, prefecture, address, company_attractions'
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

  // Parse JSON fields safely
  const parseJsonField = (field: any, defaultValue: any) => {
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return defaultValue;
      }
    }
    return field ?? defaultValue;
  };

  const companyUrls = parseJsonField(data.company_urls, []);
  const companyAttractions = parseJsonField(data.company_attractions, []);
  const companyImages = Array.isArray(data.company_images) ? data.company_images : [];

  return {
    success: true,
    data: {
      companyName: data.company_name || '',
      representativeName: data.representative_name || '',
      representativePosition: data.representative_position || '',
      industryText,
      companyOverview: data.company_overview || '',
      headquartersAddress: fullAddress,
      logoUrl: data.icon_image_url ?? null,
      imageUrls: companyImages,
      industries,
      location: { prefecture, address },
      companyUrls: Array.isArray(companyUrls) ? companyUrls : [],
      establishedYear: data.established_year || null,
      capitalAmount: data.capital_amount || null,
      capitalUnit: data.capital_unit || '万円',
      employeesCount: data.employees_count || null,
      companyPhase: data.company_phase || '',
      businessContent: data.business_content || '',
      prefecture: data.prefecture || '',
      address: data.address || '',
      companyAttractions: Array.isArray(companyAttractions) ? companyAttractions : [],
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
  if (!input.representativePosition?.trim()) {
    return { success: false, error: '代表者の役職名を入力してください。' };
  }
  if (!input.representativeName?.trim()) {
    return { success: false, error: '代表者の氏名を入力してください。' };
  }
  if (!input.businessContent?.trim()) {
    return { success: false, error: '事業内容を入力してください。' };
  }
  if (!input.location?.prefecture || !input.location?.address?.trim()) {
    return { success: false, error: '所在地を入力してください。' };
  }
  if (!Array.isArray(input.industries) || input.industries.length === 0) {
    return { success: false, error: '業種を1つ以上選択してください。' };
  }

  // 現在の値を取得して差分のみ更新
  const { data: current, error: fetchError } = await supabase
    .from('company_accounts')
    .select(
      'representative_name, representative_position, industry, headquarters_address, company_overview, business_content, icon_image_url, company_images, company_urls, established_year, capital_amount, capital_unit, employees_count, company_phase, prefecture, address, company_attractions'
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
  if ((current.representative_position || '') !== input.representativePosition) {
    updateData.representative_position = input.representativePosition;
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
  if ((current.business_content || '') !== input.businessContent) {
    updateData.business_content = input.businessContent;
  }
  if (input.iconUrl !== undefined && (current.icon_image_url || null) !== (input.iconUrl || null)) {
    updateData.icon_image_url = input.iconUrl || null;
  }
  if (input.imageUrls !== undefined) {
    const curr = Array.isArray(current.company_images) ? current.company_images : [];
    const next = Array.isArray(input.imageUrls) ? input.imageUrls : [];
    if (JSON.stringify(curr) !== JSON.stringify(next)) {
      updateData.company_images = next;
    }
  }
  if (input.companyUrls !== undefined) {
    const curr = current.company_urls ? (typeof current.company_urls === 'string' ? JSON.parse(current.company_urls) : current.company_urls) : [];
    if (JSON.stringify(curr) !== JSON.stringify(input.companyUrls)) {
      updateData.company_urls = JSON.stringify(input.companyUrls);
    }
  }
  if (input.establishedYear !== undefined && (current.established_year || null) !== input.establishedYear) {
    updateData.established_year = input.establishedYear;
  }
  if (input.capitalAmount !== undefined && (current.capital_amount || null) !== input.capitalAmount) {
    updateData.capital_amount = input.capitalAmount;
  }
  if (input.capitalUnit !== undefined && (current.capital_unit || '') !== input.capitalUnit) {
    updateData.capital_unit = input.capitalUnit;
  }
  if (input.employeesCount !== undefined && (current.employees_count || null) !== input.employeesCount) {
    updateData.employees_count = input.employeesCount;
  }
  if (input.companyPhase !== undefined && (current.company_phase || '') !== input.companyPhase) {
    updateData.company_phase = input.companyPhase;
  }
  if ((current.prefecture || '') !== input.location.prefecture) {
    updateData.prefecture = input.location.prefecture;
  }
  if ((current.address || '') !== input.location.address) {
    updateData.address = input.location.address;
  }
  if (input.companyAttractions !== undefined) {
    const curr = current.company_attractions ? (typeof current.company_attractions === 'string' ? JSON.parse(current.company_attractions) : current.company_attractions) : [];
    if (JSON.stringify(curr) !== JSON.stringify(input.companyAttractions)) {
      updateData.company_attractions = JSON.stringify(input.companyAttractions);
    }
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

// Upload icon image for company account
export async function uploadCompanyAccountIconAction(formData: FormData): Promise<
  | { success: true; url: string; path: string }
  | { success: false; error: string }
> {
  const auth = await requireCompanyAuthForAction();
  if (!auth.success) {
    return { success: false, error: auth.error };
  }

  const file = formData.get('icon');
  if (!(file instanceof File)) {
    return { success: false, error: 'アイコン画像が選択されていません' };
  }

  try {
    const uploaded = await uploadCompanyIcon(auth.data.companyAccountId, file);
    return { success: true, url: uploaded.publicUrl, path: uploaded.path };
  } catch (e: any) {
    console.error('uploadCompanyAccountIconAction error:', e);
    return { success: false, error: e?.message || 'アップロードに失敗しました' };
  }
}

// Upload multiple images for company account
export async function uploadCompanyAccountImagesAction(formData: FormData): Promise<
  | { success: true; files: Array<{ url: string; path: string }> }
  | { success: false; error: string }
> {
  const auth = await requireCompanyAuthForAction();
  if (!auth.success) {
    return { success: false, error: auth.error };
  }

  const entries = Array.from(formData.getAll('images'));
  const files: File[] = entries.filter((e): e is File => e instanceof File);
  if (files.length === 0) {
    return { success: false, error: '画像が選択されていません' };
  }

  try {
    const uploaded = await uploadCompanyImages(auth.data.companyAccountId, files);
    return {
      success: true,
      files: uploaded.map(u => ({ url: u.publicUrl, path: u.path })),
    };
  } catch (e: any) {
    console.error('uploadCompanyAccountImagesAction error:', e);
    return { success: false, error: e?.message || 'アップロードに失敗しました' };
  }
}
