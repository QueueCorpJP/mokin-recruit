'use server';

import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { revalidatePath } from 'next/cache';

// 企業編集データの型定義
export interface CompanyEditFormData {
  companyId: string;
  plan: string;
  companyName: string;
  urls: Array<{
    title: string;
    url: string;
  }>;
  iconImage: File | null;
  representativePosition: string;
  representativeName: string;
  establishedYear: string;
  capital: string;
  capitalUnit: string;
  employeeCount: string;
  industries: string[];
  businessContent: string;
  prefecture: string;
  address: string;
  companyPhase: string;
  images: File[];
  attractions: Array<{
    title: string;
    description: string;
  }>;
}

// 企業編集データのバリデーションスキーマ
const UpdateCompanySchema = z.object({
  companyName: z.string().min(1, '企業名を入力してください'),
  plan: z.enum(['basic', 'standard'], {
    errorMap: () => ({ message: 'プランを選択してください' })
  }),
  representativeName: z.string().min(1, '代表者名を入力してください'),
  industries: z.array(z.string()).min(1, '業種を少なくとも1つ選択してください'),
  prefecture: z.string().min(1, '都道府県を選択してください'),
  address: z.string().min(1, '住所を入力してください'),
});

export async function validateCompanyEditData(formData: Partial<CompanyEditFormData>) {
  const validationResult = UpdateCompanySchema.safeParse({
    companyName: formData.companyName,
    plan: formData.plan,
    representativeName: formData.representativeName,
    industries: formData.industries,
    prefecture: formData.prefecture,
    address: formData.address,
  });

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map(error => ({
      field: error.path.join('.'),
      message: error.message
    }));
    return { success: false, errors };
  }
  return { success: true, data: validationResult.data };
}

export async function updateCompanyData(
  companyId: string,
  formData: CompanyEditFormData
) {
  try {
    // Step 1: Validate input data
    const validation = await validateCompanyEditData(formData);
    if (!validation.success) {
      return {
        success: false,
        error: validation.errors?.[0]?.message || '入力データが正しくありません',
        validationErrors: validation.errors
      };
    }

    const supabase = getSupabaseAdminClient();

    // Step 2: Prepare update data
    // Combine prefecture and address for headquarters_address
    const headquartersAddress = formData.prefecture && formData.address
      ? `${formData.prefecture} ${formData.address}`
      : formData.prefecture || formData.address || '';

    // Create company overview from business content
    const companyOverview = formData.businessContent || '';

    // Use first industry as primary industry (current schema limitation)
    const primaryIndustry = formData.industries.length > 0 ? formData.industries[0] : '';

    const updateData = {
      company_name: formData.companyName,
      industry: primaryIndustry,
      headquarters_address: headquartersAddress,
      representative_name: formData.representativeName,
      company_overview: companyOverview,
      plan: formData.plan,
      updated_at: new Date().toISOString(),
    };

    // Step 3: Update company data
    const { data: updatedCompany, error: updateError } = await supabase
      .from('company_accounts')
      .update(updateData)
      .eq('id', companyId)
      .select('id, company_name, updated_at')
      .single();

    if (updateError) {
      if (process.env.NODE_ENV === 'development') console.error('Company update error:', updateError);
      return {
        success: false,
        error: `企業情報の更新に失敗しました: ${updateError.message}`
      };
    }

    if (process.env.NODE_ENV === 'development') console.log('Company updated successfully:', updatedCompany);
    if (process.env.NODE_ENV === 'development') console.log(`[Company Edit] Revalidating paths: /admin/company/${companyId} and /admin/company`);

    // Step 4: Revalidate the company detail page and company list page
    revalidatePath(`/admin/company/${companyId}`);
    revalidatePath('/admin/company');

    return {
      success: true,
      company: updatedCompany
    };

  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error updating company:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}