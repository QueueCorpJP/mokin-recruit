'use server';

import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';

// Recent job form data types
export interface RecentJobFormData {
  companyName: string;
  departmentPosition: string;
  startYear: string;
  startMonth: string;
  endYear?: string;
  endMonth?: string;
  isCurrentlyWorking: boolean;
  industries: Array<{ id: string; name: string }>;
  jobTypes: Array<{ id: string; name: string }>;
  jobDescription: string;
}

export interface MultipleJobHistoriesData {
  jobHistories: RecentJobFormData[];
}

export interface SaveRecentJobResult {
  success: boolean;
  error?: string;
  message?: string;
}

// Validation schema for single job history
const SingleJobHistorySchema = z
  .object({
    companyName: z.string().min(1, '企業名を入力してください'),
    departmentPosition: z.string().min(1, '部署名・役職名を入力してください'),
    startYear: z.string().min(1, '開始年月を選択してください'),
    startMonth: z.string().min(1, '開始年月を選択してください'),
    endYear: z.string().optional(),
    endMonth: z.string().optional(),
    isCurrentlyWorking: z.boolean(),
    industries: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      )
      .min(1, '業種を1つ以上選択してください')
      .max(3),
    jobTypes: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      )
      .min(1, '職種を1つ以上選択してください')
      .max(3),
    jobDescription: z.string().min(1, '業務内容を入力してください'),
  })
  .superRefine((data, ctx) => {
    // 在職中でない場合は終了年月が必須
    if (!data.isCurrentlyWorking) {
      if (!data.endYear || data.endYear === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '終了年月を選択するか、「在職中」にチェックを入れてください',
          path: ['endYear'],
        });
      }
      if (!data.endMonth || data.endMonth === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '終了年月を選択するか、「在職中」にチェックを入れてください',
          path: ['endMonth'],
        });
      }
    }
  });

// Validation schema for multiple job histories
const MultipleJobHistoriesSchema = z.object({
  jobHistories: z
    .array(SingleJobHistorySchema)
    .min(1, '職歴を1つ以上入力してください'),
  userId: z.string().min(1, 'ユーザーIDが必要です'),
});

export async function saveRecentJobAction(
  formData: MultipleJobHistoriesData,
  userId: string
): Promise<SaveRecentJobResult> {
  try {
    logger.info(
      'Recent job save request received at:',
      new Date().toISOString()
    );

    // RLS対応のSupabaseクライアントを使用
    const { getSupabaseServerClient } = await import(
      '@/lib/supabase/server-client'
    );
    const { getOrCreateCandidateId } = await import('@/lib/signup/candidateId');

    const supabase = await getSupabaseServerClient();
    const candidateId = await getOrCreateCandidateId();

    logger.info('Recent job save request details:', {
      candidateId: candidateId.substring(0, 8) + '***',
      jobHistoriesCount: formData.jobHistories.length,
    });

    try {
      // 複数職歴を処理
      const processedJobHistories = formData.jobHistories.map(job => ({
        companyName: job.companyName,
        departmentPosition: job.departmentPosition,
        startYear: job.startYear,
        startMonth: job.startMonth,
        endYear: job.endYear || '',
        endMonth: job.endMonth || '',
        isCurrentlyWorking: job.isCurrentlyWorking,
        industries: job.industries,
        jobTypes: job.jobTypes,
        jobDescription: job.jobDescription,
      }));

      // 最初の職歴を既存フィールドに保存（互換性維持）
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

      // Update candidates table with recent job info
      const { error: candidateUpdateError } = await supabase
        .from('candidates')
        .update({
          // 最初の職歴の基本情報（互換性維持）
          recent_job_company_name: firstJobHistory.companyName,
          recent_job_department_position: firstJobHistory.departmentPosition,
          recent_job_start_year: firstJobHistory.startYear,
          recent_job_start_month: firstJobHistory.startMonth,
          recent_job_end_year: firstJobHistory.endYear || null,
          recent_job_end_month: firstJobHistory.endMonth || null,
          recent_job_is_currently_working: firstJobHistory.isCurrentlyWorking,
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
        })
        .eq('id', candidateId);

      if (candidateUpdateError) {
        logger.error(
          'Failed to update candidate recent job info:',
          candidateUpdateError
        );
        return {
          success: false,
          message: '直近の職歴情報の保存に失敗しました。',
        };
      }

      logger.info(
        `Recent job data saved successfully for user: ${candidateId} with ${processedJobHistories.length} job histories`
      );

      return {
        success: true,
        message: `${processedJobHistories.length}件の職歴情報が保存されました。`,
      };
    } catch (saveError) {
      logger.error('Recent job save operation failed:', saveError);
      return {
        success: false,
        message: 'データ保存中にエラーが発生しました。',
      };
    }
  } catch (error) {
    logger.error('Critical error in recent job save action:', error);
    return {
      success: false,
      message:
        'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
    };
  }
}
