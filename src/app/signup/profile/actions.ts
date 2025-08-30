'use server';

import { type ProfileFormData } from '@/lib/schema/profile';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function saveProfileData(data: ProfileFormData & { userId?: string }) {
  try {
    // クライアントから送信されたユーザーIDを使用
    const userId = data.userId;
    
    if (!userId) {
      return { 
        success: false, 
        error: '登録情報が見つかりません。最初からやり直してください。' 
      };
    }

    // Supabaseクライアントを動的にインポート
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return { 
        success: false, 
        error: 'サーバー設定エラーが発生しました。' 
      };
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
      },
    });

    // Convert birth date to proper format
    const birthDate = `${data.birthYear}-${data.birthMonth.padStart(2, '0')}-${data.birthDay.padStart(2, '0')}`;

    // Update candidates table with profile data using user ID
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
        current_income: data.currentIncome,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return { 
        success: false, 
        error: 'プロフィール情報の保存に失敗しました。' 
      };
    }

    revalidatePath('/signup/profile');
    
    return { 
      success: true, 
      message: 'プロフィール情報を保存しました。' 
    };

  } catch (error) {
    console.error('Save profile error:', error);
    return { 
      success: false, 
      error: 'システムエラーが発生しました。' 
    };
  }
}