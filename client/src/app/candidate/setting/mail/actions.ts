'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { requireCandidateAuth } from '@/lib/auth/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

// メールアドレス変更完了後の認証状態リフレッシュ用
export async function refreshAuthState() {
  'use server';
  
  console.log('認証状態をリフレッシュ中...');
  try {
    const cookieStore = await cookies();
    
    // 全ての認証関連クッキーを削除
    const authCookies = [
      'supabase-auth-token',
      'sb-access-token',
      'sb-refresh-token',
      'next-auth.session-token',
      'auth-token'
    ];
    
    authCookies.forEach(cookieName => {
      try {
        cookieStore.delete(cookieName);
        console.log(`クッキー削除: ${cookieName}`);
      } catch (error) {
        console.log(`クッキー削除スキップ: ${cookieName}`);
      }
    });
    
    console.log('✅ 認証状態リフレッシュ完了');
    return { success: true };
  } catch (error) {
    console.error('認証状態リフレッシュエラー:', error);
    return { success: false, error: 'リフレッシュに失敗しました' };
  }
}

export async function sendVerificationCode(email: string) {
  try {
    console.log('=== sendVerificationCode開始 ===');
    console.log('入力されたメールアドレス:', email);
    
    const user = await requireCandidateAuth();
    if (!user) {
      console.log('認証エラー: ユーザーが見つかりません');
      return { error: 'Unauthorized' };
    }
    console.log('認証成功 - ユーザーID:', user.id);

    const supabase = getSupabaseAdminClient();

    // 現在のメールアドレスを取得
    console.log('現在のメールアドレスを取得中...');
    const { data: currentUser, error: userError } = await supabase
      .from('candidates')
      .select('email')
      .eq('id', user.id)
      .single();

    if (userError) {
      console.error('現在のメールアドレス取得エラー:', userError);
      return { error: '現在のメールアドレスの取得に失敗しました' };
    }
    console.log('現在のメールアドレス:', currentUser.email);

    // 同じメールアドレスかチェック
    console.log('メールアドレス同一性チェック...');
    if (currentUser.email === email) {
      console.log('現在と同じメールアドレスが入力されました');
      return { error: '現在のメールアドレスと同じです。変更の必要はありません。' };
    }

    // メールアドレス重複チェック（自分以外で同じメールアドレスが使用されていないか）
    console.log('他ユーザーの重複チェック中...');
    const { data: existingUser, error: checkError } = await supabase
      .from('candidates')
      .select('id, email')
      .eq('email', email)
      .neq('id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = No rows found
      console.error('重複チェックエラー:', checkError);
      return { error: 'メールアドレスの確認に失敗しました' };
    }

    if (existingUser) {
      console.log('他のユーザーが同じメールアドレスを使用中:', existingUser.id);
      return { error: 'このメールアドレスは既に他のユーザーによって使用されています' };
    }
    console.log('重複チェック完了 - 使用可能なメールアドレス');

    const verificationCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    console.log('生成された認証コード:', verificationCode);
    
    // データベースに認証コードを保存
    console.log('認証コードをデータベースに保存中...');
    const { error: saveError } = await supabase
      .from('email_verification_codes')
      .upsert({
        candidate_id: user.id,
        email: email,
        code: verificationCode,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10分後に期限切れ
        used: false
      }, {
        onConflict: 'candidate_id',
        ignoreDuplicates: false
      });

    if (saveError) {
      console.error('認証コード保存エラー:', saveError);
      return { error: '認証コードの生成に失敗しました' };
    }
    console.log('認証コードをデータベースに保存完了');

    // Gmail SMTPでメール送信
    console.log('メール送信設定を確認中...');
    console.log('GMAIL_USER:', process.env.GMAIL_USER);
    console.log('GMAIL_APP_PASSWORD exists:', !!process.env.GMAIL_APP_PASSWORD);
    
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.log('Gmail設定が不完全です');
      return { error: 'メール送信設定が正しく構成されていません' };
    }

    try {
      console.log('Gmail SMTPトランスポーターを作成中...');
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, '') // スペースを削除
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      
      console.log('メール送信中...');
      console.log('送信先:', currentUser.email);
      console.log('送信元:', process.env.GMAIL_USER);
      
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: currentUser.email,
        subject: 'メールアドレス変更の認証コード',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0f9058;">メールアドレス変更の認証コード</h2>
            <p>以下の認証コードを入力してください：</p>
            <div style="background-color: #f9f9f9; padding: 20px; text-align: center; margin: 20px 0;">
              <h3 style="color: #0f9058; font-size: 32px; margin: 0; letter-spacing: 4px;">${verificationCode}</h3>
            </div>
            <p style="color: #666;">このコードは10分間有効です。</p>
            <p style="color: #666; font-size: 12px;">このメールに心当たりがない場合は、無視してください。</p>
          </div>
        `
      });
      
      console.log(`✅ メール送信成功! 送信先: ${currentUser.email}`);
      
    } catch (emailErr) {
      console.error('❌ メール送信エラー:', emailErr);
      return { error: 'メールの送信に失敗しました。しばらく時間をおいて再度お試しください。' };
    }
    
    console.log('=== sendVerificationCode完了 ===');
    return { success: true };
  } catch (error) {
    console.error('❌ sendVerificationCode全体エラー:', error);
    return { error: 'システムエラーが発生しました' };
  }
}

export async function verifyCode(code: string) {
  try {
    console.log('=== verifyCode開始 ===');
    console.log('入力された認証コード:', code);
    
    const user = await requireCandidateAuth();
    if (!user) {
      console.log('認証エラー: ユーザーが見つかりません');
      return { error: 'Unauthorized' };
    }
    console.log('認証成功 - ユーザーID:', user.id);

    const supabase = getSupabaseAdminClient();
    
    console.log('認証コードをデータベースから検索中...');
    const { data: verification, error: fetchError } = await supabase
      .from('email_verification_codes')
      .select('*')
      .eq('candidate_id', user.id)
      .eq('code', code.toUpperCase())
      .eq('used', false)
      .single();

    if (fetchError || !verification) {
      console.log('認証コード検索エラーまたは見つからない:', fetchError);
      return { error: '認証コードが正しくありません' };
    }
    console.log('認証コード見つかりました:', verification);

    if (new Date() > new Date(verification.expires_at)) {
      console.log('認証コードが期限切れです');
      return { error: '認証コードの有効期限が切れています' };
    }
    console.log('認証コードは有効です');

    // メールアドレス更新前に再度重複チェック（認証コード送信後に他の人が同じメールを使った可能性）
    console.log('最終重複チェックを実行中...');
    const { data: existingUser, error: finalCheckError } = await supabase
      .from('candidates')
      .select('id, email')
      .eq('email', verification.email)
      .neq('id', user.id)
      .single();

    if (finalCheckError && finalCheckError.code !== 'PGRST116') { // PGRST116 = No rows found
      console.error('最終重複チェックエラー:', finalCheckError);
      return { error: 'メールアドレスの確認に失敗しました' };
    }

    if (existingUser) {
      console.log('他のユーザーが同じメールアドレスを使用中:', existingUser.id);
      return { error: 'このメールアドレスは既に他のユーザーによって使用されています' };
    }
    console.log('最終重複チェック完了 - 使用可能');

    console.log('認証コードを使用済みにマーク中...');
    const { error: markUsedError } = await supabase
      .from('email_verification_codes')
      .update({ used: true })
      .eq('id', verification.id);

    if (markUsedError) {
      console.error('認証コード使用済みマークエラー:', markUsedError);
      return { error: '認証処理に失敗しました' };
    }
    console.log('認証コードを使用済みにマーク完了');

    // 更新前の現在のメールアドレスを取得
    const { data: beforeUpdate, error: beforeError } = await supabase
      .from('candidates')
      .select('email')
      .eq('id', user.id)
      .single();
    
    console.log('メールアドレスを更新中...');
    console.log('更新前のメールアドレス:', beforeUpdate?.email);
    console.log('更新予定のメールアドレス:', verification.email);
    
    const { data: updateResult, error: updateEmailError } = await supabase
      .from('candidates')
      .update({ 
        email: verification.email,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select('email');

    if (updateEmailError) {
      console.error('メールアドレス更新エラー:', updateEmailError);
      return { error: 'メールアドレスの更新に失敗しました' };
    }

    console.log('✅ candidatesテーブルのメールアドレス更新成功!');
    console.log('更新結果:', updateResult);
    
    // Supabase Authのメールアドレスも更新
    console.log('Supabase Authのメールアドレスを更新中...');
    try {
      const { data: authUpdateResult, error: authUpdateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { email: verification.email }
      );

      if (authUpdateError) {
        console.error('Supabase Auth メールアドレス更新エラー:', authUpdateError);
        // candidatesテーブルは更新されているので、警告として扱う
        console.warn('candidatesテーブルは更新済みですが、Supabase Authの更新に失敗しました');
      } else {
        console.log('✅ Supabase Authのメールアドレス更新成功!');
        console.log('Auth更新結果:', authUpdateResult);
      }
    } catch (authError) {
      console.error('Supabase Auth更新エラー:', authError);
      console.warn('candidatesテーブルは更新済みですが、Supabase Authの更新に失敗しました');
    }
    
    // 更新後の確認
    const { data: afterUpdate, error: afterError } = await supabase
      .from('candidates')
      .select('email')
      .eq('id', user.id)
      .single();
    
    console.log('更新後のメールアドレス確認:', afterUpdate?.email);
    
    // 古いセッションを無効化してから新しいセッションを作成
    console.log('古いセッションを無効化中...');
    try {
      const cookieStore = await cookies();
      
      // 全ての認証関連クッキーを一旦削除
      const authCookies = [
        'supabase-auth-token',
        'sb-access-token', 
        'sb-refresh-token',
        'next-auth.session-token',
        'auth-token'
      ];
      
      authCookies.forEach(cookieName => {
        try {
          cookieStore.delete(cookieName);
          console.log(`古いクッキー削除: ${cookieName}`);
        } catch (error) {
          console.log(`クッキー削除スキップ: ${cookieName}`);
        }
      });
      
      // 新しいメールアドレスでJWTトークンを生成
      console.log('新しいセッションを作成中...');
      const JWT_SECRET = process.env.JWT_SECRET || 'mokin-recruit-super-secret-jwt-key-2024-production-change-me';
      const newToken = jwt.sign(
        {
          userId: user.id,
          email: verification.email,
          userType: 'candidate',
          emailConfirmed: true,
          iat: Math.floor(Date.now() / 1000), // 現在時刻でトークンを発行
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      cookieStore.set('supabase-auth-token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7日間
      });
      
      console.log('✅ セッション再生成完了!');
    } catch (sessionError) {
      console.error('セッション再生成エラー:', sessionError);
      console.warn('メールアドレスは更新されましたが、セッション再生成に失敗しました');
    }
    
    console.log('=== verifyCode完了 ===');
    return { success: true, newEmail: verification.email };
  } catch (error) {
    console.error('❌ verifyCode全体エラー:', error);
    return { error: 'システムエラーが発生しました' };
  }
}