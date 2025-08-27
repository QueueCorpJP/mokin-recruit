'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export async function approveJob(jobId: string) {
  try {
    const supabase = getSupabaseAdminClient();
    
    const { error } = await supabase
      .from('job_postings')
      .update({ 
        status: 'PUBLISHED',
        published_at: new Date().toISOString()
      })
      .eq('id', jobId);

    if (error) {
      console.error('Job approval error:', error);
      return { success: false, error: '承認に失敗しました' };
    }

    // ページを再検証して最新データを反映
    revalidatePath('/admin/job');
    revalidatePath('/admin/job/pending');
    
    return { success: true };
  } catch (error) {
    console.error('Job approval error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '承認に失敗しました' 
    };
  }
}

export async function rejectJob(jobId: string) {
  try {
    const supabase = getSupabaseAdminClient();
    
    const { error } = await supabase
      .from('job_postings')
      .update({ 
        status: 'DRAFT',
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);

    if (error) {
      console.error('Job rejection error:', error);
      return { success: false, error: '却下に失敗しました' };
    }

    revalidatePath('/admin/job');
    revalidatePath('/admin/job/pending');
    
    return { success: true };
  } catch (error) {
    console.error('Job rejection error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '却下に失敗しました' 
    };
  }
}

export async function bulkApproveJobs(jobIds: string[], reason?: string, comment?: string) {
  try {
    const supabase = getSupabaseAdminClient();
    
    const { error } = await supabase
      .from('job_postings')
      .update({ 
        status: 'PUBLISHED',
        published_at: new Date().toISOString(),
        approval_reason: reason,
        approval_comment: comment,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .in('id', jobIds);

    if (error) {
      console.error('Bulk approval error:', error);
      return { success: false, error: '一括承認に失敗しました' };
    }

    revalidatePath('/admin/job');
    revalidatePath('/admin/job/pending');
    
    return { success: true };
  } catch (error) {
    console.error('Bulk approval error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '一括承認に失敗しました' 
    };
  }
}

export async function bulkRejectJobs(jobIds: string[], reason?: string, comment?: string) {
  try {
    const supabase = getSupabaseAdminClient();
    
    const { error } = await supabase
      .from('job_postings')
      .update({ 
        status: 'DRAFT',
        rejection_reason: reason,
        rejection_comment: comment,
        rejected_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .in('id', jobIds);

    if (error) {
      console.error('Bulk rejection error:', error);
      return { success: false, error: '一括却下に失敗しました' };
    }

    revalidatePath('/admin/job');
    revalidatePath('/admin/job/pending');
    
    return { success: true };
  } catch (error) {
    console.error('Bulk rejection error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '一括却下に失敗しました' 
    };
  }
}

export async function deleteJob(jobId: string) {
  try {
    const supabase = getSupabaseAdminClient();
    
    const { error } = await supabase
      .from('job_postings')
      .delete()
      .eq('id', jobId);

    if (error) {
      console.error('Job delete error:', error);
      return { success: false, error: '削除に失敗しました' };
    }

    revalidatePath('/admin/job');
    return { success: true };
  } catch (error) {
    console.error('Job delete error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '削除に失敗しました' 
    };
  }
}

export async function updateJob(jobId: string, jobData: any) {
  try {
    const supabase = getSupabaseAdminClient();
    
    console.log('Updating job:', jobId, 'with data:', Object.keys(jobData));
    
    const { data, error } = await supabase
      .from('job_postings')
      .update({
        company_group_id: jobData.company_group_id,
        title: jobData.title,
        job_description: jobData.job_description,
        position_summary: jobData.position_summary,
        required_skills: jobData.required_skills,
        preferred_skills: jobData.preferred_skills,
        salary_min: jobData.salary_min,
        salary_max: jobData.salary_max,
        salary_note: jobData.salary_note,
        employment_type: jobData.employment_type,
        employment_type_note: jobData.employment_type_note,
        work_location: jobData.work_locations,
        location_note: jobData.location_note,
        working_hours: jobData.working_hours,
        overtime: jobData.overtime,
        overtime_info: jobData.overtime_info,
        holidays: jobData.holidays,
        job_type: jobData.job_types,
        industry: jobData.industries,
        selection_process: jobData.selection_process,
        appeal_points: jobData.appeal_points,
        smoking_policy: jobData.smoking_policy,
        smoking_policy_note: jobData.smoking_policy_note,
        required_documents: jobData.required_documents,
        internal_memo: jobData.internal_memo,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId)
      .select();

    if (error) {
      console.error('Job update error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return { success: false, error: `更新に失敗しました: ${error.message}` };
    }

    console.log('Job update successful:', data);

    revalidatePath('/admin/job');
    revalidatePath(`/admin/job/${jobId}`);
    
    // 成功を返す（リダイレクトはクライアント側で処理）
    return { success: true, jobId };
  } catch (error) {
    console.error('Job update error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '更新に失敗しました' 
    };
  }
}

export async function createJob(jobData: any) {
  try {
    const supabase = getSupabaseAdminClient();
    
    console.log('Creating job with data:', {
      company_group_id: jobData.company_group_id,
      title: jobData.title,
      work_locations: jobData.work_locations,
      job_types: jobData.job_types,
      industries: jobData.industries,
      images: jobData.images ? jobData.images.length : 0
    });
    
    const { data, error } = await supabase
      .from('job_postings')
      .insert({
        company_group_id: jobData.company_group_id,
        title: jobData.title,
        job_description: jobData.job_description,
        position_summary: jobData.position_summary,
        required_skills: jobData.required_skills,
        preferred_skills: jobData.preferred_skills,
        salary_min: jobData.salary_min ? parseInt(jobData.salary_min) : null,
        salary_max: jobData.salary_max ? parseInt(jobData.salary_max) : null,
        salary_note: jobData.salary_note,
        employment_type: jobData.employment_type,
        employment_type_note: jobData.employment_type_note,
        work_location: jobData.work_locations,
        location_note: jobData.location_note,
        working_hours: jobData.working_hours,
        overtime: jobData.overtime,
        overtime_info: jobData.overtime_info,
        holidays: jobData.holidays,
        job_type: jobData.job_types,
        industry: jobData.industries,
        selection_process: jobData.selection_process,
        appeal_points: jobData.appeal_points,
        smoking_policy: jobData.smoking_policy,
        smoking_policy_note: jobData.smoking_policy_note,
        required_documents: jobData.required_documents,
        internal_memo: jobData.internal_memo,
        publication_type: jobData.publication_type || 'public',
        status: jobData.status || 'DRAFT',
        published_at: jobData.status === 'PUBLISHED' ? new Date().toISOString() : null,
        image_urls: jobData.images ? jobData.images.map((img: any) => `data:${img.contentType};base64,${img.data}`) : null
      })
      .select()
      .single();

    if (error) {
      console.error('Job create error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return { success: false, error: `作成に失敗しました: ${error.message}` };
    }

    revalidatePath('/admin/job');
    return { success: true, jobId: data.id };
  } catch (error) {
    console.error('Job create error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '作成に失敗しました' 
    };
  }
}