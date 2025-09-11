'use server';

import { redirect } from 'next/navigation';
import { requireCandidateAuthForAction } from '@/lib/auth/server';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { validateFormDataWithZod } from '../../_shared/actions/validateFormDataWithZod';
import { profileSchema } from '../../_shared/schemas/profileSchema';

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

// アクション結果の型定義
export interface ActionState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

// プロフィール更新のサーバーアクション
export async function updateCandidateProfile(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // 認証チェック
    const authResult = await requireCandidateAuthForAction();
    if (!authResult.success) {
      return {
        success: false,
        message: authResult.error,
        errors: {},
      };
    }

    const { candidateId } = authResult.data;

    // 共通ユーティリティでバリデーション・型変換
    const validation = await validateFormDataWithZod(profileSchema, formData);
    if (!validation.success) {
      return {
        success: false,
        message: validation.message,
        errors: validation.errors,
      };
    }
    const {
      gender,
      prefecture,
      birthYear,
      birthMonth,
      birthDay,
      phoneNumber,
      currentIncome,
    } = validation.data;

    // 生年月日をDate型に変換（zodで必須チェック済みなので妥当性のみ）
    let birthDate: string | null = null;
    const year = parseInt(birthYear);
    const month = parseInt(birthMonth);
    const day = parseInt(birthDay);
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      birthDate = `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;
    } else {
      return {
        success: false,
        message: '無効な生年月日です',
        errors: { birthYear: ['無効な生年月日です'] },
      };
    }

    // データベースを更新
    const supabase = await getSupabaseServerClient();
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
      return {
        success: false,
        message: 'プロフィールの更新に失敗しました',
        errors: {},
      };
    }

    return {
      success: true,
      message: 'プロフィールが更新されました',
      errors: {},
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'プロフィールの更新中にエラーが発生しました',
      errors: {},
    };
  }
}
