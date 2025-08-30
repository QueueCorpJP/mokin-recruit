'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { requireCandidateAuthForAction } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

export interface BlockedCompanySettings {
  company_names: string[];
}

export async function saveBlockedCompanies(companyNames: string[]) {
  const supabase = getSupabaseAdminClient();

  // Allow empty array for deletion scenarios
  if (!companyNames) {
    companyNames = [];
  }

  // Use custom auth system instead of Supabase auth
  const authResult = await requireCandidateAuthForAction();
  if (!authResult.success) {
    console.error('ブロック企業保存の認証エラー:', authResult.error);
    throw new Error(authResult.error);
  }

  console.log('Saving blocked companies for candidate_id:', authResult.data.candidateId);

  // First, try to update existing settings
  const { data: existingSettings, error: selectError } = await supabase
    .from('blocked_companies')
    .select('id')
    .eq('candidate_id', authResult.data.candidateId)
    .maybeSingle();

  if (companyNames.length === 0) {
    // If no companies to block, delete the record if it exists
    if (existingSettings) {
      const { error: deleteError } = await supabase
        .from('blocked_companies')
        .delete()
        .eq('candidate_id', authResult.data.candidateId);

      if (deleteError) {
        console.error('ブロック企業設定の削除に失敗しました:', deleteError);
        throw new Error('ブロック企業設定の削除に失敗しました');
      }
    }
    // If no existing settings and no companies, nothing to do
    return;
  }

  const settings = {
    company_names: companyNames,
  };

  if (existingSettings) {
    // Update existing settings
    const { error: updateError } = await supabase
      .from('blocked_companies')
      .update(settings)
      .eq('candidate_id', authResult.data.candidateId);

    if (updateError) {
      console.error('ブロック企業設定の更新に失敗しました:', updateError);
      throw new Error('ブロック企業設定の更新に失敗しました');
    }
  } else {
    // Insert new settings
    const { error: insertError } = await supabase
      .from('blocked_companies')
      .insert({
        candidate_id: authResult.data.candidateId,
        ...settings,
      });

    if (insertError) {
      console.error('ブロック企業設定の保存に失敗しました:', insertError);
      throw new Error('ブロック企業設定の保存に失敗しました');
    }
  }

  revalidatePath('/candidate/setting/ng-company');
}

export async function addBlockedCompany(companyName: string) {
  if (!companyName || !companyName.trim()) {
    throw new Error('企業名を入力してください');
  }

  // Get current blocked companies
  const currentSettings = await getBlockedCompanies();
  const currentCompanies = currentSettings ? currentSettings.company_names : [];

  // Check if company already exists
  if (currentCompanies.includes(companyName.trim())) {
    throw new Error('この企業は既にブロックリストに追加されています');
  }

  // Add new company to the list
  const updatedCompanies = [...currentCompanies, companyName.trim()];
  
  // Save updated list
  await saveBlockedCompanies(updatedCompanies);
}

export async function removeBlockedCompany(companyName: string) {
  if (!companyName) {
    throw new Error('削除する企業名が指定されていません');
  }

  // Get current blocked companies
  const currentSettings = await getBlockedCompanies();
  if (!currentSettings) {
    throw new Error('ブロック企業設定が見つかりません');
  }

  // Remove company from the list
  const updatedCompanies = currentSettings.company_names.filter(name => name !== companyName);
  
  // Save updated list
  await saveBlockedCompanies(updatedCompanies);
}

export async function getBlockedCompanies(): Promise<BlockedCompanySettings | null> {
  const supabase = getSupabaseAdminClient();
  
  const authResult = await requireCandidateAuthForAction();
  if (!authResult.success) {
    console.error('ブロック企業取得の認証エラー:', authResult.error);
    return null;
  }

  console.log('Searching blocked_companies with candidate_id:', authResult.data.candidateId);

  const { data, error } = await supabase
    .from('blocked_companies')
    .select('company_names')
    .eq('candidate_id', authResult.data.candidateId)
    .maybeSingle();

  if (error) {
    console.error('ブロック企業設定の取得に失敗しました:', error);
    
    // Try with string conversion
    const { data: dataStr, error: errorStr } = await supabase
      .from('blocked_companies')
      .select('company_names')
      .eq('candidate_id', String(authResult.data.candidateId))
      .maybeSingle();
    
    if (errorStr) {
      console.error('String変換でもブロック企業設定の取得に失敗しました:', errorStr);
      return null;
    } else {
      console.log('String変換でブロック企業設定を取得:', dataStr);
      return dataStr;
    }
  }

  console.log('ブロック企業設定を取得:', data);
  return data;
}