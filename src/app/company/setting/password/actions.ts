'use server';

import { requireCompanyAuthForAction } from '@/lib/auth/server';
import { createClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import { maskEmail, safeLog } from '@/lib/utils/pii-safe-logger';

export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    if (process.env.NODE_ENV === 'development') safeLog('debug', '=== changePassword開始 ===');
    
    const authResult = await requireCompanyAuthForAction();
    
    if (!authResult.success) {
      safeLog('error', '認証エラー:', authResult.error);
      return { error: 'Unauthorized' };
    }
    
    const { companyUserId } = authResult.data;
    safeLog('info', '認証成功 - CompanyUserId:', companyUserId);

    const supabase = await createClient();
    
    // companyUserIdから企業ユーザー情報を取得
    const { data: companyUser, error: companyUserError } = await supabase
      .from('company_users')
      .select('email')
      .eq('id', companyUserId)
      .single();
      
    if (companyUserError || !companyUser) {
      safeLog('error', '企業ユーザー取得エラー:', companyUserError);
      return { error: '企業ユーザーが見つかりません' };
    }
    
    const email = companyUser.email;
    if (process.env.NODE_ENV === 'development') safeLog('debug', 'メールアドレス取得完了', { email: maskEmail(email) });
    
    // 現在のパスワードでSupabase Auth認証IDを取得
    let supabaseAuthId: string | null = null;

    // 現在のSupabase Authでの現在のパスワード認証
    if (process.env.NODE_ENV === 'development') safeLog('debug', 'Supabase Authでの現在のパスワード認証中...');
    if (process.env.NODE_ENV === 'development') safeLog('debug', 'パスワード認証開始', { email: maskEmail(email) });
    try {
      const { data: authResult, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: currentPassword,
      });

      if (process.env.NODE_ENV === 'development') safeLog('debug', 'signInWithPassword結果:', {
        hasData: !!authResult,
        hasUser: !!authResult?.user,
        userId: authResult?.user?.id,
        error: authError?.message
      });

      if (authError || !authResult.user) {
        safeLog('error', '現在のパスワード認証失敗:', authError?.message);
        return { error: '現在のパスワードが正しくありません' };
      }
      
      // 認証成功時のSupabase Auth認証IDを取得
      supabaseAuthId = authResult.user.id;
      safeLog('info', '現在のパスワード認証成功 - Supabase AuthID:', supabaseAuthId);
    } catch (authValidationError) {
      safeLog('error', 'パスワード認証エラー:', authValidationError);
      return { error: '現在のパスワードが正しくありません' };
    }

    // 新しいパスワードを暗号化してcompany_usersテーブルに保存
    if (process.env.NODE_ENV === 'development') safeLog('debug', '新しいパスワードを暗号化中...');
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    safeLog('info', 'パスワード暗号化完了');

    // company_usersテーブルのパスワード更新
    if (process.env.NODE_ENV === 'development') safeLog('debug', 'company_usersテーブルのパスワード更新中...');
    const { error: updateError } = await supabase
      .from('company_users')
      .update({ 
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', companyUserId);

    if (updateError) {
      safeLog('error', 'company_users更新エラー:', updateError);
      return { error: 'パスワードの変更に失敗しました' };
    }

    safeLog('info', '✅ company_usersテーブルのパスワード更新完了!');

    // Supabase Authのパスワード変更
    if (process.env.NODE_ENV === 'development') safeLog('debug', 'Supabase Authのパスワード変更中...');
    if (process.env.NODE_ENV === 'development') safeLog('debug', '取得したsupabaseAuthId:', supabaseAuthId);
    if (supabaseAuthId) {
      try {
        if (process.env.NODE_ENV === 'development') safeLog('debug', 'updateUserById実行中...');
        const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
          supabaseAuthId,
          { password: newPassword }
        );

        if (authUpdateError) {
          safeLog('error', 'Supabase Auth パスワード更新エラー:', authUpdateError);
          if (process.env.NODE_ENV === 'development') console.warn('company_usersテーブルは更新済みですが、Supabase Authの変更に失敗しました');
        } else {
          safeLog('info', '✅ Supabase Authのパスワード更新完了!');
        }
      } catch (authError) {
        safeLog('error', 'Supabase Auth更新エラー:', authError);
        if (process.env.NODE_ENV === 'development') console.warn('company_usersテーブルは更新済みですが、Supabase Authの変更に失敗しました');
      }
    } else {
      safeLog('error', '❌ Supabase AuthIDが取得できませんでした:', supabaseAuthId);
      if (process.env.NODE_ENV === 'development') console.warn('company_usersテーブルの更新のみ完了しました');
    }
    
    safeLog('info', '=== changePassword完了 ===');
    return { success: true };
  } catch (error) {
    safeLog('error', '❌ changePassword全体エラー:', error);
    return { error: 'システムエラーが発生しました' };
  }
}