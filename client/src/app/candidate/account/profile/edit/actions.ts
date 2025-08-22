'use server';

import { profileSchema } from '@/lib/schema/profile';
import { CandidateRepository } from '@/lib/server/infrastructure/database/CandidateRepository';
import { requireCandidateAuth } from '@/lib/auth/server';

export async function updateCandidateProfile(
  prevState: any,
  formData: FormData
) {
  // 受信データの全内容をログ出力
  console.log('=== FormData.entries() ===');
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }
  // 1. 認証
  const auth = await requireCandidateAuth();
  if (!auth) {
    return { success: false, message: '認証が必要です' };
  }

  // 1.5. DB現状値取得（編集不可フィールド維持用）
  const repo = new CandidateRepository();
  const currentCandidate = await repo.findById(auth.id);
  if (!currentCandidate) {
    return { success: false, message: '候補者情報が見つかりません' };
  }

  // 2. バリデーション
  const parsed = profileSchema.safeParse({
    lastName: currentCandidate.last_name, // 編集不可
    firstName: currentCandidate.first_name, // 編集不可
    lastNameKana: currentCandidate.last_name_kana, // 編集不可
    firstNameKana: currentCandidate.first_name_kana, // 編集不可
    gender: formData.get('gender'),
    prefecture: formData.get('prefecture'),
    birthYear: formData.get('birthYear'),
    birthMonth: formData.get('birthMonth'),
    birthDay: formData.get('birthDay'),
    phoneNumber: formData.get('phoneNumber'),
    currentIncome: formData.get('currentIncome'),
  });
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: '入力内容に誤りがあります',
    };
  }

  // 3. DB更新
  try {
    // birth_dateを組み立て
    const birth_date = `${parsed.data.birthYear}-${parsed.data.birthMonth.padStart(2, '0')}-${parsed.data.birthDay.padStart(2, '0')}`;
    await repo.update(auth.id, {
      last_name: currentCandidate.last_name,
      first_name: currentCandidate.first_name,
      last_name_kana: currentCandidate.last_name_kana,
      first_name_kana: currentCandidate.first_name_kana,
      gender: parsed.data.gender,
      prefecture: parsed.data.prefecture,
      birth_date,
      phone_number: parsed.data.phoneNumber,
      current_income: parsed.data.currentIncome,
    });
    return { success: true, message: 'プロフィールを更新しました' };
  } catch (e) {
    return { success: false, message: 'サーバーエラーが発生しました' };
  }
}
