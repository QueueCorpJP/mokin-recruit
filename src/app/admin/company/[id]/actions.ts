'use server';

import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

// プラン変更のバリデーションスキーマ
const PlanChangeSchema = z.object({
  plan: z.enum(['basic', 'standard'], {
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
    // Step 1: Validate input data
    const validation = PlanChangeSchema.safeParse({ plan: newPlan });
    if (!validation.success) {
      return {
        success: false,
        error:
          validation.error?.issues?.[0]?.message || 'プランが正しくありません',
        validationErrors: validation.error?.issues,
      };
    }

    const supabase = getSupabaseAdminClient();

    // Step 2: Update company plan
    const { data: updatedCompany, error: updateError } = await supabase
      .from('company_accounts')
      .update({
        plan: newPlan,
        updated_at: new Date().toISOString(),
      })
      .eq('id', companyId)
      .select('id, company_name, plan, updated_at')
      .single();

    if (updateError) {
      console.error('Company plan update error:', updateError);
      return {
        success: false,
        error: `プランの更新に失敗しました: ${updateError.message}`,
      };
    }

    console.log('Company plan updated successfully:', updatedCompany);

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
    // Step 1: Validate input data
    if (!newGroupName || newGroupName.trim().length === 0) {
      return {
        success: false,
        error: 'グループ名を入力してください',
      };
    }

    if (newGroupName.length > 100) {
      return {
        success: false,
        error: 'グループ名は100文字以内で入力してください',
      };
    }

    const supabase = getSupabaseAdminClient();

    // Step 2: Get current group information
    const { data: currentGroup, error: fetchError } = await supabase
      .from('company_groups')
      .select('id, group_name, company_account_id')
      .eq('id', groupId)
      .single();

    if (fetchError) {
      console.error('Group fetch error:', fetchError);
      return {
        success: false,
        error: `グループ情報の取得に失敗しました: ${fetchError.message}`,
      };
    }

    // Step 3: Update group name
    const { data: updatedGroup, error: updateError } = await supabase
      .from('company_groups')
      .update({
        group_name: newGroupName.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', groupId)
      .select('id, group_name, updated_at')
      .single();

    if (updateError) {
      console.error('Group name update error:', updateError);
      return {
        success: false,
        error: `グループ名の更新に失敗しました: ${updateError.message}`,
      };
    }

    console.log(
      `[Group Name Update] Successfully updated group: ${currentGroup.group_name} → ${updatedGroup.group_name} (ID: ${groupId})`
    );

    // Step 4: Return success without revalidatePath - will be handled by client
    // revalidatePath will be called when modal is closed to prevent modal from disappearing

    return {
      success: true,
      updatedGroup: updatedGroup,
      companyAccountId: currentGroup.company_account_id,
    };
  } catch (error) {
    console.error('Error updating group name:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function createNewGroup(
  companyId: string,
  groupName: string,
  members: Array<{ email: string; role: string }>
) {
  try {
    const supabase = getSupabaseAdminClient();

    console.log(
      `[Group Creation] Creating new group: ${groupName} for company: ${companyId}`
    );
    console.log(`[Group Creation] Members to invite:`, members);

    // Step 1: Create new group
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

    if (groupError) {
      console.error('Group creation error:', groupError);
      return {
        success: false,
        error: `グループの作成に失敗しました: ${groupError.message}`,
      };
    }

    console.log(
      `[Group Creation] Successfully created group: ${newGroup.group_name} (ID: ${newGroup.id})`
    );

    const invitedMembers: Array<{
      email: string;
      role: string;
      status: string;
    }> = [];

    // Step 2: Process each member invitation
    for (const member of members) {
      try {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('company_users')
          .select('id, email')
          .eq('email', member.email)
          .single();

        let userId: string;

        if (existingUser) {
          // User already exists
          userId = existingUser.id;
          console.log(`[Group Creation] User already exists: ${member.email}`);
        } else {
          // Create new user account
          const tempPassword = crypto.randomBytes(12).toString('hex'); // Generate temporary password

          const { data: newUser, error: createUserError } = await supabase
            .from('company_users')
            .insert({
              email: member.email,
              password_hash: tempPassword, // In real implementation, this should be hashed
              full_name: '', // Will be filled during registration
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select('id')
            .single();

          if (createUserError) {
            console.error(
              `Failed to create user ${member.email}:`,
              createUserError
            );
            continue; // Skip this member and continue with others
          }

          userId = newUser.id;
          console.log(
            `[Group Creation] Created new user: ${member.email} (ID: ${userId})`
          );
        }

        // Step 3: Add user to group with specified role
        const { error: permissionError } = await supabase
          .from('company_user_group_permissions')
          .upsert({
            company_user_id: userId,
            company_group_id: newGroup.id,
            permission_level:
              member.role === 'admin' ? 'ADMINISTRATOR' : 'SCOUT_STAFF',
          });

        if (permissionError) {
          console.error(
            'Failed to add permissions for %s:',
            member.email,
            permissionError
          );
          continue; // Skip this member and continue with others
        }

        // Step 4: Send invitation email (simulated)
        console.log(
          `[Group Creation] Sending invitation email to: ${member.email}`
        );
        console.log(`[Group Creation] Email content:
          Subject: ${groupName}グループへの招待
          Body: ${groupName}グループへの招待が届いています。
                メールアドレス: ${member.email}
                権限: ${member.role === 'admin' ? '管理者' : 'スカウト担当者'}
                登録URL: http://localhost:3000/auth/register?token=invitation_token
        `);

        invitedMembers.push({
          email: member.email,
          role: member.role,
          status: 'invited',
        });
      } catch (error) {
        console.error('Error processing member %s:', member.email, error);
        continue; // Skip this member and continue with others
      }
    }

    console.log(
      `[Group Creation] Successfully processed ${invitedMembers.length} members`
    );

    // Step 5: Revalidate the company detail page
    revalidatePath(`/admin/company/${companyId}`);

    return {
      success: true,
      group: newGroup,
      invitedMembers,
      message: `グループ「${groupName}」を作成し、${invitedMembers.length}人のメンバーを招待しました`,
    };
  } catch (error) {
    console.error('Error creating new group:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function inviteMembersToGroup(
  groupId: string,
  members: Array<{ email: string; role: string }>
) {
  try {
    const supabase = getSupabaseAdminClient();

    console.log(
      `[Member Invitation] Starting invitation for group: ${groupId}`
    );
    console.log(`[Member Invitation] Members to invite:`, members);

    // Step 1: Get group and company information
    const { data: groupData, error: groupError } = await supabase
      .from('company_groups')
      .select(
        'id, group_name, company_account_id, company_accounts(id, company_name)'
      )
      .eq('id', groupId)
      .single();

    if (groupError) {
      console.error('Group fetch error:', groupError);
      return {
        success: false,
        error: `グループ情報の取得に失敗しました: ${groupError.message}`,
      };
    }

    const companyData = Array.isArray(groupData.company_accounts)
      ? groupData.company_accounts[0]
      : groupData.company_accounts;

    if (!companyData) {
      return {
        success: false,
        error: '企業情報の取得に失敗しました',
      };
    }

    const invitedMembers: Array<{
      email: string;
      role: string;
      status: string;
    }> = [];

    // Step 2: Process each member invitation
    for (const member of members) {
      try {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('company_users')
          .select('id, email')
          .eq('email', member.email)
          .single();

        let userId: string;

        if (existingUser) {
          // User already exists
          userId = existingUser.id;
          console.log(
            `[Member Invitation] User already exists: ${member.email}`
          );
        } else {
          // Create new user account
          const tempPassword = crypto
            .randomBytes(9)
            .toString('base64')
            .slice(0, 12); // Generate temporary password

          const { data: newUser, error: createUserError } = await supabase
            .from('company_users')
            .insert({
              email: member.email,
              password_hash: tempPassword, // In real implementation, this should be hashed
              full_name: '', // Will be filled during registration
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select('id')
            .single();

          if (createUserError) {
            console.error(
              'Failed to create user %s:',
              member.email,
              createUserError
            );
            continue; // Skip this member and continue with others
          }

          userId = newUser.id;
          console.log(
            `[Member Invitation] Created new user: ${member.email} (ID: ${userId})`
          );
        }

        // Step 3: Add user to group with specified role
        const { error: permissionError } = await supabase
          .from('company_user_group_permissions')
          .upsert({
            company_user_id: userId,
            company_group_id: groupId,
            permission_level:
              member.role === 'admin' ? 'ADMINISTRATOR' : 'SCOUT_STAFF',
          });

        if (permissionError) {
          console.error(
            `Failed to add permissions for ${member.email}:`,
            permissionError
          );
          continue; // Skip this member and continue with others
        }

        // Step 4: Send invitation email (simulated)
        // In a real implementation, you would use an email service like SendGrid, AWS SES, etc.
        console.log(
          `[Member Invitation] Sending invitation email to: ${member.email}`
        );
        console.log(`[Member Invitation] Email content:
          Subject: ${companyData.company_name} - グループ招待
          Body: ${groupData.group_name}グループへの招待が届いています。
                メールアドレス: ${member.email}
                権限: ${member.role === 'admin' ? '管理者' : 'スカウト担当者'}
                登録URL: http://localhost:3000/auth/register?token=invitation_token
        `);

        invitedMembers.push({
          email: member.email,
          role: member.role,
          status: 'invited',
        });
      } catch (error) {
        console.error(`Error processing member ${member.email}:`, error);
        continue; // Skip this member and continue with others
      }
    }

    console.log(
      `[Member Invitation] Successfully processed ${invitedMembers.length} members`
    );

    // Step 5: Revalidate the company detail page
    revalidatePath(`/admin/company/${groupData.company_account_id}`);

    return {
      success: true,
      invitedMembers,
      groupData: {
        id: groupData.id,
        group_name: groupData.group_name,
        company_name: companyData.company_name,
      },
    };
  } catch (error) {
    console.error('Error inviting members to group:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function deleteGroup(groupId: string) {
  try {
    // Step 1: Get group information before deletion
    const supabase = getSupabaseAdminClient();

    const { data: groupData, error: fetchError } = await supabase
      .from('company_groups')
      .select('id, group_name, company_account_id')
      .eq('id', groupId)
      .single();

    if (fetchError) {
      console.error('Group fetch error before deletion:', fetchError);
      return {
        success: false,
        error: `グループ情報の取得に失敗しました: ${fetchError.message}`,
      };
    }

    // Step 2: Delete related data first (company_user_group_permissions, applications, etc.)
    // Delete company user group permissions
    const { error: permissionsError } = await supabase
      .from('company_user_group_permissions')
      .delete()
      .eq('company_group_id', groupId);

    if (permissionsError) {
      console.error('Group permissions deletion error:', permissionsError);
      // Continue with group deletion even if permissions deletion fails
    }

    // Delete applications related to this group
    const { error: applicationsError } = await supabase
      .from('application')
      .delete()
      .eq('company_group_id', groupId);

    if (applicationsError) {
      console.error('Applications deletion error:', applicationsError);
      // Continue with group deletion even if applications deletion fails
    }

    // Delete job postings related to this group
    const { error: jobPostingsError } = await supabase
      .from('job_postings')
      .delete()
      .eq('company_group_id', groupId);

    if (jobPostingsError) {
      console.error('Job postings deletion error:', jobPostingsError);
      // Continue with group deletion even if job postings deletion fails
    }

    // Step 3: Delete the group
    const { error: deleteError } = await supabase
      .from('company_groups')
      .delete()
      .eq('id', groupId);

    if (deleteError) {
      console.error('Group deletion error:', deleteError);
      return {
        success: false,
        error: `グループの削除に失敗しました: ${deleteError.message}`,
      };
    }

    console.log(
      `[Group Deletion] Successfully deleted group: ${groupData.group_name} (ID: ${groupId})`
    );

    // Step 4: Revalidate the company detail page
    revalidatePath(`/admin/company/${groupData.company_account_id}`);

    return {
      success: true,
      deletedGroup: {
        id: groupData.id,
        group_name: groupData.group_name,
        company_account_id: groupData.company_account_id,
      },
    };
  } catch (error) {
    console.error('Error deleting group:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
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
