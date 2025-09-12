'use server';

import {
  requireCandidateAuth,
  requireCandidateAuthForAction,
} from '@/lib/auth/server';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { parseJsonField } from '../../_shared/utils/formData';
import { updateOrInsertByKey } from '@/lib/server/db/upsert';

export async function getExpectationData() {
  try {
    const user = await requireCandidateAuth();
    if (!user) {
      throw new Error('認証が必要です');
    }

    const supabase = await getSupabaseServerClient();

    const { data: expectationData, error } = await supabase
      .from('expectations')
      .select(
        `
        desired_income,
        desired_industries,
        desired_job_types,
        desired_work_locations,
        desired_work_styles
      `
      )
      .eq('candidate_id', user.id)
      .single();

    if (error) {
      // レコードが存在しない場合はnullを返す
      if (error.code === 'PGRST116') {
        return {
          desiredIncome: '',
          industries: [],
          jobTypes: [],
          workLocations: [],
          workStyles: [],
        };
      }
      console.error('希望条件データの取得に失敗しました:', error);
      return null;
    }

    // JSONデータをパース
    const parseJsonSafely = (jsonStr: string) => {
      try {
        return JSON.parse(jsonStr || '[]');
      } catch {
        return [];
      }
    };

    // 希望年収の値を正規化（「300万円」→「300」に変換）
    const normalizeIncomeValue = (income: string) => {
      if (!income) return '';
      // 「300万円」のような形式から「300」を抽出
      const match = income.match(/(\d+)/);
      return match ? match[1] : income;
    };

    const result = {
      desiredIncome: normalizeIncomeValue(
        expectationData?.desired_income || ''
      ),
      industries: parseJsonSafely(expectationData?.desired_industries),
      jobTypes: parseJsonSafely(expectationData?.desired_job_types),
      workLocations: parseJsonSafely(expectationData?.desired_work_locations),
      workStyles: parseJsonSafely(expectationData?.desired_work_styles),
    };

    return result;
  } catch (error) {
    console.error('希望条件データの取得に失敗しました:', error);
    return null;
  }
}

export async function updateExpectationData(formData: FormData) {
  try {
    // 認証チェック
    const authResult = await requireCandidateAuthForAction();
    if (!authResult.success) {
      throw new Error(authResult.error);
    }

    const { candidateId } = authResult.data;

    // フォームデータをパース
    const rawDesiredIncome = formData.get('desiredIncome')?.toString() || '';

    // 希望年収を「300」→「300万円」形式に変換
    const formatIncomeValue = (value: string) => {
      if (!value) return '';
      // 既に「万円」が含まれている場合はそのまま
      if (value.includes('万円')) return value;
      // 数値のみの場合は「万円」を追加
      if (/^\d+$/.test(value)) {
        if (value === '2000') return '2000万円以上';
        return `${value}万円`;
      }
      return value;
    };

    const desiredIncome = formatIncomeValue(rawDesiredIncome);

    // 配列データをパース（共通ユーティリティ使用）
    const industries = parseJsonField<string[]>(formData, 'industries', []);
    const jobTypes = parseJsonField<string[]>(formData, 'jobTypes', []);
    const workLocations = parseJsonField<string[]>(
      formData,
      'workLocations',
      []
    );
    const workStyles = parseJsonField<string[]>(formData, 'workStyles', []);

    console.log('Updating expectation data:', {
      candidateId,
      desiredIncome,
      industries,
      jobTypes,
      workLocations,
      workStyles,
    });

    const supabase = await getSupabaseServerClient();

    // expectationsテーブルを更新（まず更新を試し、存在しなければ挿入）
    const { error: expectationError } = await updateOrInsertByKey({
      client: supabase,
      table: 'expectations',
      key: 'candidate_id',
      value: candidateId,
      update: {
        desired_income: desiredIncome,
        desired_industries: JSON.stringify(industries),
        desired_job_types: JSON.stringify(jobTypes),
        desired_work_locations: JSON.stringify(workLocations),
        desired_work_styles: JSON.stringify(workStyles),
        updated_at: new Date().toISOString(),
      },
      insert: {
        candidate_id: candidateId,
        desired_income: desiredIncome,
        desired_industries: JSON.stringify(industries),
        desired_job_types: JSON.stringify(jobTypes),
        desired_work_locations: JSON.stringify(workLocations),
        desired_work_styles: JSON.stringify(workStyles),
        updated_at: new Date().toISOString(),
      },
    });

    if (expectationError) {
      console.error('Expectation update error:', expectationError);
      throw new Error('希望条件の更新に失敗しました');
    }

    console.log('Expectation update success:', { candidateId });
    return { success: true };
  } catch (error) {
    console.error('Expectation update failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '更新に失敗しました',
    };
  }
}
