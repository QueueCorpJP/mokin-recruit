'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { revalidateTag } from 'next/cache';

export async function deleteBlockedCompany(candidateId: string, companyName: string) {
  try {
    const supabase = getSupabaseAdminClient();
    
    // 現在のブロック企業データを取得
    const { data: currentData, error: fetchError } = await supabase
      .from('blocked_companies')
      .select('*')
      .eq('candidate_id', candidateId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching blocked companies:', fetchError);
      return { success: false, error: 'ブロック企業データの取得に失敗しました' };
    }
    
    if (!currentData) {
      return { success: false, error: 'ブロック企業データが見つかりません' };
    }
    
    // 指定された企業名を配列から削除
    const updatedCompanyNames = currentData.company_names.filter(
      (name: string) => name !== companyName
    );
    
    // 配列が空になった場合はレコード自体を削除
    if (updatedCompanyNames.length === 0) {
      const { error: deleteError } = await supabase
        .from('blocked_companies')
        .delete()
        .eq('candidate_id', candidateId);
        
      if (deleteError) {
        console.error('Error deleting blocked company record:', deleteError);
        return { success: false, error: 'ブロック企業レコードの削除に失敗しました' };
      }
    } else {
      // 企業名配列を更新
      const { error: updateError } = await supabase
        .from('blocked_companies')
        .update({ 
          company_names: updatedCompanyNames,
          updated_at: new Date().toISOString()
        })
        .eq('candidate_id', candidateId);
        
      if (updateError) {
        console.error('Error updating blocked companies:', updateError);
        return { success: false, error: 'ブロック企業の更新に失敗しました' };
      }
    }
    
    // キャッシュを再検証
    revalidateTag('blocked-companies');
    
    return { success: true };
  } catch (error) {
    console.error('Error in deleteBlockedCompany:', error);
    return { success: false, error: 'システムエラーが発生しました' };
  }
}

export async function addBlockedCompany(candidateId: string, companyName: string) {
  try {
    const supabase = getSupabaseAdminClient();
    
    // 既存のブロック企業データを確認
    const { data: existingData, error: fetchError } = await supabase
      .from('blocked_companies')
      .select('*')
      .eq('candidate_id', candidateId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = No rows found
      console.error('Error fetching blocked companies:', fetchError);
      return { success: false, error: 'ブロック企業データの取得に失敗しました' };
    }
    
    if (existingData) {
      // 既に同じ企業名が存在するかチェック
      if (existingData.company_names.includes(companyName)) {
        return { success: false, error: 'この企業は既にブロックされています' };
      }
      
      // 既存の配列に新しい企業名を追加
      const updatedCompanyNames = [...existingData.company_names, companyName];
      
      const { error: updateError } = await supabase
        .from('blocked_companies')
        .update({ 
          company_names: updatedCompanyNames,
          updated_at: new Date().toISOString()
        })
        .eq('candidate_id', candidateId);
        
      if (updateError) {
        console.error('Error updating blocked companies:', updateError);
        return { success: false, error: 'ブロック企業の追加に失敗しました' };
      }
    } else {
      // 新しいレコードを作成
      const { error: insertError } = await supabase
        .from('blocked_companies')
        .insert({
          candidate_id: candidateId,
          company_names: [companyName],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (insertError) {
        console.error('Error inserting blocked company:', insertError);
        return { success: false, error: 'ブロック企業の追加に失敗しました' };
      }
    }
    
    // キャッシュを再検証
    revalidateTag('blocked-companies');
    
    return { success: true };
  } catch (error) {
    console.error('Error in addBlockedCompany:', error);
    return { success: false, error: 'システムエラーが発生しました' };
  }
}