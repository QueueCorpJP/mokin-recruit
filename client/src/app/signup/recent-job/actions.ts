'use server'

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

export interface SaveRecentJobResult {
  success: boolean;
  error?: string;
  message?: string;
}

// Validation schema
const RecentJobSchema = z.object({
  companyName: z.string().min(1, '企業名を入力してください'),
  departmentPosition: z.string().min(1, '部署名・役職名を入力してください'),
  startYear: z.string().min(1, '開始年月を選択してください'),
  startMonth: z.string().min(1, '開始年月を選択してください'),
  endYear: z.string().optional(),
  endMonth: z.string().optional(),
  isCurrentlyWorking: z.boolean(),
  industries: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })).min(1, '業種を1つ以上選択してください').max(3),
  jobTypes: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })).min(1, '職種を1つ以上選択してください').max(3),
  jobDescription: z.string().min(1, '業務内容を入力してください'),
  userId: z.string().min(1, 'ユーザーIDが必要です'),
}).superRefine((data, ctx) => {
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

export async function saveRecentJobAction(
  formData: RecentJobFormData,
  userId: string
): Promise<SaveRecentJobResult> {
  try {
    logger.info('Recent job save request received at:', new Date().toISOString());

    // Environment variables check
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      logger.error('Missing Supabase environment variables:', {
        hasUrl: !!supabaseUrl,
        hasServiceRoleKey: !!serviceRoleKey,
      });
      return {
        success: false,
        message: 'サーバー設定エラーが発生しました。',
      };
    }

    // Validation
    const validationResult = RecentJobSchema.safeParse({
      ...formData,
      userId,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      logger.warn('Recent job validation failed:', firstError);
      return {
        success: false,
        error: firstError?.message || 'Invalid input',
      };
    }

    const {
      companyName,
      departmentPosition,
      startYear,
      startMonth,
      endYear,
      endMonth,
      isCurrentlyWorking,
      industries,
      jobTypes,
      jobDescription,
    } = validationResult.data;

    logger.info('Recent job save request details:', {
      userId: userId.substring(0, 8) + '***',
      companyName: companyName.substring(0, 5) + '***',
      isCurrentlyWorking,
    });

    // Dynamic Supabase import
    let createClient;
    try {
      const supabaseModule = await import('@supabase/supabase-js');
      createClient = supabaseModule.createClient;
    } catch (importError) {
      logger.error('Failed to import Supabase module:', importError);
      return {
        success: false,
        message: 'サーバーライブラリの読み込みに失敗しました。',
      };
    }

    // Create admin client
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'X-Client-Info': 'mokin-recruit-server-admin',
        },
      },
    });

    try {
      // Update candidates table with recent job info
      const { error: candidateUpdateError } = await supabaseAdmin
        .from('candidates')
        .update({
          recent_job_company_name: companyName,
          recent_job_department_position: departmentPosition,
          recent_job_start_year: startYear,
          recent_job_start_month: startMonth,
          recent_job_end_year: endYear || null,
          recent_job_end_month: endMonth || null,
          recent_job_is_currently_working: isCurrentlyWorking,
          recent_job_industries: industries,
          recent_job_types: jobTypes,
          recent_job_description: jobDescription,
          recent_job_updated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (candidateUpdateError) {
        logger.error('Failed to update candidate recent job info:', candidateUpdateError);
        return {
          success: false,
          message: '直近の職歴情報の保存に失敗しました。',
        };
      }

      logger.info(`Recent job data saved successfully for user: ${userId}`);

      return {
        success: true,
        message: '直近の職歴情報が保存されました。',
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
      message: 'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
    };
  }
}