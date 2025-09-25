'use server';

import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';

// Career status form data types
export interface CareerStatusFormData {
  hasCareerChange: 'あり' | 'なし';
  jobChangeTiming: string;
  currentActivityStatus: string;
  selectionEntries: Array<{
    id: string;
    isPrivate: boolean;
    industries: string[];
    companyName: string;
    department: string;
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
  hasCareerChange: z.enum(['あり', 'なし']),
  jobChangeTiming: z.string().min(1, '転職希望時期を選択してください'),
  currentActivityStatus: z.string().min(1, '現在の活動状況を選択してください'),
  selectionEntries: z.array(
    z.object({
      id: z.string(),
      isPrivate: z.boolean(),
      industries: z.array(z.string()),
      companyName: z.string(),
      department: z.string(),
      progressStatus: z.string(),
      declineReason: z.string().optional(),
    })
  ),
  userId: z.string().min(1, 'ユーザーIDが必要です'),
});

export async function saveCareerStatusAction(
  formData: CareerStatusFormData,
  userId: string
): Promise<SaveCareerStatusResult> {
  try {
    logger.info(
      'Career status save request received at:',
      new Date().toISOString()
    );

    // RLS対応のSupabaseクライアントを使用
    const { getSupabaseServerClient } = await import(
      '@/lib/supabase/server-client'
    );
    const { getOrCreateCandidateId } = await import('@/lib/signup/candidateId');

    const supabase = await getSupabaseServerClient();
    const candidateId = await getOrCreateCandidateId();

    logger.info('Career status save request details:', {
      candidateId: candidateId.substring(0, 8) + '***',
      hasCareerChange: formData.hasCareerChange,
      entriesCount: formData.selectionEntries.length,
    });

    try {
      // Update candidates table with career status info
      const { error: candidateUpdateError } = await supabase
        .from('candidates')
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq('id', candidateId);

      if (candidateUpdateError) {
        logger.error(
          'Failed to update candidate career status:',
          candidateUpdateError
        );
        return {
          success: false,
          message: 'キャリア状況情報の保存に失敗しました。',
        };
      }

      // Delete existing career status entries first
      const { error: deleteError } = await supabase
        .from('career_status_entries')
        .delete()
        .eq('candidate_id', candidateId);

      if (deleteError) {
        logger.error(
          'Failed to delete existing career status entries:',
          deleteError
        );
        return {
          success: false,
          message: '既存の選考状況データの削除に失敗しました。',
        };
      }

      // Create base entry with timing and activity status
      const baseEntry = {
        candidate_id: candidateId,
        has_career_change: formData.hasCareerChange,
        job_change_timing: formData.jobChangeTiming,
        current_activity_status: formData.currentActivityStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      let entriesToInsert = [];

      // Insert new career status entries if they exist
      if (formData.selectionEntries && formData.selectionEntries.length > 0) {
        entriesToInsert = formData.selectionEntries.map(entry => ({
          ...baseEntry,
          is_private: entry.isPrivate,
          industries: entry.industries,
          company_name: entry.companyName,
          department: entry.department || '',
          progress_status: entry.progressStatus,
          decline_reason: entry.declineReason || '',
        }));
      } else {
        // Even if no selection entries, save the timing and activity status
        entriesToInsert = [
          {
            ...baseEntry,
            is_private: false,
            industries: null,
            company_name: null,
            department: null,
            progress_status: null,
            decline_reason: null,
          },
        ];
      }

      const { error: insertError } = await supabase
        .from('career_status_entries')
        .insert(entriesToInsert);

      if (insertError) {
        logger.error('Failed to insert career status entries:', insertError);
        return {
          success: false,
          message: '選考状況データの保存に失敗しました。',
        };
      }

      logger.info(
        `Career status data saved successfully for user: ${candidateId}`
      );

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
      message:
        'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
    };
  }
}
