'use server';

import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { revalidatePath } from 'next/cache';

// 企業作成データの型定義
export interface CompanyFormData {
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

// 企業作成データのバリデーションスキーマ
const CreateCompanySchema = z.object({
  companyName: z.string().min(1, '企業名を入力してください'),
  plan: z.enum(['basic', 'standard'], {
    errorMap: () => ({ message: 'プランを選択してください' })
  }),
  representativeName: z.string().min(1, '代表者名を入力してください'),
  industries: z.array(z.string()).min(1, '業種を少なくとも1つ選択してください'),
  prefecture: z.string().min(1, '都道府県を選択してください'),
  address: z.string().min(1, '住所を入力してください'),
});

export async function validateCompanyData(formData: Partial<CompanyFormData>) {
  const validationResult = CreateCompanySchema.safeParse({
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

export async function checkCompanyNameDuplication(companyName: string) {
  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from('company_accounts')
      .select('id')
      .eq('company_name', companyName);

    if (error) {
      throw error;
    }

    return { isDuplicate: data && data.length > 0 };
  } catch (error) {
    console.error('Error checking company name duplication:', error);
    return { isDuplicate: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function createCompanyData(formData: CompanyFormData) {
  try {
    // Step 1: Validate input data
    const validation = await validateCompanyData(formData);
    if (!validation.success) {
      return {
        success: false,
        error: validation.errors?.[0]?.message || '入力データが正しくありません',
        validationErrors: validation.errors
      };
    }

    // Step 2: Check company name duplication
    const nameCheck = await checkCompanyNameDuplication(formData.companyName);
    if (nameCheck.error) {
      return {
        success: false,
        error: nameCheck.error
      };
    }
    if (nameCheck.isDuplicate) {
      return {
        success: false,
        error: 'この企業名は既に登録されています。'
      };
    }

    const supabase = getSupabaseAdminClient();

    // Step 3: Prepare company data for insertion
    // Combine prefecture and address for headquarters_address
    const headquartersAddress = formData.prefecture && formData.address
      ? `${formData.prefecture} ${formData.address}`
      : formData.prefecture || formData.address || '';

    // Create company overview from business content and attractions
    const companyOverview = formData.businessContent || '';

    // Use first industry as primary industry (current schema limitation)
    const primaryIndustry = formData.industries.length > 0 ? formData.industries[0] : '';

    const companyInsertData = {
      company_name: formData.companyName,
      industry: primaryIndustry,
      headquarters_address: headquartersAddress,
      representative_name: formData.representativeName,
      company_overview: companyOverview,
      plan: formData.plan,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Step 4: Insert company data
    const { data: company, error: companyError } = await supabase
      .from('company_accounts')
      .insert(companyInsertData)
      .select('id')
      .single();

    if (companyError) {
      console.error('Company creation error:', companyError);
      throw companyError;
    }

    console.log('Created company:', company);
    const companyId = String(company.id);

    // Step 5: Create company group (required for company structure)
    const { error: groupError } = await supabase
      .from('company_groups')
      .insert({
        company_account_id: companyId,
        group_name: `${formData.companyName} 本社`,
        description: '本社グループ',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (groupError) {
      console.error('Company group creation error:', groupError);
      // Don't throw here as company is already created
      console.warn('Failed to create company group, but company was created successfully');
    }

    // Step 6: Revalidate the company list page
    revalidatePath('/admin/company');

    console.log('Company creation completed successfully with ID:', companyId);
    return { success: true, companyId };
  } catch (error) {
    console.error('Error creating company:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
