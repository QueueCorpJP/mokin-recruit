'use server';

import { redirect } from 'next/navigation';
import { requireCandidateAuthForAction } from '@/lib/auth/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

// フォームデータの型定義
export interface ProfileUpdateData {
  gender: 'male' | 'female' | 'unspecified';
  prefecture: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  phoneNumber: string;
  currentIncome: string;
}

// プロフィール更新のサーバーアクション
export async function updateCandidateProfile(formData: FormData) {
  try {
    // 認証チェック
    const authResult = await requireCandidateAuthForAction();
    if (!authResult.success) {
      throw new Error(authResult.error);
    }

    const { candidateId } = authResult.data;

    // フォームデータを取得
    const gender = formData.get('gender') as string;
    const prefecture = formData.get('prefecture') as string;
    const birthYear = formData.get('birthYear') as string;
    const birthMonth = formData.get('birthMonth') as string;
    const birthDay = formData.get('birthDay') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const currentIncome = formData.get('currentIncome') as string;

    // バリデーション
    if (!gender || !prefecture || !birthYear || !birthMonth || !birthDay) {
      throw new Error('必須項目が入力されていません');
    }

    // 生年月日をDate型に変換
    let birthDate: string | null = null;
    if (birthYear && birthMonth && birthDay) {
      const year = parseInt(birthYear);
      const month = parseInt(birthMonth);
      const day = parseInt(birthDay);
      
      // 日付の妥当性チェック
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() === year && 
          date.getMonth() === month - 1 && 
          date.getDate() === day) {
        birthDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      } else {
        throw new Error('無効な生年月日です');
      }
    }

    // データベースを更新
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from('candidates')
      .update({
        gender: gender as 'male' | 'female' | 'unspecified',
        current_residence: prefecture,
        birth_date: birthDate,
        phone_number: phoneNumber || null,
        current_salary: currentIncome || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', candidateId);

    if (error) {
      console.error('プロフィール更新エラー:', error);
      throw new Error('プロフィールの更新に失敗しました');
    }

    console.log('プロフィール更新成功:', { candidateId });

  } catch (error) {
    console.error('プロフィール更新エラー:', error);
    // エラーをセッションに保存したり、エラーページにリダイレクトすることも可能
    throw error;
  }

  // 成功時はプロフィール確認ページにリダイレクト
  redirect('/candidate/account/profile');
}