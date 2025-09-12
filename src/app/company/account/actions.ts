'use server';

import { revalidateCompanyPaths } from '@/lib/server/actions/revalidate';
import { requireCompanyAuthForAction } from '@/lib/auth/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { getBaseUrl } from '@/lib/server/utils/url';
import {
  getFromAddress,
  isSendgridConfigured,
  sendBatch,
} from '@/lib/server/mail/sendgrid';
import { ok, fail } from '@/lib/server/actions/response';
import { toDbPermission } from '@/lib/company/permissions';

interface CreateGroupPayload {
  groupName: string;
  members: { email: string; role: 'admin' | 'member' | 'viewer' }[];
}

export async function createGroupAndInvite(payload: CreateGroupPayload) {
  try {
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      return fail(authResult.error || 'Unauthorized');
    }

    const { companyAccountId } = authResult.data;
    const supabase = getSupabaseAdminClient();

    // 1) グループ作成
    const { data: newGroup, error: groupError } = await supabase
      .from('company_groups')
      .insert({
        company_account_id: companyAccountId,
        group_name: payload.groupName.trim(),
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
    for (const member of payload.members) {
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
        // 認証ユーザー作成（パスワード未設定）
        const { data: authCreated, error: authErr } =
          await supabase.auth.admin.createUser({
            email,
            email_confirm: false,
            user_metadata: {
              user_type: 'company_user',
              company_account_id: companyAccountId,
            },
          });
        if (authErr || !authCreated.user) {
          // 次のメンバーへ
          continue;
        }

        // company_users レコード作成（password_hash必須のためダミー）
        const { data: newUser, error: cuErr } = await supabase
          .from('company_users')
          .insert({
            company_account_id: companyAccountId,
            email,
            password_hash: 'invited_without_password',
            full_name: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            auth_user_id: authCreated.user.id,
          })
          .select('id')
          .single();
        if (cuErr || !newUser) continue;
        companyUserId = newUser.id;
      }

      // 権限付与（viewerはSCOUT_STAFFにマップ）
      const permission = toDbPermission(
        member.role === 'member' ? 'scout' : (member.role as any)
      );
      const { error: permErr } = await supabase
        .from('company_user_group_permissions')
        .upsert({
          company_user_id: companyUserId!,
          company_group_id: newGroup.id,
          permission_level: permission,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      if (permErr) continue;

      invited.push({ email, role: member.role });
    }

    // 3) SendGrid 招待メール送信
    if (isSendgridConfigured()) {
      const from = getFromAddress() as string;
      const baseUrl = getBaseUrl();
      const setPasswordUrl = `${baseUrl}/signup/set-password`;

      const messages = invited.map(m => ({
        to: m.email,
        from,
        subject: `${payload.groupName} への招待`,
        text: `mokin recruit に招待されました。以下のリンクからパスワードを設定してログインしてください。\n${setPasswordUrl}`,
        html: `mokin recruit に招待されました。<br/>以下のリンクからパスワードを設定してログインしてください。<br/><a href="${setPasswordUrl}">${setPasswordUrl}</a>`,
      }));

      await sendBatch(messages);
    }

    revalidateCompanyPaths('/company/account');
    return ok({ groupId: newGroup.id, invited });
  } catch (e) {
    console.error(e);
    return fail('Internal Server Error');
  }
}

export async function removeGroupMember(
  groupId: string,
  companyUserId: string
) {
  try {
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      return fail(authResult.error || 'Unauthorized');
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from('company_user_group_permissions')
      .delete()
      .eq('company_group_id', groupId)
      .eq('company_user_id', companyUserId);

    if (error) {
      return fail(error.message);
    }

    revalidateCompanyPaths('/company/account');
    return ok();
  } catch (e) {
    console.error(e);
    return fail('Internal Server Error');
  }
}

export async function updateMemberPermission(
  groupId: string,
  companyUserId: string,
  newRole: 'admin' | 'scout' | 'recruiter'
) {
  try {
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      return fail(authResult.error || 'Unauthorized');
    }

    // UIロール → DB permission_level 変換
    // admin → ADMINISTRATOR, scout/recruiter → SCOUT_STAFF（現行スキーマでは2値のため）
    const permissionLevel = toDbPermission(newRole);

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from('company_user_group_permissions')
      .update({
        permission_level: permissionLevel,
        updated_at: new Date().toISOString(),
      })
      .eq('company_group_id', groupId)
      .eq('company_user_id', companyUserId);

    if (error) {
      return fail(error.message);
    }

    revalidateCompanyPaths('/company/account');
    return ok();
  } catch (e) {
    console.error(e);
    return fail('Internal Server Error');
  }
}

export async function updateGroupName(groupId: string, newGroupName: string) {
  try {
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      return fail(authResult.error || 'Unauthorized');
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from('company_groups')
      .update({
        group_name: newGroupName.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', groupId);

    if (error) {
      return fail(error.message);
    }

    revalidateCompanyPaths('/company/account');
    return ok();
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
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      return fail(authResult.error || 'Unauthorized');
    }

    const { companyAccountId } = authResult.data;
    const supabase = getSupabaseAdminClient();

    // グループが自社のものか検証＆名称取得
    const { data: groupRow, error: groupErr } = await supabase
      .from('company_groups')
      .select('id, group_name, company_account_id')
      .eq('id', groupId)
      .single();
    if (
      groupErr ||
      !groupRow ||
      groupRow.company_account_id !== companyAccountId
    ) {
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
        // Supabase Authユーザー作成（メール確認はしない／パスワード未設定）
        const { data: authCreated } = await supabase.auth.admin.createUser({
          email,
          email_confirm: false,
          user_metadata: {
            user_type: 'company_user',
            company_account_id: companyAccountId,
          },
        });
        if (!authCreated?.user) continue;

        // company_users作成（password_hashはダミー）
        const { data: newUser, error: cuErr } = await supabase
          .from('company_users')
          .insert({
            company_account_id: companyAccountId,
            email,
            password_hash: 'invited_without_password',
            full_name: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            auth_user_id: authCreated.user.id,
          })
          .select('id')
          .single();
        if (cuErr || !newUser) continue;
        companyUserId = newUser.id;
      }

      // 権限付与（admin→ADMINISTRATOR、scout/recruiter→SCOUT_STAFF）
      const permissionLevel = toDbPermission(member.role);
      const { error: permErr } = await supabase
        .from('company_user_group_permissions')
        .upsert({
          company_user_id: companyUserId!,
          company_group_id: groupId,
          permission_level: permissionLevel,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      if (permErr) continue;

      invited.push({ email, role: member.role });
    }

    // SendGrid通知
    if (isSendgridConfigured()) {
      const from = getFromAddress() as string;
      const baseUrl = getBaseUrl();
      const setPasswordUrl = `${baseUrl}/signup/set-password`;

      const messages = invited.map(m => ({
        to: m.email,
        from,
        subject: `${groupRow.group_name} への招待`,
        text: `mokin recruit に招待されました。以下のリンクからパスワードを設定してログインしてください。\n${setPasswordUrl}`,
        html: `mokin recruit に招待されました。<br/>以下のリンクからパスワードを設定してログインしてください。<br/><a href="${setPasswordUrl}">${setPasswordUrl}</a>`,
      }));

      await sendBatch(messages);
    }

    revalidateCompanyPaths('/company/account');
    return ok({ invitedCount: invited.length });
  } catch (e) {
    console.error(e);
    return fail('Internal Server Error');
  }
}
