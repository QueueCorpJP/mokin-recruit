'use server';

import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { revalidatePath } from 'next/cache';
import { revalidateCompanyPaths } from '@/lib/server/actions/revalidate';
import crypto from 'crypto';
import { isSendgridConfigured, sendInvitationEmail } from '@/lib/email/sender';
import { getBaseUrl } from '@/lib/server/utils/url';
import { ok, fail } from '@/lib/server/actions/response';
import { toDbPermission } from '@/lib/company/permissions';

// プラン変更のバリデーションスキーマ
const PlanChangeSchema = z.object({
  plan: z.enum(['none', 'standard', 'strategic'], {
    errorMap: () => ({ message: '有効なプランを選択してください' }),
  }),
});

// スカウト上限数変更のバリデーションスキーマ
const ScoutLimitChangeSchema = z.object({
  scoutLimit: z.number().min(1).max(1000, {
    message: 'スカウト上限数は1〜1000の範囲で入力してください',
  }),
});

export async function updateCompanyPlan(companyId: string, newPlan: string) {
  try {
    console.log(
      `[updateCompanyPlan] Starting plan update: ${companyId} -> ${newPlan}`
    );

    // Step 1: Validate input data
    const validation = PlanChangeSchema.safeParse({ plan: newPlan });
    if (!validation.success) {
      console.error('[updateCompanyPlan] Validation failed:', validation.error);
      return {
        success: false,
        error:
          validation.error?.issues?.[0]?.message || 'プランが正しくありません',
        validationErrors: validation.error?.issues,
      };
    }

    const supabase = getSupabaseAdminClient();

    // Step 2: Admin権限でプランを更新
    // データベースのトリガーがadmin_userをチェックしているため、
    // 直接更新を最初に試す（最も確実）

    console.log('[updateCompanyPlan] Attempting direct update first...');
    const { data: directData, error: directError } = await supabase
      .from('company_accounts')
      .update({
        plan: newPlan,
        updated_at: new Date().toISOString(),
      })
      .eq('id', companyId)
      .select('id, company_name, plan, updated_at')
      .single();

    if (!directError) {
      console.log('[updateCompanyPlan] Direct update successful:', directData);

      // Step 3: Revalidate the company detail page
      revalidatePath(`/admin/company/${companyId}`);

      return {
        success: true,
        company: directData,
      };
    }

    console.log(
      '[updateCompanyPlan] Direct update failed, trying RPC method...',
      directError
    );

    // 方法1: 修正版のadmin関数を使用
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'update_company_plan_as_admin',
      {
        p_company_id: companyId,
        p_new_plan: newPlan,
      }
    );

    console.log('[updateCompanyPlan] RPC result:', { rpcData, rpcError });

    // RPCが存在しない場合
    if (rpcError?.code === 'PGRST202') {
      console.log('[updateCompanyPlan] RPC not found, trying raw SQL...');

      // 方法2: 生のSQLクエリを実行（トリガーをバイパス）
      const { data: sqlData, error: sqlError } = await supabase
        .rpc('query', {
          query_string: `
            UPDATE company_accounts
            SET plan = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING id, company_name, plan, updated_at
          `,
          params: [newPlan, companyId],
        })
        .single();

      // SQLクエリRPCも存在しない場合
      if (sqlError?.code === 'PGRST202') {
        console.log(
          'SQL RPC not found, using direct update with workaround...'
        );

        console.error('All update methods failed:', {
          directError,
          rpcError,
          sqlError,
        });

        return {
          success: false,
          error: `プランの更新に失敗しました。複数の方法を試しましたが、すべて失敗しました。管理者に連絡してください。`,
        };
      }

      if (sqlError) {
        console.error('SQL execution error:', sqlError);
        return {
          success: false,
          error: `プランの更新に失敗しました: ${sqlError.message}`,
        };
      }

      return {
        success: true,
        company: sqlData,
      };
    }

    if (rpcError) {
      console.error('RPC execution error:', rpcError);
      return {
        success: false,
        error: `プランの更新に失敗しました: ${rpcError.message}`,
      };
    }

    const updatedCompany = rpcData;

    console.log(
      '[updateCompanyPlan] Plan update completed successfully:',
      updatedCompany
    );

    // Step 3: Revalidate the company detail page
    revalidatePath(`/admin/company/${companyId}`);

    return {
      success: true,
      company: updatedCompany,
    };
  } catch (error) {
    console.error('Error updating company plan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function updateCompanyScoutLimit(
  companyId: string,
  newScoutLimit: number
) {
  try {
    // Step 1: Validate input data
    const validation = ScoutLimitChangeSchema.safeParse({
      scoutLimit: newScoutLimit,
    });
    if (!validation.success) {
      return {
        success: false,
        error:
          validation.error?.issues?.[0]?.message ||
          'スカウト上限数が正しくありません',
        validationErrors: validation.error?.issues,
      };
    }

    const supabase = getSupabaseAdminClient();

    // Step 2: Update company scout limit
    const { data: updatedCompany, error: updateError } = await supabase
      .from('company_accounts')
      .update({
        scout_limit: newScoutLimit,
        updated_at: new Date().toISOString(),
      })
      .eq('id', companyId)
      .select('id, company_name, scout_limit, updated_at')
      .single();

    if (updateError) {
      console.error('Company scout limit update error:', updateError);
      return {
        success: false,
        error: `スカウト上限数の更新に失敗しました: ${updateError.message}`,
      };
    }

    console.log('Company scout limit updated successfully:', updatedCompany);
    console.log(
      `New scout limit for ${updatedCompany.company_name}: ${newScoutLimit}`
    );

    // Step 3: Revalidate the company detail page
    revalidatePath(`/admin/company/${companyId}`);

    return {
      success: true,
      company: updatedCompany,
      newScoutLimit,
    };
  } catch (error) {
    console.error('Error updating company scout limit:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function suspendCompany(companyId: string) {
  try {
    const supabase = getSupabaseAdminClient();

    // Step 1: Update company status to SUSPENDED
    const { data: updatedCompany, error: updateError } = await supabase
      .from('company_accounts')
      .update({
        status: 'SUSPENDED',
        updated_at: new Date().toISOString(),
      })
      .eq('id', companyId)
      .select('id, company_name, status, updated_at')
      .single();

    if (updateError) {
      console.error('Company suspension error:', updateError);
      return {
        success: false,
        error: `企業休会処理に失敗しました: ${updateError.message}`,
      };
    }

    console.log('Company suspended successfully:', updatedCompany);

    // Step 2: Revalidate the company detail page
    revalidatePath(`/admin/company/${companyId}`);
    revalidatePath('/admin/company');

    return {
      success: true,
      company: updatedCompany,
    };
  } catch (error) {
    console.error('Error suspending company:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function updateGroupName(groupId: string, newGroupName: string) {
  try {
    const supabase = getSupabaseAdminClient();
    console.log(
      'updateGroupName called with groupId:',
      groupId,
      'newGroupName:',
      newGroupName
    );

    const { error } = await supabase
      .from('company_groups')
      .update({
        group_name: newGroupName.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', groupId);

    console.log('Update result:', { error });

    if (error) {
      console.error('Update error:', error);
      return fail(error.message);
    }

    // Use generic revalidation for all admin company pages
    revalidateCompanyPaths('/admin/company');

    // Also revalidate this specific page path pattern
    try {
      // We need to revalidate the dynamic route pattern
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/admin/company/[id]', 'page');
    } catch (revalidateErr) {
      console.warn('Revalidation warning:', revalidateErr);
    }

    return ok();
  } catch (e) {
    console.error(e);
    return fail('Internal Server Error');
  }
}

export async function createNewGroup(
  companyId: string,
  groupName: string,
  members: Array<{ email: string; role: string }>
) {
  try {
    const supabase = getSupabaseAdminClient();

    // 1) グループ作成
    const { data: newGroup, error: groupError } = await supabase
      .from('company_groups')
      .insert({
        company_account_id: companyId,
        group_name: groupName.trim(),
        description: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id, group_name')
      .single();

    if (groupError || !newGroup) {
      return fail(groupError?.message || 'グループ作成に失敗しました');
    }

    const invited: { email: string; role: string }[] = [];

    // 2) メンバー作成/権限付与
    for (const member of members) {
      const email = member.email.trim().toLowerCase();
      if (!email) continue;

      // company_users 既存確認
      const { data: existingUser } = await supabase
        .from('company_users')
        .select('id, email')
        .eq('email', email)
        .maybeSingle();

      let companyUserId: string | null = existingUser?.id ?? null;

      if (!companyUserId) {
        // 認証ユーザー作成（パスワード未設定）。失敗してもDBレコードは作成して進める
        let authUserId: string | undefined = undefined;
        try {
          const { data: authCreated, error: authErr } =
            await supabase.auth.admin.createUser({
              email,
              email_confirm: false,
              user_metadata: {
                user_type: 'company_user',
                company_account_id: companyId,
              },
            });
          if (!authErr && authCreated?.user?.id) {
            authUserId = authCreated.user.id;
          }
        } catch {}

        // company_users レコード作成（password_hash必須のためダミー）
        const { data: newUser, error: cuErr } = await supabase
          .from('company_users')
          .insert({
            company_account_id: companyId,
            email,
            password_hash: 'invited_without_password',
            full_name: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...(authUserId ? { auth_user_id: authUserId } : {}),
          })
          .select('id')
          .single();
        if (cuErr || !newUser) continue;
        companyUserId = newUser.id;
      }

      // グループ権限レコード作成
      const permission = toDbPermission(
        member.role as 'admin' | 'scout' | 'recruiter'
      );
      const { error: inviteErr } = await supabase
        .from('company_user_group_permissions')
        .upsert({
          company_user_id: companyUserId!,
          company_group_id: newGroup.id,
          permission_level: permission,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      if (inviteErr) continue;

      invited.push({ email, role: member.role });
    }

    // 3) SendGrid 招待メール送信
    if (await isSendgridConfigured()) {
      const baseUrl = getBaseUrl();
      const groupJoinUrl = `${baseUrl}/signup/group?groupId=${newGroup.id}&companyId=${companyId}`;

      // 企業名取得
      let companyName = '企業名';
      try {
        const { data: companyRow } = await supabase
          .from('company_accounts')
          .select('company_name')
          .eq('id', companyId)
          .single();
        if (companyRow?.company_name) companyName = companyRow.company_name;
      } catch {}

      // 各招待者に個別にメール送信（既存のsendInvitationEmail関数を使用）
      for (const invitedMember of invited) {
        try {
          await sendInvitationEmail({
            inviteeEmail: invitedMember.email,
            companyName,
            groupName: groupName,
            invitationUrl: groupJoinUrl,
          });
        } catch (emailError) {
          console.error(
            '招待メール送信エラー (%s):',
            invitedMember.email,
            emailError
          );
        }
      }
    }

    revalidateCompanyPaths('/admin/company');
    return ok({ groupId: newGroup.id, invited });
  } catch (e) {
    console.error(e);
    return fail('Internal Server Error');
  }
}

export async function inviteMembersToGroup(
  groupId: string,
  members: { email: string; role: 'admin' | 'scout' | 'recruiter' }[]
) {
  try {
    const supabase = getSupabaseAdminClient();

    // グループが存在するか検証＆企業ID・名称取得
    const { data: groupRow, error: groupErr } = await supabase
      .from('company_groups')
      .select('id, group_name, company_account_id')
      .eq('id', groupId)
      .single();
    if (groupErr || !groupRow) {
      return fail('不正なグループです');
    }

    const invited: { email: string; role: string }[] = [];

    for (const member of members) {
      const email = member.email.trim().toLowerCase();
      if (!email) continue;

      // 既存ユーザー確認
      const { data: existingUser } = await supabase
        .from('company_users')
        .select('id, email')
        .eq('email', email)
        .maybeSingle();

      let companyUserId: string | null = existingUser?.id ?? null;

      if (!companyUserId) {
        // Supabase Authユーザー作成（メール確認はしない／パスワード未設定）。失敗してもDBレコードは作成
        let authUserId: string | undefined = undefined;
        try {
          const { data: authCreated } = await supabase.auth.admin.createUser({
            email,
            email_confirm: false,
            user_metadata: {
              user_type: 'company_user',
              company_account_id: groupRow.company_account_id,
            },
          });
          if (authCreated?.user?.id) authUserId = authCreated.user.id;
        } catch {}

        // company_users作成（password_hashはダミー）
        const { data: newUser, error: cuErr } = await supabase
          .from('company_users')
          .insert({
            company_account_id: groupRow.company_account_id,
            email,
            password_hash: 'invited_without_password',
            full_name: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...(authUserId ? { auth_user_id: authUserId } : {}),
          })
          .select('id')
          .single();
        if (cuErr || !newUser) continue;
        companyUserId = newUser.id;
      }

      // 招待ステータスでレコード作成（権限は後で付与）
      const permissionLevel = toDbPermission(member.role);
      const { error: inviteErr } = await supabase
        .from('company_user_group_permissions')
        .upsert({
          company_user_id: companyUserId!,
          company_group_id: groupId,
          permission_level: permissionLevel,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      if (inviteErr) continue;

      invited.push({ email, role: member.role });
    }

    // 招待メール送信
    if (await isSendgridConfigured()) {
      const baseUrl = getBaseUrl();
      const groupJoinUrl = `${baseUrl}/signup/group?groupId=${groupRow.id}&companyId=${groupRow.company_account_id}`;

      // 企業名取得
      let companyName = '企業名';
      try {
        const { data: companyRow } = await supabase
          .from('company_accounts')
          .select('company_name')
          .eq('id', groupRow.company_account_id)
          .single();
        if (companyRow?.company_name) companyName = companyRow.company_name;
      } catch {}

      // 各招待者に個別にメール送信
      for (const invitedMember of invited) {
        try {
          await sendInvitationEmail({
            inviteeEmail: invitedMember.email,
            companyName,
            groupName: groupRow.group_name,
            invitationUrl: groupJoinUrl,
          });
        } catch (emailError) {
          console.error(
            '招待メール送信エラー (%s):',
            invitedMember.email,
            emailError
          );
        }
      }
    }

    revalidateCompanyPaths('/admin/company');
    return ok({ invitedCount: invited.length });
  } catch (e) {
    console.error(e);
    return fail('Internal Server Error');
  }
}

export async function deleteGroup(groupId: string) {
  try {
    const supabase = getSupabaseAdminClient();

    console.log(`[deleteGroup] Starting deletion for group: ${groupId}`);

    // より確実な削除方法：手動で依存関係に基づいて削除
    // 最も依存関係の深いものから削除していく

    // 1. まず selection_progress を削除（application と job_postings に依存）
    console.log('[deleteGroup] Step 1: Deleting selection_progress...');
    await supabase
      .from('selection_progress')
      .delete()
      .eq('company_group_id', groupId);

    // 2. messages を削除（rooms に依存）
    console.log('[deleteGroup] Step 2: Deleting messages...');
    await supabase
      .from('messages')
      .delete()
      .eq('sender_company_group_id', groupId);

    // 3. rooms を削除
    console.log('[deleteGroup] Step 3: Deleting rooms...');
    await supabase.from('rooms').delete().eq('company_group_id', groupId);

    // 4. application を削除（job_postings に依存）
    console.log('[deleteGroup] Step 4: Deleting applications...');
    await supabase.from('application').delete().eq('company_group_id', groupId);

    // 5. scout_sends を削除
    console.log('[deleteGroup] Step 5: Deleting scout_sends...');
    await supabase.from('scout_sends').delete().eq('company_group_id', groupId);

    // 6. このグループの job_postings を参照している search_templates を削除
    console.log('[deleteGroup] Step 6: Getting job_postings IDs...');
    const { data: jobPostings } = await supabase
      .from('job_postings')
      .select('id')
      .eq('company_group_id', groupId);

    if (jobPostings && jobPostings.length > 0) {
      const jobPostingIds = jobPostings.map(job => job.id);
      console.log(
        '[deleteGroup] Step 6a: Deleting search_templates that reference job_postings...'
      );
      await supabase
        .from('search_templates')
        .delete()
        .in('target_job_posting_id', jobPostingIds);
    }

    // 6b. グループに直接関連する search_templates も削除
    console.log(
      '[deleteGroup] Step 6b: Deleting search_templates by company_group_id...'
    );
    await supabase
      .from('search_templates')
      .delete()
      .eq('company_group_id', groupId);

    // 7. 他の関連データを削除
    console.log('[deleteGroup] Step 7: Deleting other related data...');
    await supabase
      .from('hidden_candidates')
      .delete()
      .eq('company_group_id', groupId);
    await supabase
      .from('saved_candidates')
      .delete()
      .eq('company_group_id', groupId);
    await supabase
      .from('message_templates')
      .delete()
      .eq('company_group_id', groupId);

    // 8. company_user_group_permissions を削除
    console.log('[deleteGroup] Step 8: Deleting permissions...');
    await supabase
      .from('company_user_group_permissions')
      .delete()
      .eq('company_group_id', groupId);

    // 9. job_postings を削除（search_templates削除後なので安全）
    console.log('[deleteGroup] Step 9: Deleting job_postings...');
    const { error: jobError } = await supabase
      .from('job_postings')
      .delete()
      .eq('company_group_id', groupId);

    if (jobError) {
      console.error(
        '[deleteGroup] Error deleting job_postings:',
        jobError.message
      );
      return fail(`求人情報の削除に失敗しました: ${jobError.message}`);
    }

    // 10. 最後にグループ本体を削除
    console.log('[deleteGroup] Step 10: Deleting group...');
    const { data: deletedGroup, error: deleteError } = await supabase
      .from('company_groups')
      .delete()
      .eq('id', groupId)
      .select('group_name')
      .single();

    if (deleteError) {
      console.error(
        '[deleteGroup] Final group deletion failed:',
        deleteError.message
      );
      return fail(`グループの削除に失敗しました: ${deleteError.message}`);
    }

    console.log(
      `[deleteGroup] Successfully deleted group: ${deletedGroup?.group_name || groupId}`
    );
    revalidateCompanyPaths('/admin/company');
    return ok({ deletedGroupName: deletedGroup?.group_name || 'グループ' });
  } catch (e) {
    console.error('Error deleting group:', e);
    return fail('Internal Server Error');
  }
}

export async function deleteMember(userId: string) {
  try {
    const supabase = getSupabaseAdminClient();

    console.log(`[deleteMember] Starting deletion for user: ${userId}`);

    // 1. まず company_user_group_permissions から削除
    const { error: permError } = await supabase
      .from('company_user_group_permissions')
      .delete()
      .eq('company_user_id', userId);

    if (permError) {
      console.error(
        '[deleteMember] Error deleting permissions:',
        permError.message
      );
      return fail(`権限の削除に失敗しました: ${permError.message}`);
    }

    // 2. company_users から削除
    const { data: deletedUser, error: deleteError } = await supabase
      .from('company_users')
      .delete()
      .eq('id', userId)
      .select('full_name, email')
      .single();

    if (deleteError) {
      console.error('[deleteMember] Error deleting user:', deleteError.message);
      return fail(`メンバーの削除に失敗しました: ${deleteError.message}`);
    }

    console.log(
      `[deleteMember] Successfully deleted user: ${deletedUser?.full_name || userId}`
    );
    revalidateCompanyPaths('/admin/company');
    return ok({ deletedUser: deletedUser?.full_name || '削除されたユーザー' });
  } catch (e) {
    console.error('Error deleting member:', e);
    return fail('Internal Server Error');
  }
}

export async function deleteCompany(companyId: string) {
  try {
    const supabase = getSupabaseAdminClient();

    console.log(
      `[Company Deletion] Starting physical deletion for company: ${companyId}`
    );

    // Step 1: Get company information before deletion for logging
    const { data: companyData, error: fetchError } = await supabase
      .from('company_accounts')
      .select('id, company_name')
      .eq('id', companyId)
      .single();

    if (fetchError) {
      console.error('Company fetch error before deletion:', fetchError);
      return {
        success: false,
        error: `企業情報の取得に失敗しました: ${fetchError.message}`,
      };
    }

    // Step 2: Delete related data first (if any tables exist)
    // Note: This is a placeholder for related data deletion
    // Add deletion of related tables here if they exist

    // Step 3: Physically delete the company account
    const { error: deleteError } = await supabase
      .from('company_accounts')
      .delete()
      .eq('id', companyId);

    if (deleteError) {
      console.error('Company physical deletion error:', deleteError);
      return {
        success: false,
        error: `企業アカウントの削除に失敗しました: ${deleteError.message}`,
      };
    }

    console.log(
      `[Company Deletion] Successfully deleted company: ${companyData.company_name} (ID: ${companyId})`
    );

    // Step 4: Revalidate the company list page
    revalidatePath('/admin/company');

    return {
      success: true,
      deletedCompany: {
        id: companyData.id,
        company_name: companyData.company_name,
      },
    };
  } catch (error) {
    console.error('Error deleting company:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
