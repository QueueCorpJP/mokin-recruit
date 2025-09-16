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

// 企業作成データのバリデーションスキーマ（database.mdスキーマに完全対応）
const CreateCompanySchema = z.object({
  companyId: z.string().min(1, '企業IDが必要です'),
  companyName: z.string().min(1, '企業名を入力してください'),
  plan: z.enum(['basic', 'standard'], {
    errorMap: () => ({ message: '有効なプランを選択してください' }),
  }),
  representativeName: z.string().optional(),
  representativePosition: z.string().optional(),
  industries: z.array(z.string()).min(1, '業種を選択してください'),
  businessContent: z.string().optional(),
  prefecture: z.string().optional(),
  address: z.string().optional(),
  establishedYear: z.string().optional(),
  capital: z.string().optional(),
  capitalUnit: z.enum(['万円', '億円']).optional(),
  employeeCount: z.string().optional(),
  companyPhase: z
    .enum([
      'スタートアップ（創業初期・社員数50名規模）',
      'スタートアップ（成長中・シリーズB以降）',
      'メガベンチャー（急成長・未上場）',
      '上場ベンチャー（マザーズ等上場済）',
      '中堅企業（~1000名規模）',
      '上場企業（プライム・スタンダード等）',
      '大企業（グローバル展開・数千名規模）',
    ])
    .optional(),
  urls: z
    .array(
      z.object({
        title: z.string(),
        url: z.string(),
      })
    )
    .optional(),
  attractions: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .optional(),
});

export async function validateCompanyData(formData: Partial<CompanyFormData>) {
  const validationResult = CreateCompanySchema.safeParse({
    companyId: formData.companyId,
    companyName: formData.companyName,
    plan: formData.plan,
    representativeName: formData.representativeName,
    representativePosition: formData.representativePosition,
    industries: formData.industries,
    businessContent: formData.businessContent,
    prefecture: formData.prefecture,
    address: formData.address,
    establishedYear: formData.establishedYear,
    capital: formData.capital,
    capitalUnit: formData.capitalUnit,
    employeeCount: formData.employeeCount,
    companyPhase: formData.companyPhase,
    urls: formData.urls,
    attractions: formData.attractions,
  });

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map(error => ({
      field: error.path.join('.'),
      message: error.message,
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
    return {
      isDuplicate: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function createCompanyData(formData: CompanyFormData) {
  try {
    // Step 1: Validate input data
    const validation = await validateCompanyData(formData);
    if (!validation.success) {
      return {
        success: false,
        error:
          validation.errors?.[0]?.message || '入力データが正しくありません',
        validationErrors: validation.errors,
      };
    }

    // Step 2: Check company name duplication
    const nameCheck = await checkCompanyNameDuplication(formData.companyName);
    if (nameCheck.error) {
      return {
        success: false,
        error: nameCheck.error,
      };
    }
    if (nameCheck.isDuplicate) {
      return {
        success: false,
        error: 'この企業名は既に登録されています。',
      };
    }

    const supabase = getSupabaseAdminClient();

    // Step 3: Prepare company data for insertion (完全なデータマッピング)
    const headquartersAddress =
      formData.prefecture && formData.address
        ? `${formData.prefecture} ${formData.address}`
        : formData.prefecture || formData.address || '';

    // 業種は最初の1つを primary industry として使用し、全業種は industries に保存
    const primaryIndustry =
      formData.industries.length > 0 ? formData.industries[0] : '';

    // 資本金の数値変換
    const capitalAmount = formData.capital
      ? parseInt(formData.capital.replace(/[^\d]/g, ''), 10)
      : null;

    // 従業員数の数値変換
    const employeesCount = formData.employeeCount
      ? parseInt(formData.employeeCount.replace(/[^\d]/g, ''), 10)
      : null;

    // 設立年の数値変換
    const establishedYear = formData.establishedYear
      ? parseInt(formData.establishedYear, 10)
      : null;

    const companyInsertData = {
      // 基本情報
      company_name: formData.companyName,
      industry: primaryIndustry,
      headquarters_address: headquartersAddress,
      representative_name: formData.representativeName,
      representative_position: formData.representativePosition || null,
      company_overview: formData.businessContent || null,
      plan: formData.plan,
      status: 'ACTIVE',

      // 詳細情報
      established_year: establishedYear,
      capital_amount: capitalAmount,
      capital_unit: formData.capitalUnit || null,
      employees_count: employeesCount,
      prefecture: formData.prefecture || null,
      address: formData.address || null,
      company_phase: formData.companyPhase || null,
      business_content: formData.businessContent || null,

      // JSON形式のデータ（jsonb カラムには配列/オブジェクトをそのまま保存）
      industries: formData.industries.length > 0 ? formData.industries : [],
      company_urls: formData.urls.length > 0 ? formData.urls : [],
      company_attractions:
        formData.attractions.length > 0 ? formData.attractions : [],

      // 画像URL（現在は空配列、将来的にファイルアップロード機能追加時に対応）
      icon_image_url: null,
      company_images: [],

      // タイムスタンプ
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
    const { error: groupError } = await supabase.from('company_groups').insert({
      company_account_id: companyId,
      group_name: `${formData.companyName} 本社`,
      description: '本社グループ',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (groupError) {
      console.error('Company group creation error:', groupError);
      // Don't throw here as company is already created
      console.warn(
        'Failed to create company group, but company was created successfully'
      );
    }

    // Step 6: Revalidate the company list page
    revalidatePath('/admin/company');

    console.log('Company creation completed successfully with ID:', companyId);
    return { success: true, companyId };
  } catch (error) {
    console.error('Error creating company:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
