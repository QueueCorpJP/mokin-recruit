'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { requireCandidateAuthForAction } from '@/lib/auth/server';

export interface UpsertOptions {
  revalidatePath?: string;
}

type TableName =
  | 'notification_settings'
  | 'scout_settings'
  | 'blocked_companies';

export async function getCandidateIdOrNull(): Promise<string | null> {
  const authResult = await requireCandidateAuthForAction();
  if (!authResult.success) return null;
  return authResult.data.candidateId;
}

export async function getSingleByCandidateId<T>(
  table: TableName,
  select: string
): Promise<T | null> {
  const supabase = await getSupabaseServerClient();
  const candidateId = await getCandidateIdOrNull();
  if (!candidateId) return null;

  // まずはそのままの型で検索
  const { data, error } = await supabase
    .from(table)
    .select(select)
    .eq('candidate_id', candidateId)
    .maybeSingle();

  if (!error) return data as unknown as T;

  // 文字列として再試行（テーブルによってはTEXTの可能性があるため）
  const { data: dataStr, error: errorStr } = await supabase
    .from(table)
    .select(select)
    .eq('candidate_id', String(candidateId))
    .maybeSingle();

  if (errorStr) return null;
  return dataStr as unknown as T;
}

export async function upsertByCandidateId<T extends object>(
  table: TableName,
  payload: T
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = await getSupabaseServerClient();
  const authResult = await requireCandidateAuthForAction();
  if (!authResult.success) {
    return { success: false, error: authResult.error };
  }

  const candidateId = authResult.data.candidateId;

  const { data: existing, error: selectError } = await supabase
    .from(table)
    .select('id')
    .eq('candidate_id', candidateId)
    .maybeSingle();

  if (selectError) {
    // select失敗時もinsertで回復できるケースがあるため続行しない
    console.error('[settings-utils] select error on %s:', table, selectError);
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from(table)
      .update(payload)
      .eq('candidate_id', candidateId);
    if (updateError) {
      console.error('[settings-utils] update error on %s:', table, updateError);
      return { success: false, error: '更新に失敗しました' };
    }
    return { success: true };
  }

  const { error: insertError } = await supabase
    .from(table)
    .insert({ candidate_id: candidateId, ...payload });
  if (insertError) {
    console.error('[settings-utils] insert error on %s:', table, insertError);
    return { success: false, error: '保存に失敗しました' };
  }
  return { success: true };
}
