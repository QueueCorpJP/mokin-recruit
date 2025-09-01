'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { requireCompanyAuthForAction } from '@/lib/auth/server';

// 簡単なメモリキャッシュ
const companyUserSettingsCache = new Map<string, { data: any; timestamp: number }>();
const COMPANY_USER_SETTINGS_CACHE_TTL = 1 * 60 * 1000; // 1分

export interface CompanyUserSettings {
  email: string;
  full_name: string;
  position_title: string;
}

export async function getCompanyUserSettings(): Promise<CompanyUserSettings | null> {
  const authResult = await requireCompanyAuthForAction();
  if (!authResult.success) {
    console.error('認証エラー:', authResult.error);
    return null;
  }

  const companyUserId = authResult.data.companyUserId;

  // キャッシュキーの生成
  const cacheKey = companyUserId;
  const cached = companyUserSettingsCache.get(cacheKey);
  
  // 期限切れキャッシュを即座に削除
  if (cached && Date.now() - cached.timestamp >= COMPANY_USER_SETTINGS_CACHE_TTL) {
    companyUserSettingsCache.delete(cacheKey);
  } else if (cached) {
    console.log('[getCompanyUserSettings] Cache hit - returning cached data');
    return cached.data;
  }
  
  console.log('[getCompanyUserSettings] Cache miss - fetching new data');
  console.log('Fetching company user settings for companyUserId:', companyUserId);

  const supabase = getSupabaseAdminClient();

  // Get company user data from company_users table
  const { data: companyUserData, error: companyUserError } = await supabase
    .from('company_users')
    .select('email, full_name, position_title')
    .eq('id', companyUserId)
    .maybeSingle();

  if (companyUserError) {
    console.error('企業ユーザー情報の取得に失敗しました:', companyUserError);
    return null;
  }

  if (!companyUserData) {
    console.log('企業ユーザーデータが見つかりません');
    return null;
  }

  console.log('Company user data:', companyUserData);

  const result = {
    email: companyUserData.email,
    full_name: companyUserData.full_name || '',
    position_title: companyUserData.position_title || '',
  };

  console.log('Final company user settings result:', result);

  // 成功した場合のみキャッシュに保存
  companyUserSettingsCache.set(cacheKey, { data: result, timestamp: Date.now() });
  
  // キャッシュサイズを制限（メモリ使用量対策）
  if (companyUserSettingsCache.size > 20) {
    const oldestKey = companyUserSettingsCache.keys().next().value;
    if (oldestKey) {
      companyUserSettingsCache.delete(oldestKey);
    }
  }

  return result;
}

export interface CompanyNotificationSettings {
  application_notification: 'receive' | 'not-receive';
  message_notification: 'receive' | 'not-receive';
  system_notification: 'receive' | 'not-receive';
}

export async function saveCompanyNotificationSettings(formData: FormData) {
  const supabase = getSupabaseAdminClient();
  
  const applicationNotification = formData.get('applicationNotification') as string;
  const messageNotification = formData.get('messageNotification') as string;
  const recommendationNotification = formData.get('recommendationNotification') as string;

  if (!applicationNotification || !messageNotification || !recommendationNotification) {
    throw new Error('すべての通知設定を選択してください');
  }

  // Use custom auth system instead of Supabase auth
  const authResult = await requireCompanyAuthForAction();
  if (!authResult.success) {
    console.error('企業通知設定保存の認証エラー:', authResult.error);
    throw new Error(authResult.error);
  }

  console.log('Saving notification settings for company_user_id:', authResult.data.companyUserId);

  const settings = {
    application_notification: applicationNotification as 'receive' | 'not-receive',
    message_notification: messageNotification as 'receive' | 'not-receive',
    system_notification: recommendationNotification as 'receive' | 'not-receive',
  };

  // company_notification_settingsテーブルを使用して企業の通知設定を保存
  const { error } = await supabase
    .from('company_notification_settings')
    .upsert({
      company_user_id: authResult.data.companyUserId,
      application_notification: settings.application_notification,
      message_notification: settings.message_notification,
      system_notification: settings.system_notification,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'company_user_id'
    });

  if (error) {
    console.error('企業通知設定の保存に失敗しました:', error);
    throw new Error('企業通知設定の保存に失敗しました');
  }

  return { success: true };
}

export async function getCompanyNotificationSettings(): Promise<CompanyNotificationSettings | null> {
  const authResult = await requireCompanyAuthForAction();
  if (!authResult.success) {
    console.error('企業通知設定取得の認証エラー:', authResult.error);
    return null;
  }

  console.log('Getting notification settings for company_user_id:', authResult.data.companyUserId);

  const supabase = getSupabaseAdminClient();

  // company_notification_settingsテーブルから企業の通知設定を取得
  const { data, error } = await supabase
    .from('company_notification_settings')
    .select('application_notification, message_notification, system_notification')
    .eq('company_user_id', authResult.data.companyUserId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // レコードが存在しない場合はデフォルト値を返す
      console.log('企業通知設定が見つかりません。デフォルト値を返します');
      return {
        application_notification: 'receive',
        message_notification: 'receive',
        system_notification: 'receive'
      };
    }
    console.error('企業通知設定の取得に失敗しました:', error);
    return null;
  }

  if (!data) {
    console.log('企業通知設定が見つかりません。デフォルト値を返します');
    // デフォルト値を返す
    return {
      application_notification: 'receive',
      message_notification: 'receive',
      system_notification: 'receive'
    };
  }

  console.log('企業通知設定を取得:', data);
  return data as CompanyNotificationSettings;
}

export async function updateCompanyProfile(fullName: string, positionTitle: string): Promise<{ error?: string }> {
  const authResult = await requireCompanyAuthForAction();
  if (!authResult.success) {
    console.error('認証エラー:', authResult.error);
    return { error: '認証に失敗しました' };
  }

  const companyUserId = authResult.data.companyUserId;
  const supabase = getSupabaseAdminClient();

  try {
    const { error } = await supabase
      .from('company_users')
      .update({
        full_name: fullName,
        position_title: positionTitle
      })
      .eq('id', companyUserId);

    if (error) {
      console.error('プロフィール更新エラー:', error);
      return { error: 'プロフィールの更新に失敗しました' };
    }

    // キャッシュをクリア
    companyUserSettingsCache.delete(companyUserId);

    console.log('プロフィール更新完了');
    return {};
  } catch (error) {
    console.error('プロフィール更新例外:', error);
    return { error: 'プロフィールの更新に失敗しました' };
  }
}