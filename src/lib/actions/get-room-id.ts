'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server-client';

/**
 * 候補者と企業グループ間のroomIDを取得する
 * @param candidateId - 候補者ID
 * @param companyGroupId - 企業グループID
 * @returns roomID or null
 */
export async function getRoomIdAction(candidateId: string, companyGroupId: string): Promise<string | null> {
  try {
    console.log('🔍 [getRoomIdAction] 検索条件:', { candidateId, companyGroupId });
    // 修正されたRLSポリシーによりServer clientを使用可能
    const supabase = await getSupabaseServerClient();
    
    // まず全てのroomsの構造を確認
    const { data: allRooms, error: allRoomsError } = await supabase
      .from('rooms')
      .select('id, candidate_id, company_group_id, type')
      .limit(10);
    
    console.log('🔍 [getRoomIdAction] 全室情報:', { allRooms, allRoomsError });
    
    // candidateIdに一致するroomを確認
    const { data: candidateRooms, error: candidateRoomsError } = await supabase
      .from('rooms')
      .select('id, candidate_id, company_group_id, type')
      .eq('candidate_id', candidateId);
    
    console.log('🔍 [getRoomIdAction] 候補者一致rooms:', { candidateRooms, candidateRoomsError });
    
    // companyGroupIdに一致するroomを確認
    const { data: companyRooms, error: companyRoomsError } = await supabase
      .from('rooms')
      .select('id, candidate_id, company_group_id, type')
      .eq('company_group_id', companyGroupId);
    
    console.log('🔍 [getRoomIdAction] 企業グループ一致rooms:', { companyRooms, companyRoomsError });
    
    const { data: room, error } = await supabase
      .from('rooms')
      .select('id')
      .eq('candidate_id', candidateId)
      .eq('company_group_id', companyGroupId)
      .eq('type', 'direct')
      .single();
    
    console.log('🔍 [getRoomIdAction] 厳密一致結果:', { room, error });
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('❌ [getRoomIdAction] Room not found:', { candidateId, companyGroupId });
        return null;
      }
      console.error('❌ [getRoomIdAction] Room lookup error:', error);
      return null;
    }
    
    console.log('✅ [getRoomIdAction] Found room:', room?.id);
    return room?.id || null;
  } catch (error) {
    console.error('❌ [getRoomIdAction] Error getting room ID:', error);
    return null;
  }
}