'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { requireCandidateAuthForAction } from '@/lib/auth/server';

// 簡単なメモリキャッシュ
const userSettingsCache = new Map<string, { data: any; timestamp: number }>();
const USER_SETTINGS_CACHE_TTL = 1 * 60 * 1000; // 1分

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
  const authResult = await requireCandidateAuthForAction();
  if (!authResult.success) {
    if (process.env.NODE_ENV === 'development') console.error('認証エラー:', authResult.error);
    return null;
  }

  const candidateId = authResult.data.candidateId;

  // キャッシュキーの生成
  const cacheKey = candidateId;
  const cached = userSettingsCache.get(cacheKey);
  
  // 期限切れキャッシュを即座に削除
  if (cached && Date.now() - cached.timestamp >= USER_SETTINGS_CACHE_TTL) {
    userSettingsCache.delete(cacheKey);
  } else if (cached) {
    return cached.data;
  }
  if (process.env.NODE_ENV === 'development') console.log('Fetching user settings for candidateId:', candidateId);

  const supabase = await getSupabaseServerClient();

  // Get user email and scout_reception_enabled from candidates table
  const { data: candidateData, error: candidateError } = await supabase
    .from('candidates')
    .select('email, scout_reception_enabled')
    .eq('id', candidateId)
    .maybeSingle();

  if (candidateError) {
    if (process.env.NODE_ENV === 'development') console.error('ユーザー情報の取得に失敗しました:', candidateError);
    return null;
  }

  if (!candidateData) {
    if (process.env.NODE_ENV === 'development') console.log('候補者データが見つかりません');
    return null;
  }

  if (process.env.NODE_ENV === 'development') console.log('Candidate data:', candidateData);

  // Get notification settings from notification_settings table
  if (process.env.NODE_ENV === 'development') console.log('Searching notification_settings with candidate_id:', candidateId);
  const { data: notificationData, error: notificationError } = await supabase
    .from('notification_settings')
    .select('scout_notification, message_notification, recommendation_notification')
    .eq('candidate_id', candidateId)
    .maybeSingle();

  if (notificationError) {
    if (process.env.NODE_ENV === 'development') console.error('通知設定の取得エラー:', notificationError);
    // Try with string conversion for scout_settings
    const { data: notificationDataStr, error: notificationErrorStr } = await supabase
      .from('notification_settings')
      .select('scout_notification, message_notification, recommendation_notification')
      .eq('candidate_id', String(candidateId))
      .maybeSingle();
    if (process.env.NODE_ENV === 'development') console.log('Notification settings with string conversion:', notificationDataStr, notificationErrorStr);
  } else {
    if (process.env.NODE_ENV === 'development') console.log('Notification settings found:', notificationData);
  }

  // Get scout settings from scout_settings table  
  if (process.env.NODE_ENV === 'development') console.log('Searching scout_settings with candidate_id:', candidateId);
  const { data: scoutData, error: scoutError } = await supabase
    .from('scout_settings')
    .select('scout_status')
    .eq('candidate_id', candidateId)
    .maybeSingle();

  if (scoutError) {
    if (process.env.NODE_ENV === 'development') console.error('スカウト設定の取得エラー:', scoutError);
    // Try with string conversion for scout_settings since candidate_id is TEXT
    const { data: scoutDataStr, error: scoutErrorStr } = await supabase
      .from('scout_settings')
      .select('scout_status')
      .eq('candidate_id', String(candidateId))
      .maybeSingle();
    if (process.env.NODE_ENV === 'development') console.log('Scout settings with string conversion:', scoutDataStr, scoutErrorStr);
  } else {
    if (process.env.NODE_ENV === 'development') console.log('Scout settings found:', scoutData);
  }

  // Use the successfully retrieved data, prioritizing string conversion attempts if needed
  let finalNotificationData = notificationData;
  let finalScoutData = scoutData;

  // If original queries failed, try to use string conversion results
  if (!notificationData && notificationError) {
    const { data: notificationDataStr } = await supabase
      .from('notification_settings')
      .select('scout_notification, message_notification, recommendation_notification')
      .eq('candidate_id', String(candidateId))
      .maybeSingle();
    finalNotificationData = notificationDataStr;
  }

  if (!scoutData && scoutError) {
    const { data: scoutDataStr } = await supabase
      .from('scout_settings')
      .select('scout_status')
      .eq('candidate_id', String(candidateId))
      .maybeSingle();
    finalScoutData = scoutDataStr;
  }

  const result = {
    ...candidateData,
    notification_settings: finalNotificationData || undefined,
    scout_settings: finalScoutData || undefined,
  };

  if (process.env.NODE_ENV === 'development') console.log('Final user settings result:', result);

  // 成功した場合のみキャッシュに保存
  userSettingsCache.set(cacheKey, { data: result, timestamp: Date.now() });
  
  // キャッシュサイズを制限（メモリ使用量対策）
  if (userSettingsCache.size > 20) {
    const oldestKey = userSettingsCache.keys().next().value;
    if (oldestKey) {
      userSettingsCache.delete(oldestKey);
    }
  }

  return result;
}