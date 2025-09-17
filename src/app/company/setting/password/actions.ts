'use server';

import { requireCompanyAuthForAction } from '@/lib/auth/server';
import { createClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';

export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  try {
    console.log('=== changePassword開始 ===');

    const authResult = await requireCompanyAuthForAction();

    if (!authResult.success) {
      console.log('認証エラー:', (authResult as any).error || '認証が必要です');
      return { error: 'Unauthorized' };
    }

    const { companyUserId } = authResult.data;
    console.log('認証成功 - CompanyUserId:', companyUserId);

    const supabase = await createClient();

    // companyUserIdから企業ユーザー情報を取得
    const { data: companyUser, error: companyUserError } = await supabase
      .from('company_users')
      .select('email')
      .eq('id', companyUserId)
      .single();

    if (companyUserError || !companyUser) {
      console.error('企業ユーザー取得エラー:', companyUserError);
      return { error: '企業ユーザーが見つかりません' };
    }

    const email = companyUser.email;
    console.log('取得したemail:', email);

    // 現在のパスワードでSupabase Auth認証IDを取得
    let supabaseAuthId: string | null = null;

    // 現在のSupabase Authでの現在のパスワード認証
    console.log('Supabase Authでの現在のパスワード認証中...');
    console.log('認証用email:', email);
    try {
      const { data: authResult, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email,
          password: currentPassword,
        });

      console.log('signInWithPassword結果:', {
        hasData: !!authResult,
        hasUser: !!authResult?.user,
        userId: authResult?.user?.id,
        error: authError?.message,
      });

      if (authError || !authResult.user) {
        console.log('現在のパスワード認証失敗:', authError?.message);
        return { error: '現在のパスワードが正しくありません' };
      }

      // 認証成功時のSupabase Auth認証IDを取得
      supabaseAuthId = authResult.user.id;
      console.log(
        '現在のパスワード認証成功 - Supabase AuthID:',
        supabaseAuthId
      );
    } catch (authValidationError) {
      console.error('パスワード認証エラー:', authValidationError);
      return { error: '現在のパスワードが正しくありません' };
    }

    // 新しいパスワードを暗号化してcompany_usersテーブルに保存
    console.log('新しいパスワードを暗号化中...');
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    console.log('パスワード暗号化完了');

    // company_usersテーブルのパスワード更新
    console.log('company_usersテーブルのパスワード更新中...');
    const { error: updateError } = await supabase
      .from('company_users')
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString(),
      })
      .eq('id', companyUserId);

    if (updateError) {
      console.error('company_users更新エラー:', updateError);
      return { error: 'パスワードの変更に失敗しました' };
    }

    console.log('✅ company_usersテーブルのパスワード更新完了!');

    // Supabase Authのパスワード変更
    console.log('Supabase Authのパスワード変更中...');
    console.log('取得したsupabaseAuthId:', supabaseAuthId);
    if (supabaseAuthId) {
      try {
        console.log('updateUserById実行中...');
        const { error: authUpdateError } =
          await supabase.auth.admin.updateUserById(supabaseAuthId, {
            password: newPassword,
          });

        if (authUpdateError) {
          console.error('Supabase Auth パスワード更新エラー:', authUpdateError);
          console.warn(
            'company_usersテーブルは更新済みですが、Supabase Authの変更に失敗しました'
          );
        } else {
          console.log('✅ Supabase Authのパスワード更新完了!');
        }
      } catch (authError) {
        console.error('Supabase Auth更新エラー:', authError);
        console.warn(
          'company_usersテーブルは更新済みですが、Supabase Authの変更に失敗しました'
        );
      }
    } else {
      console.error(
        '❌ Supabase AuthIDが取得できませんでした:',
        supabaseAuthId
      );
      console.warn('company_usersテーブルの更新のみ完了しました');
    }

    console.log('=== changePassword完了 ===');
    return { success: true };
  } catch (error) {
    console.error('❌ changePassword全体エラー:', error);
    return { error: 'システムエラーが発生しました' };
  }
}
