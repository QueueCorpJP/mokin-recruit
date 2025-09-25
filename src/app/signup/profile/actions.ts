'use server';

import { type ProfileFormData } from '@/lib/schema/profile';
import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { getOrCreateCandidateId } from '@/lib/signup/candidateId';

export async function saveProfileData(data: ProfileFormData) {
  try {
    // RLS対応のSupabaseクライアントを使用
    const supabase = await getSupabaseServerClient();

    // Get or create candidate ID using the centralized function
    const candidateId = await getOrCreateCandidateId();

    // Convert birth date to proper format
    const birthDate = `${data.birthYear}-${data.birthMonth.padStart(2, '0')}-${data.birthDay.padStart(2, '0')}`;

    // Update candidates table with profile data
    const { error: updateError } = await supabase
      .from('candidates')
      .update({
        last_name: data.lastName,
        first_name: data.firstName,
        last_name_kana: data.lastNameKana,
        first_name_kana: data.firstNameKana,
        gender: data.gender,
        birth_date: birthDate,
        prefecture: data.prefecture,
        phone_number: data.phoneNumber,
        current_salary: data.currentIncome,
        updated_at: new Date().toISOString(),
      })
      .eq('id', candidateId);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return {
        success: false,
        error: 'プロフィール情報の保存に失敗しました。',
      };
    }

    revalidatePath('/signup/profile');

    return {
      success: true,
      message: 'プロフィール情報を保存しました。',
    };
  } catch (error) {
    console.error('Save profile error:', error);
    return {
      success: false,
      error: 'システムエラーが発生しました。',
    };
  }
}
