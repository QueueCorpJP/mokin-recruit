'use server'

import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';

// Career status form data types
export interface CareerStatusFormData {
  hasCareerChange: 'yes' | 'no';
  jobChangeTiming: string;
  currentActivityStatus: string;
  selectionEntries: Array<{
    id: string;
    isPrivate: boolean;
    industries: Array<{ id: string; name: string }>;
    companyName: string;
    department?: string;
    progressStatus: string;
    declineReason?: string;
  }>;
}

export interface SaveCareerStatusResult {
  success: boolean;
  error?: string;
  message?: string;
}

// Validation schema
const CareerStatusSchema = z.object({
  hasCareerChange: z.enum(['yes', 'no']),
  jobChangeTiming: z.string().min(1, '転職希望時期を選択してください'),
  currentActivityStatus: z.string().min(1, '現在の活動状況を選択してください'),
  selectionEntries: z.array(z.object({
    id: z.string(),
    isPrivate: z.boolean(),
    industries: z.array(z.object({
      id: z.string(),
      name: z.string(),
    })),
    companyName: z.string(),
    department: z.string().optional(),
    progressStatus: z.string(),
    declineReason: z.string().optional(),
  })),
  userId: z.string().min(1, 'ユーザーIDが必要です'),
});

export async function saveCareerStatusAction(
  formData: CareerStatusFormData,
  userId: string
): Promise<SaveCareerStatusResult> {
  try {
    logger.info('Career status save request received at:', new Date().toISOString());

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
    const validationResult = CareerStatusSchema.safeParse({
      ...formData,
      userId,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      logger.warn('Career status validation failed:', firstError);
      return {
        success: false,
        error: firstError?.message || 'Invalid input',
      };
    }

    const { hasCareerChange, jobChangeTiming, currentActivityStatus, selectionEntries } = validationResult.data;

    logger.info('Career status save request details:', {
      userId: userId.substring(0, 8) + '***',
      hasCareerChange,
      entriesCount: selectionEntries.length,
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
      // Update candidates table with career status info
      const { error: candidateUpdateError } = await supabaseAdmin
        .from('candidates')
        .update({
          has_career_change: hasCareerChange,
          job_change_timing: jobChangeTiming,
          current_activity_status: currentActivityStatus,
          career_status_updated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (candidateUpdateError) {
        logger.error('Failed to update candidate career status:', candidateUpdateError);
        return {
          success: false,
          message: 'キャリア状況情報の保存に失敗しました。',
        };
      }

      // Delete existing career status entries
      const { error: deleteError } = await supabaseAdmin
        .from('career_status_entries')
        .delete()
        .eq('candidate_id', userId);

      if (deleteError) {
        logger.error('Failed to delete existing career status entries:', deleteError);
        return {
          success: false,
          message: '既存の選考状況データの削除に失敗しました。',
        };
      }

      // Insert new career status entries if they exist
      if (selectionEntries && selectionEntries.length > 0) {
        const entriesToInsert = selectionEntries.map(entry => ({
          candidate_id: userId,
          is_private: entry.isPrivate,
          industries: entry.industries,
          company_name: entry.companyName,
          department: entry.department || '',
          progress_status: entry.progressStatus,
          decline_reason: entry.declineReason || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        const { error: insertError } = await supabaseAdmin
          .from('career_status_entries')
          .insert(entriesToInsert);

        if (insertError) {
          logger.error('Failed to insert career status entries:', insertError);
          return {
            success: false,
            message: '選考状況データの保存に失敗しました。',
          };
        }
      }

      logger.info(`Career status data saved successfully for user: ${userId}`);

      return {
        success: true,
        message: 'キャリア状況情報が保存されました。',
      };

    } catch (saveError) {
      logger.error('Career status save operation failed:', saveError);
      return {
        success: false,
        message: 'データ保存中にエラーが発生しました。',
      };
    }
  } catch (error) {
    logger.error('Critical error in career status save action:', error);
    return {
      success: false,
      message: 'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
    };
  }
}