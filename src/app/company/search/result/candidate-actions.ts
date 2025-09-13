'use server';

import { ERROR_CODES, createError } from '@/constants/error-codes';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { createClient } from '@/lib/supabase/server';
import { maskUserId , safeLog} from '@/lib/utils/pii-safe-logger';

export async function toggleCandidateHiddenAction(candidateId: string, companyGroupId: string) {
  try {
    const supabase = await getSupabaseServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      safeLog('error', 'Auth error:', authError);
          const apiError = createError('API_001', 'Authentication required');
    return {
      success: false,
      error: apiError.message,
      code: apiError.code
    };
    }

    const { data: companyUser, error: userError } = await supabase
      .from('company_users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (userError || !companyUser) {
      safeLog('error', 'Error fetching company user:', userError);
          const apiError = createError('API_001', 'Company user not found');
    return {
      success: false,
      error: apiError.message,
      code: apiError.code
    };
    }

    const adminSupabase = await createClient();
    
    // 既存の非表示設定を確認
    const { data: existingHidden, error: fetchError } = await adminSupabase
      .from('hidden_candidates')
      .select('id, is_hidden')
      .eq('candidate_id', candidateId)
      .eq('company_group_id', companyGroupId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      safeLog('error', 'Error fetching hidden status:', fetchError);
          const apiError = createError('API_001', 'Failed to check hidden status');
    return {
      success: false,
      error: apiError.message,
      code: apiError.code
    };
    }

    if (existingHidden) {
      // 既存のレコードがある場合は、is_hiddenを切り替え
      const { error: updateError } = await adminSupabase
        .from('hidden_candidates')
        .update({ 
          is_hidden: !existingHidden.is_hidden,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingHidden.id);

      if (updateError) {
        safeLog('error', 'Error updating hidden status:', updateError);
            const apiError = createError('API_001', 'Failed to update hidden status');
    return {
      success: false,
      error: apiError.message,
      code: apiError.code
    };
      }
      
      return { success: true, isHidden: !existingHidden.is_hidden };
    } else {
      // 新規レコードを作成（デフォルトでis_hidden: true）
      const { error: insertError } = await adminSupabase
        .from('hidden_candidates')
        .insert({
          company_user_id: companyUser.id,
          company_group_id: companyGroupId,
          candidate_id: candidateId,
          is_hidden: true,
          hidden_at: new Date().toISOString()
        });

      if (insertError) {
        safeLog('error', 'Error inserting hidden record:', insertError);
            const apiError = createError('API_001', 'Failed to hide candidate');
    return {
      success: false,
      error: apiError.message,
      code: apiError.code
    };
      }
      
      return { success: true, isHidden: true };
    }
  } catch (error) {
    safeLog('error', 'Toggle hidden action failed:', error);
        const apiError = createError('API_001', 'Internal error');
    return {
      success: false,
      error: apiError.message,
      code: apiError.code
    };
  }
}

export async function getHiddenCandidatesAction(companyGroupId: string) {
  try {
    const adminSupabase = await createClient();

    const { data, error } = await adminSupabase
      .from('hidden_candidates')
      .select('candidate_id, is_hidden')
      .eq('company_group_id', companyGroupId)
      .eq('is_hidden', true);

    if (error) {
      safeLog('error', 'Error fetching hidden candidates:', error);
      return { success: false, data: [] };
    }

    return { 
      success: true, 
      data: data?.map(item => item.candidate_id) || [] 
    };
  } catch (error) {
    safeLog('error', 'Get hidden candidates action failed:', error);
    return { success: false, data: [] };
  }
}

export async function saveCandidateAction(candidateId: string, companyGroupId: string) {
  if (process.env.NODE_ENV === 'development') safeLog('debug', '[DEBUG] saveCandidateAction called with:', { candidateId, companyGroupId });
  try {
    const supabase = await getSupabaseServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      safeLog('error', 'Auth error:', authError);
          const apiError = createError('API_001', 'Authentication required');
    return {
      success: false,
      error: apiError.message,
      code: apiError.code
    };
    }
    if (process.env.NODE_ENV === 'development') safeLog('debug', '[DEBUG] Auth user ID:', maskUserId(user.id));

    const { data: companyUser, error: userError } = await supabase
      .from('company_users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (userError || !companyUser) {
      safeLog('error', 'Error fetching company user:', userError);
      if (process.env.NODE_ENV === 'development') safeLog('debug', '[DEBUG] User ID from auth:', maskUserId(user.id));
          const apiError = createError('API_001', 'Company user not found');
    return {
      success: false,
      error: apiError.message,
      code: apiError.code
    };
    }
    if (process.env.NODE_ENV === 'development') safeLog('debug', '[DEBUG] Found company user:', companyUser);

    const adminSupabase = await createClient();
    
    const insertData = {
      company_user_id: companyUser.id,
      company_group_id: companyGroupId,
      candidate_id: candidateId,
    };
    if (process.env.NODE_ENV === 'development') safeLog('debug', '[DEBUG] Inserting saved_candidates with data:', insertData);
    
    const { error: insertError } = await adminSupabase
      .from('saved_candidates')
      .insert(insertData);

    if (insertError) {
      if (insertError.code === '23505') {
        if (process.env.NODE_ENV === 'development') safeLog('debug', '[DEBUG] Candidate already saved (duplicate key)');
            const apiError = createError('API_001', 'Candidate already saved');
    return {
      success: false,
      error: apiError.message,
      code: apiError.code
    };
      }
      safeLog('error', 'Error saving candidate:', insertError);
      if (process.env.NODE_ENV === 'development') safeLog('debug', '[DEBUG] Insert error details:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });
      return { success: false, error: `Failed to save candidate: ${insertError.message}` };
    }
    safeLog('info', '[DEBUG] Successfully saved candidate');

    return { success: true };
  } catch (error) {
    safeLog('error', 'Save candidate action failed:', error);
        const apiError = createError('API_001', 'Internal error');
    return {
      success: false,
      error: apiError.message,
      code: apiError.code
    };
  }
}

export async function unsaveCandidateAction(candidateId: string, companyGroupId: string) {
  if (process.env.NODE_ENV === 'development') safeLog('debug', '[DEBUG] unsaveCandidateAction called with:', { candidateId, companyGroupId });
  try {
    const supabase = await getSupabaseServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      safeLog('error', 'Auth error:', authError);
          const apiError = createError('API_001', 'Authentication required');
    return {
      success: false,
      error: apiError.message,
      code: apiError.code
    };
    }

    const { data: companyUser, error: userError } = await supabase
      .from('company_users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (userError || !companyUser) {
      safeLog('error', 'Error fetching company user:', userError);
          const apiError = createError('API_001', 'Company user not found');
    return {
      success: false,
      error: apiError.message,
      code: apiError.code
    };
    }

    const adminSupabase = await createClient();
    
    const { error: deleteError } = await adminSupabase
      .from('saved_candidates')
      .delete()
      .eq('company_user_id', companyUser.id)
      .eq('company_group_id', companyGroupId)
      .eq('candidate_id', candidateId);

    if (deleteError) {
      safeLog('error', 'Error unsaving candidate:', deleteError);
          const apiError = createError('API_001', 'Failed to unsave candidate');
    return {
      success: false,
      error: apiError.message,
      code: apiError.code
    };
    }

    return { success: true };
  } catch (error) {
    safeLog('error', 'Unsave candidate action failed:', error);
        const apiError = createError('API_001', 'Internal error');
    return {
      success: false,
      error: apiError.message,
      code: apiError.code
    };
  }
}

export async function getSavedCandidatesAction(companyGroupId: string) {
  try {
    const supabase = await getSupabaseServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      safeLog('error', 'Auth error:', authError);
      return { success: false, data: [] };
    }

    const { data: companyUser, error: userError } = await supabase
      .from('company_users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (userError || !companyUser) {
      safeLog('error', 'Error fetching company user:', userError);
      return { success: false, data: [] };
    }

    const adminSupabase = await createClient();
    
    const { data: savedCandidates, error: fetchError } = await adminSupabase
      .from('saved_candidates')
      .select('candidate_id')
      .eq('company_user_id', companyUser.id)
      .eq('company_group_id', companyGroupId);

    if (fetchError) {
      safeLog('error', 'Error fetching saved candidates:', fetchError);
      return { success: false, data: [] };
    }

    return { 
      success: true, 
      data: savedCandidates?.map(item => item.candidate_id) || [] 
    };
  } catch (error) {
    safeLog('error', 'Get saved candidates action failed:', error);
    return { success: false, data: [] };
  }
}