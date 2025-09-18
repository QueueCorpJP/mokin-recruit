'use server';

import { revalidateCompanyPaths } from '@/lib/server/actions/revalidate';
import { requireCompanyAuthForAction } from '@/lib/auth/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { getBaseUrl } from '@/lib/server/utils/url';
import {
  getFromAddress,
  isSendgridConfigured,
  sendBatch,
} from '@/lib/email/sender';
import { ok, fail } from '@/lib/server/actions/response';
import { toDbPermission } from '@/lib/company/permissions';

interface CreateGroupPayload {
  groupName: string;
  members: { email: string; role: 'admin' | 'scout' | 'recruiter' }[];
}

export async function createGroupAndInvite(payload: CreateGroupPayload) {
  try {
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      return fail((authResult as any).error || '認証が必要です');
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
        // 認証ユーザー作成（パスワード未設定）。失敗してもDBレコードは作成して進める
        let authUserId: string | undefined = undefined;
        try {
          const { data: authCreated, error: authErr } =
            await supabase.auth.admin.createUser({
              email,
              email_confirm: false,
              user_metadata: {
                user_type: 'company_user',
                company_account_id: companyAccountId,
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
            company_account_id: companyAccountId,
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

      // 権限付与（viewerはSCOUT_STAFFにマップ）
      const permission = toDbPermission(member.role);
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
    if (await isSendgridConfigured()) {
      const from = (await getFromAddress()) as string;
      const baseUrl = getBaseUrl();
      const baseGroupJoinUrl = `${baseUrl}/signup/group?groupId=${newGroup.id}&companyId=${companyAccountId}`;

      // 企業名取得
      let companyName = '企業名';
      try {
        const { data: companyRow } = await supabase
          .from('company_accounts')
          .select('company_name')
          .eq('id', companyAccountId)
          .single();
        if (companyRow?.company_name) companyName = companyRow.company_name;
      } catch {}

      const messages = invited.map(m => {
        const groupJoinUrl = `${baseGroupJoinUrl}&email=${encodeURIComponent(m.email)}`;
        return {
          to: m.email,
          from,
          subject: `【CuePoint】 ${payload.groupName}に招待されています`,
          text: `【${companyName}】ご担当者様\n\nCuePointへの招待が届いています。\n招待リンクから企業グループに参加してください。\n\n=============================\n■ 企業名：${companyName}\n■ 企業グループ名：${payload.groupName}\n■ 招待リンク：${groupJoinUrl}\n=============================\n\nCuePoint\nhttps://cuepoint.jp/\n\n【お問い合わせ先】\n（メールアドレスが入ります）\n\n運営会社：メルセネール株式会社\n東京都千代田区神田須田町１丁目32番地 クレス不動産神田ビル`,
          html: `
          <div style="font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif; line-height: 1.8; color: #323232;">
            <p>【${companyName}】ご担当者様</p>
            <p>CuePointへの招待が届いています。<br/>招待リンクから企業グループに参加してください。</p>
            <p>=============================</p>
            <p>■ 企業名：${companyName}<br/>■ 企業グループ名：${payload.groupName}<br/>■ 招待リンク：<a href="${groupJoinUrl}" target="_blank" rel="noopener noreferrer">${groupJoinUrl}</a></p>
            <p>=============================</p>
            <p>CuePoint<br/><a href="https://cuepoint.jp/" target="_blank" rel="noopener noreferrer">https://cuepoint.jp/</a></p>
            <p>【お問い合わせ先】<br/>（メールアドレスが入ります）</p>
            <p>運営会社：メルセネール株式会社<br/>東京都千代田区神田須田町１丁目32番地 クレス不動産神田ビル</p>
          </div>
        `,
        };
      });

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
      return fail((authResult as any).error || '認証が必要です');
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

    // メール通知（企業グループから削除）
    if (await isSendgridConfigured()) {
      // 対象ユーザー、グループ名、企業名を取得
      const [{ data: userRow }, { data: groupRow }] = await Promise.all([
        supabase
          .from('company_users')
          .select('email, full_name, company_account_id')
          .eq('id', companyUserId)
          .maybeSingle(),
        supabase
          .from('company_groups')
          .select('id, group_name, company_account_id')
          .eq('id', groupId)
          .maybeSingle(),
      ]);

      let companyName = '企業名';
      const targetCompanyAccountId =
        groupRow?.company_account_id || userRow?.company_account_id;
      if (targetCompanyAccountId) {
        try {
          const { data: companyRow } = await supabase
            .from('company_accounts')
            .select('company_name')
            .eq('id', targetCompanyAccountId)
            .maybeSingle();
          if (companyRow?.company_name) companyName = companyRow.company_name;
        } catch {}
      }

      const to = userRow?.email;
      const companyUserName = userRow?.full_name || '';
      const groupName = groupRow?.group_name || '';

      if (to) {
        const from = (await getFromAddress()) as string;
        const subject =
          '【CuePoint】企業グループからアカウントが削除されました';

        const textBody = `【${companyName}】【${companyUserName}】様\n\n所属していた企業グループから、アカウントが削除されました。\n\n＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝\n■ 企業名：${companyName}\n■ 企業グループ名：${groupName}\n＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝\n\n=============================\n\nCuePoint\nhttps://cuepoint.jp/\n\n【お問い合わせ先】\n（メールアドレスが入ります）\n\n運営会社：メルセネール株式会社\n東京都千代田区神田須田町１丁目32番地 クレス不動産神田ビル`;

        const htmlBody = `
          <div style="font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif; line-height: 1.8; color: #323232;">
            <p>【${companyName}】【${companyUserName}】様</p>
            <p>所属していた企業グループから、アカウントが削除されました。</p>
            <p>＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝</p>
            <p>■ 企業名：${companyName}<br/>■ 企業グループ名：${groupName}</p>
            <p>＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝</p>
            <p>=============================</p>
            <p>CuePoint<br/><a href="https://cuepoint.jp/" target="_blank" rel="noopener noreferrer">https://cuepoint.jp/</a></p>
            <p>【お問い合わせ先】<br/>（メールアドレスが入ります）</p>
            <p>運営会社：メルセネール株式会社<br/>東京都千代田区神田須田町１丁目32番地 クレス不動産神田ビル</p>
          </div>
        `;

        await sendBatch([
          { to, from, subject, text: textBody, html: htmlBody },
        ]);
      }
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
      return fail((authResult as any).error || '認証が必要です');
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

    // 権限変更通知メール送信（指定フォーマット）
    if (await isSendgridConfigured()) {
      // 表示用ロール名マッピング
      const roleLabel =
        newRole === 'admin'
          ? '管理者'
          : newRole === 'scout'
            ? 'スカウト'
            : 'リクルーター';

      // 対象ユーザー、グループ、企業名を取得
      const [{ data: userRow }, { data: groupRow }] = await Promise.all([
        supabase
          .from('company_users')
          .select('email, full_name, company_account_id')
          .eq('id', companyUserId)
          .single(),
        supabase
          .from('company_groups')
          .select('id, group_name, company_account_id')
          .eq('id', groupId)
          .single(),
      ]);

      let companyName = '企業名';
      const targetCompanyAccountId =
        groupRow?.company_account_id || userRow?.company_account_id;
      if (targetCompanyAccountId) {
        try {
          const { data: companyRow } = await supabase
            .from('company_accounts')
            .select('company_name')
            .eq('id', targetCompanyAccountId)
            .single();
          if (companyRow?.company_name) companyName = companyRow.company_name;
        } catch {}
      }

      const companyUserName = userRow?.full_name || '';
      const to = userRow?.email;
      const groupName = groupRow?.group_name || '';

      if (to) {
        const from = (await getFromAddress()) as string;

        const textBody = `【${companyName}】【${companyUserName}】様\n\n所属企業グループ内での権限が変更されました。\n\n＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝\n■ 企業名：${companyName}\n■ 企業グループ名：${groupName}\n■ 変更後の権限：${roleLabel}\n＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝\n\n権限に応じて、閲覧・編集可能な範囲が変更となりますのでご確認ください。\n\n=============================\n\nCuePoint\nhttps://cuepoint.jp/\n\n【お問い合わせ先】\n（メールアドレスが入ります）\n\n運営会社：メルセネール株式会社\n東京都千代田区神田須田町１丁目32番地 クレス不動産神田ビル`;

        const htmlBody = `
          <div style="font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif; line-height: 1.8; color: #323232;">
            <p>【${companyName}】【${companyUserName}】様</p>
            <p>所属企業グループ内での権限が変更されました。</p>
            <p>＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝</p>
            <p>■ 企業名：${companyName}<br/>■ 企業グループ名：${groupName}<br/>■ 変更後の権限：${roleLabel}</p>
            <p>＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝</p>
            <p>権限に応じて、閲覧・編集可能な範囲が変更となりますのでご確認ください。</p>
            <p>=============================</p>
            <p>CuePoint<br/><a href="https://cuepoint.jp/" target="_blank" rel="noopener noreferrer">https://cuepoint.jp/</a></p>
            <p>【お問い合わせ先】<br/>（メールアドレスが入ります）</p>
            <p>運営会社：メルセネール株式会社<br/>東京都千代田区神田須田町１丁目32番地 クレス不動産神田ビル</p>
          </div>
        `;

        await sendBatch([
          {
            to,
            from,
            subject: '【CuePoint】企業グループ内での権限が変更されました',
            text: textBody,
            html: htmlBody,
          },
        ]);
      }
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
      return fail((authResult as any).error || '認証が必要です');
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
      return fail((authResult as any).error || '認証が必要です');
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
        // Supabase Authユーザー作成（メール確認はしない／パスワード未設定）。失敗してもDBレコードは作成
        let authUserId: string | undefined = undefined;
        try {
          const { data: authCreated } = await supabase.auth.admin.createUser({
            email,
            email_confirm: false,
            user_metadata: {
              user_type: 'company_user',
              company_account_id: companyAccountId,
            },
          });
          if (authCreated?.user?.id) authUserId = authCreated.user.id;
        } catch {}

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
            ...(authUserId ? { auth_user_id: authUserId } : {}),
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
    if (await isSendgridConfigured()) {
      const from = (await getFromAddress()) as string;
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

      const messages = invited.map(m => ({
        to: m.email,
        from,
        subject: `【CuePoint】 ${groupRow.group_name}に招待されています`,
        text: `【${companyName}】ご担当者様\n\nCuePointへの招待が届いています。\n招待リンクから企業グループに参加してください。\n\n=============================\n■ 企業名：${companyName}\n■ 企業グループ名：${groupRow.group_name}\n■ 招待リンク：${groupJoinUrl}\n=============================\n\nCuePoint\nhttps://cuepoint.jp/\n\n【お問い合わせ先】\n（メールアドレスが入ります）\n\n運営会社：メルセネール株式会社\n東京都千代田区神田須田町１丁目32番地 クレス不動産神田ビル`,
        html: `
          <div style="font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif; line-height: 1.8; color: #323232;">
            <p>【${companyName}】ご担当者様</p>
            <p>CuePointへの招待が届いています。<br/>招待リンクから企業グループに参加してください。</p>
            <p>=============================</p>
            <p>■ 企業名：${companyName}<br/>■ 企業グループ名：${groupRow.group_name}<br/>■ 招待リンク：<a href="${groupJoinUrl}" target="_blank" rel="noopener noreferrer">${groupJoinUrl}</a></p>
            <p>=============================</p>
            <p>CuePoint<br/><a href="https://cuepoint.jp/" target="_blank" rel="noopener noreferrer">https://cuepoint.jp/</a></p>
            <p>【お問い合わせ先】<br/>（メールアドレスが入ります）</p>
            <p>運営会社：メルセネール株式会社<br/>東京都千代田区神田須田町１丁目32番地 クレス不動産神田ビル</p>
          </div>
        `,
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
