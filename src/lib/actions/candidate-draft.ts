'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

type DraftCandidateData = {
  email: string;
  last_name?: string | null;
  first_name?: string | null;
  last_name_kana?: string | null;
  first_name_kana?: string | null;
  gender?: string | null;
  birth_year?: number | null;
  birth_month?: number | null;
  birth_day?: number | null;
  phone?: string | null;
  postal_code?: string | null;
  prefecture?: string | null;
  city?: string | null;
  address?: string | null;
  building?: string | null;
  marital_status?: string | null;
  children_count?: number;
  education?: any;
  skills?: any;
  career_status?: any;
  work_history?: any;
  memo?: string | null;
};

export async function saveCandidateDraft(data: DraftCandidateData) {
  try {
    console.log('🔍 [DRAFT SAVE] Starting draft save...');

    // 管理画面の他のServer Actionと同様にAdminClientを使用（認証チェックなし）
    const supabase = getSupabaseAdminClient();

    if (!data.email) {
      return { success: false, error: 'メールアドレスは必須です' };
    }

    const dataToSave = {
      email: data.email,
      status: 'DRAFT',
      last_name: data.last_name || null,
      first_name: data.first_name || null,
      last_name_kana: data.last_name_kana || null,
      first_name_kana: data.first_name_kana || null,
      gender: data.gender || null,
      birth_year: data.birth_year || null,
      birth_month: data.birth_month || null,
      birth_day: data.birth_day || null,
      phone: data.phone || null,
      postal_code: data.postal_code || null,
      prefecture: data.prefecture || null,
      city: data.city || null,
      address: data.address || null,
      building: data.building || null,
      marital_status: data.marital_status || null,
      children_count: data.children_count || 0,
      education: data.education || {},
      skills: data.skills || {},
      career_status: data.career_status || [],
      work_history: data.work_history || [],
      memo: data.memo || null,
      updated_at: new Date().toISOString(),
    };

    const { data: existingCandidate } = await supabase
      .from('candidates')
      .select('id')
      .eq('email', data.email)
      .single();

    let result;
    if (existingCandidate) {
      result = await supabase
        .from('candidates')
        .update(dataToSave)
        .eq('id', existingCandidate.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('candidates')
        .insert([dataToSave])
        .select()
        .single();
    }

    if (result.error) {
      console.error('下書き保存エラー:', result.error);
      return { success: false, error: '下書きの保存に失敗しました' };
    }

    return {
      success: true,
      message: '下書きを保存しました',
      candidate: result.data,
    };
  } catch (error) {
    console.error('下書き保存エラー:', error);
    return { success: false, error: '下書きの保存に失敗しました' };
  }
}
