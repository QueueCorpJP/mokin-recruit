// サーバーアクション: メッセージの承認・非承認を保存
'use server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export async function updateMessageApprovalStatus(
  messageId: string,
  status: '承認' | '非承認',
  reason: string,
  comment: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient();
  const updateObj: any = {
    approval_status: status,
  };
  if (status === '承認') {
    if (!reason) {
      return { success: false, error: '承認理由は必須です' };
    }
    updateObj.approval_reason = reason;
    updateObj.approval_comment = comment;
  } else {
    updateObj.approval_reason = null;
    updateObj.approval_comment = null;
  }
  const { error } = await supabase
    .from('messages')
    .update(updateObj)
    .eq('id', messageId);
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
