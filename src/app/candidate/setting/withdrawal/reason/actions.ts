'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { requireCandidateAuthForAction } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export interface WithdrawalData {
  reason: string;
  reasonLabel: string;
}

export async function processWithdrawal(withdrawalReason: string) {
  if (!withdrawalReason) {
    throw new Error('退会理由が選択されていません。');
  }

  const supabase = getSupabaseAdminClient();
  
  // 認証確認
  const authResult = await requireCandidateAuthForAction();
  if (!authResult.success) {
    console.error('退会処理の認証エラー:', authResult.error);
    throw new Error('認証に失敗しました。');
  }

  console.log('退会処理開始 - candidate_id:', authResult.data.candidateId);

  try {
    // 候補者の情報を取得
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('last_name, first_name, email')
      .eq('id', authResult.data.candidateId)
      .single();

    if (candidateError || !candidate) {
      console.error('候補者情報の取得に失敗:', candidateError);
      throw new Error('候補者情報の取得に失敗しました。');
    }

    // 退会理由のラベルをマッピング
    const reasonLabels: { [key: string]: string } = {
      'finished_job_hunting': '転職活動を終えた',
      'no_matching_scouts': '希望条件に合致するスカウトがなかった',
      'no_matching_jobs': '希望条件に合致する求人がなかった',
      'service_difficult': 'サービスが使いにくい',
      'other': 'その他'
    };

    const reasonLabel = reasonLabels[withdrawalReason] || withdrawalReason;

    // 候補者の名前を結合
    const candidateName = `${candidate.last_name || ''} ${candidate.first_name || ''}`.trim();

    // 退会者リストテーブルに記録
    const { error: withdrawnError } = await supabase
      .from('withdrawn_candidates')
      .insert({
        candidate_id: authResult.data.candidateId,
        candidate_name: candidateName,
        email: candidate.email,
        withdrawal_reason: withdrawalReason,
        withdrawal_reason_label: reasonLabel
      });

    if (withdrawnError) {
      console.error('退会者リストへの記録に失敗:', withdrawnError);
      throw new Error('退会処理中にエラーが発生しました。');
    }

    // TODO: 実際の退会処理（候補者アカウントの無効化など）をここで実行
    // 例: candidatesテーブルのis_activeをfalseにする、関連データの削除など
    
    console.log('退会処理完了 - candidate_id:', authResult.data.candidateId, 'reason:', reasonLabel);

  } catch (error) {
    console.error('退会処理でエラー発生:', error);
    throw new Error('退会処理中にエラーが発生しました。');
  }

  // 退会完了ページにリダイレクト
  redirect('/candidate/setting/withdrawal/complete');
}