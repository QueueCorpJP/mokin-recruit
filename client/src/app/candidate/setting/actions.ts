'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { requireCandidateAuthForAction } from '@/lib/auth/server';

export interface NotificationSettings {
  scout_notification: 'receive' | 'not-receive';
  message_notification: 'receive' | 'not-receive';
  recommendation_notification: 'receive' | 'not-receive';
}

export interface ScoutSettings {
  scout_status: 'receive' | 'not-receive';
}

export interface UserSettings {
  email: string;
  scout_reception_enabled: boolean;
  notification_settings?: NotificationSettings;
  scout_settings?: ScoutSettings;
}

export async function getUserSettings(): Promise<UserSettings | null> {
  const supabase = getSupabaseAdminClient();
  
  const authResult = await requireCandidateAuthForAction();
  if (!authResult.success) {
    console.error('認証エラー:', authResult.error);
    return null;
  }

  console.log('Fetching user settings for candidateId:', authResult.data.candidateId);

  // Get user email and scout_reception_enabled from candidates table
  const { data: candidateData, error: candidateError } = await supabase
    .from('candidates')
    .select('email, scout_reception_enabled')
    .eq('id', authResult.data.candidateId)
    .maybeSingle();

  if (candidateError) {
    console.error('ユーザー情報の取得に失敗しました:', candidateError);
    return null;
  }

  if (!candidateData) {
    console.log('候補者データが見つかりません');
    return null;
  }

  console.log('Candidate data:', candidateData);

  // Get notification settings from notification_settings table
  console.log('Searching notification_settings with candidate_id:', authResult.data.candidateId);
  const { data: notificationData, error: notificationError } = await supabase
    .from('notification_settings')
    .select('scout_notification, message_notification, recommendation_notification')
    .eq('candidate_id', authResult.data.candidateId)
    .maybeSingle();

  if (notificationError) {
    console.error('通知設定の取得エラー:', notificationError);
    // Try with string conversion for scout_settings
    const { data: notificationDataStr, error: notificationErrorStr } = await supabase
      .from('notification_settings')
      .select('scout_notification, message_notification, recommendation_notification')
      .eq('candidate_id', String(authResult.data.candidateId))
      .maybeSingle();
    console.log('Notification settings with string conversion:', notificationDataStr, notificationErrorStr);
  } else {
    console.log('Notification settings found:', notificationData);
  }

  // Get scout settings from scout_settings table  
  console.log('Searching scout_settings with candidate_id:', authResult.data.candidateId);
  const { data: scoutData, error: scoutError } = await supabase
    .from('scout_settings')
    .select('scout_status')
    .eq('candidate_id', authResult.data.candidateId)
    .maybeSingle();

  if (scoutError) {
    console.error('スカウト設定の取得エラー:', scoutError);
    // Try with string conversion for scout_settings since candidate_id is TEXT
    const { data: scoutDataStr, error: scoutErrorStr } = await supabase
      .from('scout_settings')
      .select('scout_status')
      .eq('candidate_id', String(authResult.data.candidateId))
      .maybeSingle();
    console.log('Scout settings with string conversion:', scoutDataStr, scoutErrorStr);
  } else {
    console.log('Scout settings found:', scoutData);
  }

  // Use the successfully retrieved data, prioritizing string conversion attempts if needed
  let finalNotificationData = notificationData;
  let finalScoutData = scoutData;

  // If original queries failed, try to use string conversion results
  if (!notificationData && notificationError) {
    const { data: notificationDataStr } = await supabase
      .from('notification_settings')
      .select('scout_notification, message_notification, recommendation_notification')
      .eq('candidate_id', String(authResult.data.candidateId))
      .maybeSingle();
    finalNotificationData = notificationDataStr;
  }

  if (!scoutData && scoutError) {
    const { data: scoutDataStr } = await supabase
      .from('scout_settings')
      .select('scout_status')
      .eq('candidate_id', String(authResult.data.candidateId))
      .maybeSingle();
    finalScoutData = scoutDataStr;
  }

  const result = {
    ...candidateData,
    notification_settings: finalNotificationData || undefined,
    scout_settings: finalScoutData || undefined,
  };

  console.log('Final user settings result:', result);

  return result;
}