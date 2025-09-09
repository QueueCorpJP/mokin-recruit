'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { requireCandidateAuthForAction } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface NotificationSettings {
  scout_notification: 'receive' | 'not-receive';
  message_notification: 'receive' | 'not-receive';
  recommendation_notification: 'receive' | 'not-receive';
}

export async function saveNotificationSettings(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  
  const scoutNotification = formData.get('scoutNotification') as string;
  const messageNotification = formData.get('messageNotification') as string;
  const recommendationNotification = formData.get('recommendationNotification') as string;

  if (!scoutNotification || !messageNotification || !recommendationNotification) {
    throw new Error('すべての通知設定を選択してください');
  }

  // Use custom auth system instead of Supabase auth
  const authResult = await requireCandidateAuthForAction();
  if (!authResult.success) {
    console.error('通知設定保存の認証エラー:', authResult.error);
    throw new Error(authResult.error);
  }

  console.log('Saving notification settings for candidate_id:', authResult.data.candidateId);

  const settings = {
    scout_notification: scoutNotification as 'receive' | 'not-receive',
    message_notification: messageNotification as 'receive' | 'not-receive',
    recommendation_notification: recommendationNotification as 'receive' | 'not-receive',
  };

  // First, try to update existing settings
  const { data: existingSettings, error: selectError } = await supabase
    .from('notification_settings')
    .select('id')
    .eq('candidate_id', authResult.data.candidateId)
    .single();

  if (existingSettings) {
    // Update existing settings
    const { error: updateError } = await supabase
      .from('notification_settings')
      .update(settings)
      .eq('candidate_id', authResult.data.candidateId);

    if (updateError) {
      console.error('通知設定の更新に失敗しました:', updateError);
      throw new Error('通知設定の更新に失敗しました');
    }
  } else {
    // Insert new settings
    const { error: insertError } = await supabase
      .from('notification_settings')
      .insert({
        candidate_id: authResult.data.candidateId,
        ...settings,
      });

    if (insertError) {
      console.error('通知設定の保存に失敗しました:', insertError);
      throw new Error('通知設定の保存に失敗しました');
    }
  }

  revalidatePath('/candidate/setting/notification');
  redirect('/candidate/setting/notification/complete');
}

export async function getNotificationSettings(): Promise<NotificationSettings | null> {
  const supabase = await getSupabaseServerClient();
  
  const authResult = await requireCandidateAuthForAction();
  if (!authResult.success) {
    console.error('通知設定取得の認証エラー:', authResult.error);
    return null;
  }

  console.log('Getting notification settings for candidate_id:', authResult.data.candidateId);

  const { data, error } = await supabase
    .from('notification_settings')
    .select('scout_notification, message_notification, recommendation_notification')
    .eq('candidate_id', authResult.data.candidateId)
    .single();

  if (error) {
    console.error('通知設定の取得に失敗しました:', error);
    
    // Try with string conversion
    const { data: dataStr, error: errorStr } = await supabase
      .from('notification_settings')
      .select('scout_notification, message_notification, recommendation_notification')
      .eq('candidate_id', String(authResult.data.candidateId))
      .single();
    
    if (errorStr) {
      console.error('String変換でも通知設定の取得に失敗しました:', errorStr);
      return null;
    } else {
      console.log('String変換で通知設定を取得:', dataStr);
      return dataStr;
    }
  }

  console.log('通知設定を取得:', data);
  return data;
}