'use server';

import { requireCandidateAuthForAction } from '@/lib/auth/server';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import bcrypt from 'bcryptjs';
import { maskEmail, safeLog } from '@/lib/utils/pii-safe-logger';

export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    if (process.env.NODE_ENV === 'development') console.log('=== changePassword開始 ===');
    
    const authResult = await requireCandidateAuthForAction();
    
    if (!authResult.success) {
      if (process.env.NODE_ENV === 'development') console.log('認証エラー:', authResult.error);
      return { error: 'Unauthorized' };
    }
    
    const { candidateId } = authResult.data;
    if (process.env.NODE_ENV === 'development') console.log('認証成功 - CandidateId:', candidateId);

    const supabase = await getSupabaseServerClient();
    
    // candidateIdから候補者のメールアドレスを取得
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('email')
      .eq('id', candidateId)
      .single();
      
    if (candidateError || !candidate) {
      if (process.env.NODE_ENV === 'development') console.error('候補者の取得エラー:', candidateError);
      return { error: '候補者情報が見つかりません' };
    }
    
    const email = candidate.email;
    if (process.env.NODE_ENV === 'development') safeLog('debug', 'メールアドレス取得完了', { email: maskEmail(email) });
    
    // 現在のパスワード検証でSupabase AuthのユーザーIDを取得
    let supabaseAuthId: string | null = null;

    // まずSupabase Authで現在のパスワードを検証
    if (process.env.NODE_ENV === 'development') console.log('Supabase Authで現在のパスワードを検証中...');
    if (process.env.NODE_ENV === 'development') safeLog('debug', 'パスワード検証開始', { email: maskEmail(email) });
    try {
      const { data: authResult, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: currentPassword,
      });

      if (process.env.NODE_ENV === 'development') console.log('signInWithPassword結果:', {
        hasData: !!authResult,
        hasUser: !!authResult?.user,
        userId: authResult?.user?.id,
        error: authError?.message
      });

      if (authError || !authResult.user) {
        if (process.env.NODE_ENV === 'development') console.log('現在のパスワードが間違っています:', authError?.message);
        return { error: '現在のパスワードが正しくありません' };
      }
      
      // ここでSupabase AuthのユーザーIDを取得
      supabaseAuthId = authResult.user.id;
      if (process.env.NODE_ENV === 'development') console.log('現在のパスワード検証成功 - Supabase AuthID:', supabaseAuthId);
    } catch (authValidationError) {
      if (process.env.NODE_ENV === 'development') console.error('パスワード検証エラー:', authValidationError);
      return { error: '現在のパスワードが正しくありません' };
    }

    // 新しいパスワードをハッシュ化（candidatesテーブル用）
    if (process.env.NODE_ENV === 'development') console.log('新しいパスワードをハッシュ化中...');
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    if (process.env.NODE_ENV === 'development') console.log('パスワードハッシュ化完了');

    // candidatesテーブルのパスワードハッシュを更新
    if (process.env.NODE_ENV === 'development') console.log('candidatesテーブルのパスワードハッシュを更新中...');
    const { error: updateError } = await supabase
      .from('candidates')
      .update({ 
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', candidateId);

    if (updateError) {
      if (process.env.NODE_ENV === 'development') console.error('candidatesテーブル更新エラー:', updateError);
      return { error: 'パスワードの更新に失敗しました' };
    }

    if (process.env.NODE_ENV === 'development') console.log('✅ candidatesテーブルのパスワードハッシュ更新成功!');

    // Supabase Authのパスワードも更新
    if (process.env.NODE_ENV === 'development') console.log('Supabase Authのパスワードを更新中...');
    if (process.env.NODE_ENV === 'development') console.log('取得したsupabaseAuthId:', supabaseAuthId);
    if (supabaseAuthId) {
      try {
        if (process.env.NODE_ENV === 'development') console.log('updateUserByIdを実行中...');
        const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
          supabaseAuthId,
          { password: newPassword }
        );

        if (authUpdateError) {
          if (process.env.NODE_ENV === 'development') console.error('Supabase Auth パスワード更新エラー:', authUpdateError);
          if (process.env.NODE_ENV === 'development') console.warn('candidatesテーブルは更新済みですが、Supabase Authの更新に失敗しました');
        } else {
          if (process.env.NODE_ENV === 'development') console.log('✅ Supabase Authのパスワード更新成功!');
        }
      } catch (authError) {
        if (process.env.NODE_ENV === 'development') console.error('Supabase Auth更新エラー:', authError);
        if (process.env.NODE_ENV === 'development') console.warn('candidatesテーブルは更新済みですが、Supabase Authの更新に失敗しました');
      }
    } else {
      if (process.env.NODE_ENV === 'development') console.error('🚨 Supabase AuthIDが取得できませんでした:', supabaseAuthId);
      if (process.env.NODE_ENV === 'development') console.warn('candidatesテーブルのみ更新されました。');
    }
    
    if (process.env.NODE_ENV === 'development') console.log('=== changePassword完了 ===');
    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('❌ changePassword全体エラー:', error);
    return { error: 'システムエラーが発生しました' };
  }
}