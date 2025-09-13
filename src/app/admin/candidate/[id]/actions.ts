'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export async function deleteCandidate(candidateId: string) {
  try {
    // TODO: 実際のSupabase削除処理を実装
    if (process.env.NODE_ENV === 'development') console.log('Deleting candidate:', candidateId);
    
    // 仮の処理時間をシミュレート
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error deleting candidate:', error);
    return { 
      success: false, 
      error: '候補者の削除に失敗しました' 
    };
  }
}

export async function updateCandidateMemo(candidateId: string, memo: string) {
  try {
    const supabase = getSupabaseAdminClient();
    
    const { error } = await supabase
      .from('candidates')
      .update({ admin_memo: memo })
      .eq('id', candidateId);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error updating memo:', error);
    return { 
      success: false, 
      error: 'メモの更新に失敗しました' 
    };
  }
}