'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getSupabaseClient } from '@/lib/server/database/supabase';
import bcrypt from 'bcryptjs';

interface LoginResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

export async function candidateLogin(email: string, password: string): Promise<LoginResult> {
  try {
    const supabase = getSupabaseClient();
    
    // 候補者のメールアドレスとパスワードハッシュを取得
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('id, email, password_hash, email_confirmed')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (candidateError || !candidate) {
      return { success: false, error: 'メールアドレスまたはパスワードが間違っています' };
    }

    // パスワード確認
    const isPasswordValid = await bcrypt.compare(password, candidate.password_hash);
    if (!isPasswordValid) {
      return { success: false, error: 'メールアドレスまたはパスワードが間違っています' };
    }

    // メール確認チェック
    if (!candidate.email_confirmed) {
      return { success: false, error: 'メールアドレスが確認されていません。確認メールをご確認ください。' };
    }

    return { success: true, redirectTo: '/candidate/dashboard' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'ログイン処理中にエラーが発生しました' };
  }
}

export async function companyLogin(email: string, password: string): Promise<LoginResult> {
  try {
    const supabase = getSupabaseClient();
    
    // 企業ユーザーのメールアドレスとパスワードハッシュを取得
    const { data: companyUser, error: userError } = await supabase
      .from('company_users')
      .select('id, email, password_hash, email_confirmed')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (userError || !companyUser) {
      return { success: false, error: 'メールアドレスまたはパスワードが間違っています' };
    }

    // パスワード確認
    const isPasswordValid = await bcrypt.compare(password, companyUser.password_hash);
    if (!isPasswordValid) {
      return { success: false, error: 'メールアドレスまたはパスワードが間違っています' };
    }

    // メール確認チェック
    if (!companyUser.email_confirmed) {
      return { success: false, error: 'メールアドレスが確認されていません。確認メールをご確認ください。' };
    }

    return { success: true, redirectTo: '/company/dashboard' };
  } catch (error) {
    console.error('Company login error:', error);
    return { success: false, error: 'ログイン処理中にエラーが発生しました' };
  }
}

export async function logout() {
  redirect('/');
}

interface RegistrationData {
  email: string;
  password: string;
  name?: string;
  companyName?: string;
}

export async function candidateRegister(data: RegistrationData): Promise<LoginResult> {
  try {
    const supabase = getSupabaseClient();
    const { email, password, name } = data;

    // メールアドレスの重複チェック
    const { data: existingCandidate } = await supabase
      .from('candidates')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (existingCandidate) {
      return { success: false, error: '既に登録されているメールアドレスです' };
    }

    // パスワードハッシュ化
    const passwordHash = await bcrypt.hash(password, 12);

    // 候補者レコード作成
    const { data: candidate, error: insertError } = await supabase
      .from('candidates')
      .insert({
        email: email.trim().toLowerCase(),
        password_hash: passwordHash,
        name: name || null,
        email_confirmed: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Candidate registration error:', insertError);
      return { success: false, error: '登録処理中にエラーが発生しました' };
    }

    // TODO: 確認メール送信処理を追加

    return { 
      success: true, 
      redirectTo: '/auth/verify-email?email=' + encodeURIComponent(email)
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: '登録処理中にエラーが発生しました' };
  }
}

export async function companyRegister(data: RegistrationData): Promise<LoginResult> {
  try {
    const supabase = getSupabaseClient();
    const { email, password, companyName } = data;

    // メールアドレスの重複チェック
    const { data: existingUser } = await supabase
      .from('company_users')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (existingUser) {
      return { success: false, error: '既に登録されているメールアドレスです' };
    }

    // パスワードハッシュ化
    const passwordHash = await bcrypt.hash(password, 12);

    // 企業ユーザーレコード作成
    const { data: companyUser, error: insertError } = await supabase
      .from('company_users')
      .insert({
        email: email.trim().toLowerCase(),
        password_hash: passwordHash,
        company_name: companyName || null,
        email_confirmed: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Company registration error:', insertError);
      return { success: false, error: '登録処理中にエラーが発生しました' };
    }

    // TODO: 確認メール送信処理を追加

    return { 
      success: true, 
      redirectTo: '/auth/verify-email?email=' + encodeURIComponent(email)
    };
  } catch (error) {
    console.error('Company registration error:', error);
    return { success: false, error: '登録処理中にエラーが発生しました' };
  }
}

export async function requestPasswordReset(email: string, userType: 'candidate' | 'company'): Promise<LoginResult> {
  try {
    const supabase = getSupabaseClient();
    
    // ユーザーの存在確認
    const tableName = userType === 'candidate' ? 'candidates' : 'company_users';
    const { data: user, error: userError } = await supabase
      .from(tableName)
      .select('id, email')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (userError || !user) {
      return { success: false, error: 'ユーザーが見つかりません' };
    }

    // TODO: パスワードリセットトークン生成とメール送信処理を追加
    
    return { 
      success: true, 
      redirectTo: '/auth/reset-password/sent?email=' + encodeURIComponent(email)
    };
  } catch (error) {
    console.error('Password reset request error:', error);
    return { success: false, error: 'パスワードリセット処理中にエラーが発生しました' };
  }
}