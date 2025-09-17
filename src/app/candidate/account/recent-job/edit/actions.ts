'use server';

import {
  requireCandidateAuth,
  requireCandidateAuthForAction,
} from '@/lib/auth/server';
import { getCandidateData } from '@/lib/server/candidate/candidateData';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { INDUSTRY_GROUPS } from '@/constants/industry-data';
import { JOB_TYPE_GROUPS } from '@/constants/job-type-data';

export async function getRecentJobData() {
  try {
    const user = await requireCandidateAuth();
    if (!user) {
      throw new Error('認証が必要です');
    }

    const candidateData = await getCandidateData(user.id);
    if (!candidateData) {
      return null;
    }

    // 複数職歴データをrecent_job_industriesフィールドから読み取り
    if (
      candidateData.recent_job_industries &&
      Array.isArray(candidateData.recent_job_industries)
    ) {
      // recent_job_industriesが職歴配列データか業種配列データかを判定
      const firstItem = candidateData.recent_job_industries[0];
      if (firstItem && typeof firstItem === 'object' && firstItem.companyName) {
        // 複数職歴データとして保存されている場合
        return {
          jobHistories: candidateData.recent_job_industries.map((job: any) => ({
            companyName: job.companyName || '',
            departmentPosition: job.departmentPosition || '',
            startYear: job.startYear || '',
            startMonth: job.startMonth || '',
            endYear: job.endYear || '',
            endMonth: job.endMonth || '',
            isCurrentlyWorking: job.isCurrentlyWorking || false,
            industries: Array.isArray(job.industries)
              ? job.industries.filter(Boolean)
              : [],
            jobTypes: Array.isArray(job.jobTypes)
              ? job.jobTypes.filter(Boolean)
              : [],
            jobDescription: job.jobDescription || '',
          })),
        };
      }
    }

    // フォールバック: 既存のrecent_job_*フィールドから単一職歴を構築
    return {
      jobHistories: [
        {
          companyName: candidateData.recent_job_company_name || '',
          departmentPosition:
            candidateData.recent_job_department_position || '',
          startYear: candidateData.recent_job_start_year || '',
          startMonth: candidateData.recent_job_start_month || '',
          endYear: candidateData.recent_job_end_year || '',
          endMonth: candidateData.recent_job_end_month || '',
          isCurrentlyWorking:
            candidateData.recent_job_is_currently_working || false,
          industries: Array.isArray(candidateData.recent_job_industries)
            ? candidateData.recent_job_industries
                .map((item: any) =>
                  typeof item === 'string' ? item : item.name || item.id || item
                )
                .filter(Boolean)
            : [],
          jobTypes: Array.isArray(candidateData.recent_job_types)
            ? candidateData.recent_job_types
                .map((item: any) =>
                  typeof item === 'string' ? item : item.name || item.id || item
                )
                .filter(Boolean)
            : [],
          jobDescription: candidateData.recent_job_description || '',
        },
      ],
    };
  } catch (error) {
    console.error('職務経歴データの取得に失敗しました:', error);
    return null;
  }
}

export async function updateRecentJobData(formData: FormData) {
  try {
    // 認証チェック
    const authResult = await requireCandidateAuthForAction();
    if (!authResult.success) {
      throw new Error((authResult as any).error || '認証が必要です');
    }

    const { candidateId } = authResult.data;

    // 職歴データをパース
    const jobHistoriesJson = formData.get('jobHistories')?.toString();
    let jobHistories: any[] = [];

    if (jobHistoriesJson) {
      try {
        jobHistories = JSON.parse(jobHistoriesJson);
      } catch (e) {
        console.error('Job histories JSON parse error:', e);
        throw new Error('職歴データの解析に失敗しました');
      }
    }

    // 各職歴の業種・職種IDを日本語名に変換
    const processedJobHistories = jobHistories.map(job => {
      const industries = (job.industries || [])
        .map((id: string) => {
          const industry = INDUSTRY_GROUPS.flatMap(g => g.industries).find(
            i => i.id === id
          );
          return industry ? industry.name : id; // 日本語名のみ保存
        })
        .filter(Boolean);

      const jobTypes = (job.jobTypes || [])
        .map((id: string) => {
          const jobType = JOB_TYPE_GROUPS.flatMap(g => g.jobTypes).find(
            jt => jt.id === id
          );
          return jobType ? jobType.name : id; // 日本語名のみ保存
        })
        .filter(Boolean);

      return {
        ...job,
        industries,
        jobTypes,
      };
    });

    console.log('Updating job histories data:', {
      candidateId,
      jobHistories: processedJobHistories,
    });

    const supabase = await getSupabaseServerClient();

    // 複数職歴を既存フィールドに保存する方法：
    // - 最初の職歴の基本情報を既存のフィールドに保存（互換性維持）
    // - 全職歴をJSONBフィールドに保存（複数職歴対応）
    const firstJobHistory = processedJobHistories[0];

    // 複数企業名を結合（例：「A社 | B社 | C社」）
    const allCompanyNames = processedJobHistories
      .map(job => job.companyName)
      .filter(Boolean)
      .join(' | ');

    // 複数業務内容を結合
    const allJobDescriptions = processedJobHistories
      .map((job, index) => {
        if (!job.jobDescription) return '';
        return processedJobHistories.length > 1
          ? `【${job.companyName || `企業${index + 1}`}】${job.jobDescription}`
          : job.jobDescription;
      })
      .filter(Boolean)
      .join('\n\n');

    const updateData = firstJobHistory
      ? {
          // 最初の職歴の基本情報（互換性維持）
          recent_job_company_name: firstJobHistory.companyName || null,
          recent_job_department_position:
            firstJobHistory.departmentPosition || null,
          recent_job_start_year: firstJobHistory.startYear || null,
          recent_job_start_month: firstJobHistory.startMonth || null,
          recent_job_end_year: firstJobHistory.endYear || null,
          recent_job_end_month: firstJobHistory.endMonth || null,
          recent_job_is_currently_working:
            firstJobHistory.isCurrentlyWorking || false,
          // 複数職歴の場合は全職歴を保存、単一の場合は業種・職種を保存
          recent_job_industries:
            processedJobHistories.length > 1
              ? processedJobHistories
              : firstJobHistory.industries,
          recent_job_types:
            processedJobHistories.length > 1 ? null : firstJobHistory.jobTypes,
          recent_job_description: allJobDescriptions || null,
          recent_job_updated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      : {
          updated_at: new Date().toISOString(),
        };

    // candidatesテーブルの既存フィールドに保存
    const { error: candidateError } = await supabase
      .from('candidates')
      .update(updateData)
      .eq('id', candidateId);

    if (candidateError) {
      console.error('Recent job update error:', candidateError);
      throw new Error('職務経歴の更新に失敗しました');
    }

    console.log('Recent job update success:', { candidateId });
    return { success: true };
  } catch (error) {
    console.error('Job history update failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '更新に失敗しました',
    };
  }
}
