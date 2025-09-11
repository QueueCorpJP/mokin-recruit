'use server';

import {
  requireCandidateAuth,
  requireCandidateAuthForAction,
} from '@/lib/auth/server';
import { getSkillsData as getSkillsFromDB } from '@/lib/server/candidate/candidateData';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { parseJsonField } from '../../_shared/utils/formData';
import { updateOrInsertByKey } from '../../_shared/server/upsert';

export async function getSkillsData() {
  try {
    const user = await requireCandidateAuth();
    if (!user) {
      throw new Error('認証が必要です');
    }

    const skillsData = await getSkillsFromDB(user.id);
    if (!skillsData) {
      return null;
    }

    return {
      englishLevel: skillsData.english_level || '',
      otherLanguages: Array.isArray(skillsData.other_languages)
        ? skillsData.other_languages
        : [],
      skills: Array.isArray(skillsData.skills_list)
        ? skillsData.skills_list
        : [],
      qualifications: skillsData.qualifications || '',
    };
  } catch (error) {
    console.error('スキルデータの取得に失敗しました:', error);
    return null;
  }
}

export async function updateSkillsData(formData: FormData) {
  try {
    // 認証チェック
    const authResult = await requireCandidateAuthForAction();
    if (!authResult.success) {
      throw new Error(authResult.error);
    }

    const { candidateId } = authResult.data;

    // フォームデータをパース
    const englishLevel = formData.get('englishLevel')?.toString() || '';
    const qualifications = formData.get('qualifications')?.toString() || '';

    // 配列データをパース（共通ユーティリティ使用）
    const skills = parseJsonField<string[]>(formData, 'skills', []);
    const otherLanguages = parseJsonField<any[]>(
      formData,
      'otherLanguages',
      []
    );

    console.log('Updating skills data:', {
      candidateId,
      englishLevel,
      qualifications,
      skills,
      otherLanguages,
    });

    const supabase = await getSupabaseServerClient();

    // skillsテーブル upsert（update→0件ならinsert）
    const { error: skillsError } = await updateOrInsertByKey({
      client: supabase,
      table: 'skills',
      key: 'candidate_id',
      value: candidateId,
      update: {
        english_level: englishLevel || null,
        qualifications: qualifications || null,
        skills_list: skills,
        other_languages: otherLanguages,
      },
      insert: {
        candidate_id: candidateId,
        english_level: englishLevel || null,
        qualifications: qualifications || null,
        skills_list: skills,
        other_languages: otherLanguages,
      },
    });

    if (skillsError) {
      console.error('Skills update error:', skillsError);
      throw new Error('スキル情報の更新に失敗しました');
    }

    // candidatesテーブルのskills配列も更新
    const { error: candidateError } = await supabase
      .from('candidates')
      .update({
        skills: skills,
        updated_at: new Date().toISOString(),
      })
      .eq('id', candidateId);

    if (candidateError) {
      console.error('Candidate skills update error:', candidateError);
      // これはエラーにしない（主要な情報は既にskillsテーブルに保存済み）
      console.warn(
        '候補者テーブルのスキル配列の更新に失敗しましたが、処理を続行します'
      );
    }

    console.log('Skills update success:', { candidateId });
    return { success: true };
  } catch (error) {
    console.error('Skills update failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '更新に失敗しました',
    };
  }
}
