'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { createClient } from '@/lib/supabase/server';

export async function toggleCandidateHiddenAction(candidateId: string, companyGroupId: string) {
  try {
    const supabase = await getSupabaseServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return { success: false, error: 'Authentication required' };
    }

    const { data: companyUser, error: userError } = await supabase
      .from('company_users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (userError || !companyUser) {
      console.error('Error fetching company user:', userError);
      return { success: false, error: 'Company user not found' };
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
      console.error('Error fetching hidden status:', fetchError);
      return { success: false, error: 'Failed to check hidden status' };
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
        console.error('Error updating hidden status:', updateError);
        return { success: false, error: 'Failed to update hidden status' };
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
        console.error('Error inserting hidden record:', insertError);
        return { success: false, error: 'Failed to hide candidate' };
      }
      
      return { success: true, isHidden: true };
    }
  } catch (error) {
    console.error('Toggle hidden action failed:', error);
    return { success: false, error: 'Internal error' };
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
      console.error('Error fetching hidden candidates:', error);
      return { success: false, data: [] };
    }

    return { 
      success: true, 
      data: data?.map(item => item.candidate_id) || [] 
    };
  } catch (error) {
    console.error('Get hidden candidates action failed:', error);
    return { success: false, data: [] };
  }
}

export async function saveCandidateAction(candidateId: string, companyGroupId: string) {
  console.log('[DEBUG] saveCandidateAction called with:', { candidateId, companyGroupId });
  try {
    const supabase = await getSupabaseServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return { success: false, error: 'Authentication required' };
    }

    const { data: companyUser, error: userError } = await supabase
      .from('company_users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (userError || !companyUser) {
      console.error('Error fetching company user:', userError);
      return { success: false, error: 'Company user not found' };
    }

    const adminSupabase = await createClient();
    
    const { error: insertError } = await adminSupabase
      .from('saved_candidates')
      .insert({
        company_user_id: companyUser.id,
        company_group_id: companyGroupId,
        candidate_id: candidateId,
      });

    if (insertError) {
      if (insertError.code === '23505') {
        return { success: false, error: 'Candidate already saved' };
      }
      console.error('Error saving candidate:', insertError);
      return { success: false, error: 'Failed to save candidate' };
    }

    return { success: true };
  } catch (error) {
    console.error('Save candidate action failed:', error);
    return { success: false, error: 'Internal error' };
  }
}

export async function unsaveCandidateAction(candidateId: string, companyGroupId: string) {
  console.log('[DEBUG] unsaveCandidateAction called with:', { candidateId, companyGroupId });
  try {
    const supabase = await getSupabaseServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return { success: false, error: 'Authentication required' };
    }

    const { data: companyUser, error: userError } = await supabase
      .from('company_users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (userError || !companyUser) {
      console.error('Error fetching company user:', userError);
      return { success: false, error: 'Company user not found' };
    }

    const adminSupabase = await createClient();
    
    const { error: deleteError } = await adminSupabase
      .from('saved_candidates')
      .delete()
      .eq('company_user_id', companyUser.id)
      .eq('company_group_id', companyGroupId)
      .eq('candidate_id', candidateId);

    if (deleteError) {
      console.error('Error unsaving candidate:', deleteError);
      return { success: false, error: 'Failed to unsave candidate' };
    }

    return { success: true };
  } catch (error) {
    console.error('Unsave candidate action failed:', error);
    return { success: false, error: 'Internal error' };
  }
}

export async function getSavedCandidatesAction(companyGroupId: string) {
  try {
    const supabase = await getSupabaseServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return { success: false, data: [] };
    }

    const { data: companyUser, error: userError } = await supabase
      .from('company_users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (userError || !companyUser) {
      console.error('Error fetching company user:', userError);
      return { success: false, data: [] };
    }

    const adminSupabase = await createClient();
    
    const { data: savedCandidates, error: fetchError } = await adminSupabase
      .from('saved_candidates')
      .select('candidate_id')
      .eq('company_user_id', companyUser.id)
      .eq('company_group_id', companyGroupId);

    if (fetchError) {
      console.error('Error fetching saved candidates:', fetchError);
      return { success: false, data: [] };
    }

    return { 
      success: true, 
      data: savedCandidates?.map(item => item.candidate_id) || [] 
    };
  } catch (error) {
    console.error('Get saved candidates action failed:', error);
    return { success: false, data: [] };
  }
}