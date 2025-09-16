'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export async function deleteCandidate(candidateId: string) {
  try {
    // TODO: 実際のSupabase削除処理を実装
    console.log('Deleting candidate:', candidateId);

    // 仮の処理時間をシミュレート
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true };
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return {
      success: false,
      error: '候補者の削除に失敗しました',
    };
  }
}

export async function updateCandidateMemo(candidateId: string, memo: string) {
  try {
    // admin_memo カラムはスキーマに存在しないため、保存処理は無効化します
    return { success: false, error: 'この環境ではメモ保存に対応していません' };
  } catch (error) {
    console.error('Error updating memo:', error);
    return {
      success: false,
      error: 'この環境ではメモ保存に対応していません',
    };
  }
}
