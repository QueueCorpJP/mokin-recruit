'use server';

import { revalidatePath } from 'next/cache';
import {
  upsertByCandidateId,
  getSingleByCandidateId,
  getCandidateIdOrNull,
} from '@/app/candidate/setting/_shared/server/settings-utils';
import type { BlockedCompanySettings } from '@/app/candidate/setting/_shared/types';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';

export async function saveBlockedCompanies(companyNames: string[]) {
  if (!companyNames) companyNames = [];

  // 空配列ならレコードを削除（互換維持のため既存挙動を踏襲）
  if (companyNames.length === 0) {
    const supabase = await getSupabaseServerClient();
    const candidateId = await getCandidateIdOrNull();
    if (!candidateId) throw new Error('認証に失敗しました');

    const { data: existing } = await supabase
      .from('blocked_companies')
      .select('id')
      .eq('candidate_id', candidateId)
      .maybeSingle();

    if (existing) {
      const { error: deleteError } = await supabase
        .from('blocked_companies')
        .delete()
        .eq('candidate_id', candidateId);
      if (deleteError) {
        console.error('ブロック企業設定の削除に失敗しました:', deleteError);
        throw new Error('ブロック企業設定の削除に失敗しました');
      }
    }
    return;
  }

  const result = await upsertByCandidateId('blocked_companies', {
    company_names: companyNames,
  });
  if (!result.success) {
    throw new Error(result.error);
  }

  revalidatePath('/candidate/setting/ng-company');
}

export async function addBlockedCompany(companyName: string) {
  if (!companyName || !companyName.trim()) {
    throw new Error('企業名を入力してください');
  }
  const currentSettings = await getBlockedCompanies();
  const currentCompanies = currentSettings ? currentSettings.company_names : [];
  if (currentCompanies.includes(companyName.trim())) {
    throw new Error('この企業は既にブロックリストに追加されています');
  }
  const updated = [...currentCompanies, companyName.trim()];
  await saveBlockedCompanies(updated);
}

export async function removeBlockedCompany(companyName: string) {
  if (!companyName) {
    throw new Error('削除する企業名が指定されていません');
  }
  const currentSettings = await getBlockedCompanies();
  if (!currentSettings) {
    throw new Error('ブロック企業設定が見つかりません');
  }
  const updated = currentSettings.company_names.filter(n => n !== companyName);
  await saveBlockedCompanies(updated);
}

export async function getBlockedCompanies(): Promise<BlockedCompanySettings | null> {
  return getSingleByCandidateId<BlockedCompanySettings>(
    'blocked_companies',
    'company_names'
  );
}
