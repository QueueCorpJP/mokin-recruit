'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { requireCandidateAuthForAction } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

export interface ScoutSettings {
  scout_status: 'receive' | 'not-receive';
}

export async function saveScoutSettings(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  
  const scoutStatus = formData.get('scoutStatus') as string;

  if (!scoutStatus) {
    throw new Error('スカウトステータスを選択してください');
  }

  // Use custom auth system instead of Supabase auth
  const authResult = await requireCandidateAuthForAction();
  if (!authResult.success) {
    console.error('スカウト設定保存の認証エラー:', authResult.error);
    throw new Error(authResult.error);
  }

  console.log('Saving scout settings for candidate_id:', authResult.data.candidateId);

  const settings = {
    scout_status: scoutStatus as 'receive' | 'not-receive',
  };

  // First, try to update existing settings
  const { data: existingSettings, error: selectError } = await supabase
    .from('scout_settings')
    .select('id')
    .eq('candidate_id', authResult.data.candidateId)
    .maybeSingle();

  if (existingSettings) {
    // Update existing settings
    const { error: updateError } = await supabase
      .from('scout_settings')
      .update(settings)
      .eq('candidate_id', authResult.data.candidateId);

    if (updateError) {
      console.error('スカウト設定の更新に失敗しました:', updateError);
      throw new Error('スカウト設定の更新に失敗しました');
    }
  } else {
    // Insert new settings
    const { error: insertError } = await supabase
      .from('scout_settings')
      .insert({
        candidate_id: authResult.data.candidateId,
        ...settings,
      });

    if (insertError) {
      console.error('スカウト設定の保存に失敗しました:', insertError);
      throw new Error('スカウト設定の保存に失敗しました');
    }
  }

  revalidatePath('/candidate/setting/scout');
}

export async function getScoutSettings(): Promise<ScoutSettings | null> {
  const supabase = await getSupabaseServerClient();
  
  const authResult = await requireCandidateAuthForAction();
  if (!authResult.success) {
    console.error('スカウト設定取得の認証エラー:', authResult.error);
    return null;
  }

  console.log('Getting scout settings for candidate_id:', authResult.data.candidateId);

  const { data, error } = await supabase
    .from('scout_settings')
    .select('scout_status')
    .eq('candidate_id', authResult.data.candidateId)
    .maybeSingle();

  if (error) {
    console.error('スカウト設定の取得に失敗しました:', error);
    
    // Try with string conversion since scout_settings.candidate_id is TEXT
    const { data: dataStr, error: errorStr } = await supabase
      .from('scout_settings')
      .select('scout_status')
      .eq('candidate_id', String(authResult.data.candidateId))
      .maybeSingle();
    
    if (errorStr) {
      console.error('String変換でもスカウト設定の取得に失敗しました:', errorStr);
      return null;
    } else {
      console.log('String変換でスカウト設定を取得:', dataStr);
      return dataStr;
    }
  }

  console.log('スカウト設定を取得:', data);
  return data;
}