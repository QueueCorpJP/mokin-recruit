'use server';

import { requireCandidateAuthForAction } from '@/lib/auth/server';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import bcrypt from 'bcryptjs';

export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    console.log('=== changePassword開始 ===');
    
    const authResult = await requireCandidateAuthForAction();
    
    if (!authResult.success) {
      console.log('認証エラー:', authResult.error);
      return { error: 'Unauthorized' };
    }
    
    const { candidateId } = authResult.data;
    console.log('認証成功 - CandidateId:', candidateId);

    const supabase = await getSupabaseServerClient();
    
    // candidateIdから候補者のメールアドレスを取得
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('email')
      .eq('id', candidateId)
      .single();
      
    if (candidateError || !candidate) {
      console.error('候補者の取得エラー:', candidateError);
      return { error: '候補者情報が見つかりません' };
    }
    
    const email = candidate.email;
    console.log('取得したemail:', email);
    
    // 現在のパスワード検証でSupabase AuthのユーザーIDを取得
    let supabaseAuthId: string | null = null;

    // まずSupabase Authで現在のパスワードを検証
    console.log('Supabase Authで現在のパスワードを検証中...');
    console.log('検証対象のemail:', email);
    try {
      const { data: authResult, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: currentPassword,
      });

      console.log('signInWithPassword結果:', {
        hasData: !!authResult,
        hasUser: !!authResult?.user,
        userId: authResult?.user?.id,
        error: authError?.message
      });

      if (authError || !authResult.user) {
        console.log('現在のパスワードが間違っています:', authError?.message);
        return { error: '現在のパスワードが正しくありません' };
      }
      
      // ここでSupabase AuthのユーザーIDを取得
      supabaseAuthId = authResult.user.id;
      console.log('現在のパスワード検証成功 - Supabase AuthID:', supabaseAuthId);
    } catch (authValidationError) {
      console.error('パスワード検証エラー:', authValidationError);
      return { error: '現在のパスワードが正しくありません' };
    }

    // 新しいパスワードをハッシュ化（candidatesテーブル用）
    console.log('新しいパスワードをハッシュ化中...');
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    console.log('パスワードハッシュ化完了');

    // candidatesテーブルのパスワードハッシュを更新
    console.log('candidatesテーブルのパスワードハッシュを更新中...');
    const { error: updateError } = await supabase
      .from('candidates')
      .update({ 
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', candidateId);

    if (updateError) {
      console.error('candidatesテーブル更新エラー:', updateError);
      return { error: 'パスワードの更新に失敗しました' };
    }

    console.log('✅ candidatesテーブルのパスワードハッシュ更新成功!');

    // Supabase Authのパスワードも更新
    console.log('Supabase Authのパスワードを更新中...');
    console.log('取得したsupabaseAuthId:', supabaseAuthId);
    if (supabaseAuthId) {
      try {
        console.log('updateUserByIdを実行中...');
        const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
          supabaseAuthId,
          { password: newPassword }
        );

        if (authUpdateError) {
          console.error('Supabase Auth パスワード更新エラー:', authUpdateError);
          console.warn('candidatesテーブルは更新済みですが、Supabase Authの更新に失敗しました');
        } else {
          console.log('✅ Supabase Authのパスワード更新成功!');
        }
      } catch (authError) {
        console.error('Supabase Auth更新エラー:', authError);
        console.warn('candidatesテーブルは更新済みですが、Supabase Authの更新に失敗しました');
      }
    } else {
      console.error('🚨 Supabase AuthIDが取得できませんでした:', supabaseAuthId);
      console.warn('candidatesテーブルのみ更新されました。');
    }
    
    console.log('=== changePassword完了 ===');
    return { success: true };
  } catch (error) {
    console.error('❌ changePassword全体エラー:', error);
    return { error: 'システムエラーが発生しました' };
  }
}