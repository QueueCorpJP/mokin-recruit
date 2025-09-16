'use server';

import { createClient } from '@/lib/supabase/server';
import { requireCompanyAuthForAction } from '@/lib/auth/server';
import { revalidateCompanyPaths } from '@/lib/server/actions/revalidate';

export interface ScoutSendFormData {
  group: string;
  recruitmentTarget: string;
  scoutSenderName: string;
  candidateId: string;
  scoutTemplate: string;
  title: string;
  message: string;
  searchQuery?: string;
}

export interface ScoutSendResult {
  success: boolean;
  scoutSendId?: string;
  roomId?: string;
  error?: string;
}

// 表示用: 候補者名を取得
export async function getCandidateName(candidateId: string): Promise<string> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('candidates')
      .select('first_name, last_name')
      .eq('id', candidateId)
      .maybeSingle();
    if (error || !data) return '';
    const fullName = `${data.last_name || ''} ${data.first_name || ''}`.trim();
    return fullName;
  } catch {
    return '';
  }
}

export async function sendScout(
  formData: ScoutSendFormData
): Promise<ScoutSendResult> {
  const supabase = await createClient();

  try {
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      console.error('スカウト送信の認証エラー:', authResult.error);
      return { success: false, error: authResult.error };
    }

    const companyUser = authResult.data;

    // スカウトチケット残数をチェック（送信前）
    const remainingTickets = await getScoutTicketsRemaining();
    if (remainingTickets <= 0) {
      console.warn('スカウト送信制限に達しています');
      return {
        success: false,
        error:
          'スカウト送信制限に達しています。チケットを追加購入してください。',
      };
    }

    // 候補者情報を取得
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('id, email, first_name, last_name')
      .eq('id', formData.candidateId)
      .single();

    if (candidateError || !candidate) {
      console.error('候補者情報の取得エラー:', candidateError);
      return { success: false, error: '候補者情報が見つかりませんでした' };
    }

    // 候補者のスカウト設定を確認
    const { data: scoutSettings, error: settingsError } = await supabase
      .from('scout_settings')
      .select('scout_status')
      .eq('candidate_id', formData.candidateId)
      .maybeSingle();

    // エラーが発生した場合や、明示的にスカウト拒否設定の場合はスカウト送信を拒否
    if (settingsError) {
      console.error('スカウト設定の確認エラー:', settingsError);
    }

    if (scoutSettings && scoutSettings.scout_status === 'not-receive') {
      return {
        success: false,
        error: 'この候補者はスカウトの受信を拒否しています',
      };
    }

    // グループ情報を取得
    const { data: group, error: groupError } = await supabase
      .from('company_groups')
      .select('id, group_name, company_account_id')
      .eq('id', formData.group)
      .single();

    if (groupError || !group) {
      console.error('グループ情報の取得エラー:', groupError);
      return { success: false, error: 'グループ情報が見つかりませんでした' };
    }

    // 求人情報を取得（オプション）
    let jobPosting = null;
    if (formData.recruitmentTarget) {
      const { data: job, error: jobError } = await supabase
        .from('job_postings')
        .select('id, title')
        .eq('id', formData.recruitmentTarget)
        .single();

      if (!jobError && job) {
        jobPosting = job;
      }
    }

    // テンプレート情報を取得（オプション）
    let templateId = null;
    if (formData.scoutTemplate) {
      const { data: template, error: templateError } = await supabase
        .from('search_templates')
        .select('id')
        .eq('id', formData.scoutTemplate)
        .single();

      if (!templateError && template) {
        templateId = template.id;
      }
    }

    // スカウト送信データを保存
    const scoutSendData = {
      company_account_id: group.company_account_id,
      company_group_id: formData.group,
      sender_company_user_id: companyUser.companyUserId,
      sender_name: formData.scoutSenderName,
      candidate_id: formData.candidateId,
      candidate_email: candidate.email,
      candidate_name: `${candidate.last_name || ''} ${
        candidate.first_name || ''
      }`.trim(),
      job_posting_id: jobPosting?.id || null,
      job_title: jobPosting?.title || null,
      subject: formData.title,
      message_content: formData.message,
      template_id: templateId,
      status: 'sent',
      search_query: formData.searchQuery
        ? JSON.parse(formData.searchQuery)
        : null,
      query_source: formData.searchQuery ? 'search' : 'direct',
      sent_at: new Date().toISOString(),
    };

    const { data: scoutSend, error: insertError } = await supabase
      .from('scout_sends')
      .insert(scoutSendData)
      .select('id')
      .single();

    if (insertError) {
      console.error('スカウト送信データの保存エラー:', insertError);
      return {
        success: false,
        error: 'スカウト送信データの保存に失敗しました',
      };
    }

    // Roomを作成または取得
    console.info('=== Room作成フロー開始 ===');
    console.info('Room検索条件:', {
      candidate_id: formData.candidateId,
      company_group_id: formData.group,
      type: 'direct',
    });

    let roomId = null;
    const { data: existingRoom, error: roomSearchError } = await supabase
      .from('rooms')
      .select('id')
      .eq('candidate_id', formData.candidateId)
      .eq('company_group_id', formData.group)
      .eq('type', 'direct')
      .maybeSingle();

    if (roomSearchError) {
      console.error('Room検索エラー:', roomSearchError);
      return { success: false, error: 'メッセージルームの検索に失敗しました' };
    }

    if (existingRoom) {
      roomId = existingRoom.id;
      console.info('既存Room使用:', { roomId });
    } else {
      // 新しいRoomを作成
      console.info('新規Room作成中...');
      const roomData = {
        type: 'direct',
        candidate_id: formData.candidateId,
        company_group_id: formData.group,
        related_job_posting_id: jobPosting?.id || null,
      };
      console.info('Room作成データ:', roomData);

      const { data: newRoom, error: roomInsertError } = await supabase
        .from('rooms')
        .insert(roomData)
        .select('id')
        .single();

      if (roomInsertError) {
        console.error('ルーム作成エラー:', roomInsertError);
        return {
          success: false,
          error: 'メッセージルームの作成に失敗しました',
        };
      }
      roomId = newRoom.id;
      console.info('新規Room作成完了:', { roomId });
    }

    // メッセージを作成
    console.info('=== Message作成フロー開始 ===');
    const messageData = {
      room_id: roomId,
      sender_type: 'COMPANY_USER',
      sender_company_group_id: formData.group,
      message_type: 'SCOUT',
      subject: formData.title,
      content: formData.message,
      status: 'SENT',
      sent_at: new Date().toISOString(),
    };
    console.info('Message作成データ:', messageData);

    const { data: message, error: messageInsertError } = await supabase
      .from('messages')
      .insert(messageData)
      .select('id')
      .single();

    if (messageInsertError) {
      console.error('メッセージ作成エラー:', messageInsertError);
      return {
        success: false,
        error: 'スカウトメッセージの作成に失敗しました',
      };
    }

    console.info('Message作成完了:', { messageId: message.id });

    // 通知テーブルに追加
    console.info('=== Notification作成フロー開始 ===');
    if (message) {
      const notificationData = {
        candidate_id: formData.candidateId,
        message_id: message.id,
        task_type: 'SCOUT',
      };
      console.info('Notification作成データ:', notificationData);

      const { error: notificationError } = await supabase
        .from('unread_notifications')
        .insert(notificationData);

      if (notificationError) {
        console.error('通知作成エラー:', notificationError);
        // 通知作成失敗は警告のみ（メッセージ作成は成功している）
        console.warn(
          'スカウト通知の作成に失敗しましたが、メッセージは正常に作成されました'
        );
      } else {
        console.info('Notification作成完了');
      }
    }

    // スカウト送信が成功したため、チケット消費が完了
    console.info('スカウト送信完了。チケットが1つ消費されました。');

    revalidateCompanyPaths(
      '/company/search/scout',
      '/company/search/scout/complete'
    );

    return { success: true, scoutSendId: scoutSend.id, roomId };
  } catch (error) {
    console.error('スカウト送信処理中のエラー:', error);
    return {
      success: false,
      error: 'スカウト送信処理中にエラーが発生しました',
    };
  }
}

export async function getCompanyGroupOptions() {
  const supabase = await createClient();

  try {
    // 企業ユーザー認証の確認
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      console.error('グループ取得の認証エラー:', authResult.error);
      return [];
    }

    const { companyUserId } = authResult.data;

    // ユーザーがアクセス可能なグループを取得
    const { data: userPermissions, error } = await supabase
      .from('company_user_group_permissions')
      .select(
        `
        company_group:company_groups (
          id,
          group_name
        )
      `
      )
      .eq('company_user_id', companyUserId);

    if (error || !userPermissions) {
      console.error('グループ取得エラー:', error);
      return [];
    }

    // グループデータを整形
    const groups = userPermissions
      .map((perm: any) => perm.company_group)
      .filter((group: any) => group && group.id && group.group_name)
      .map((group: any) => ({
        value: group.id,
        label: group.group_name,
      }));

    return groups;
  } catch (error) {
    console.error('グループオプション取得エラー:', error);
    return [];
  }
}

export async function getJobPostingOptions(groupId: string) {
  const supabase = await createClient();

  try {
    const { data: jobs, error } = await supabase
      .from('job_postings')
      .select('id, title')
      .eq('company_group_id', groupId)
      .eq('status', 'PUBLISHED')
      .order('title');

    if (error) {
      console.error('求人取得エラー:', error);
      return [];
    }

    return jobs.map(job => ({
      value: job.id,
      label: job.title,
    }));
  } catch (error) {
    console.error('求人オプション取得エラー:', error);
    return [];
  }
}

export async function getCompanyUserOptions(groupId: string) {
  const supabase = await createClient();

  try {
    const { data: users, error } = await supabase
      .from('company_user_group_permissions')
      .select(
        `
        company_users (
          id,
          full_name,
          email
        )
      `
      )
      .eq('company_group_id', groupId);

    if (error) {
      console.error('ユーザー取得エラー:', error);
      return [];
    }

    const flattenedUsers = users
      .map(permission => permission.company_users)
      .filter(Boolean)
      .flatMap(user => (Array.isArray(user) ? user : [user]));

    return flattenedUsers.map(user => ({
      value: user.full_name,
      label: user.full_name,
    }));
  } catch (error) {
    console.error('ユーザーオプション取得エラー:', error);
    return [];
  }
}

export async function getScoutTemplateOptions(groupId: string) {
  const supabase = await createClient();

  try {
    const { data: templates, error } = await supabase
      .from('search_templates')
      .select('id, template_name, subject, body')
      .eq('group_id', groupId)
      .order('template_name');

    if (error) {
      console.error('テンプレート取得エラー:', error);
      return [];
    }

    return templates.map(template => ({
      value: template.id,
      label: template.template_name || 'テンプレート名なし',
      subject: template.subject || '',
      body: template.body || '',
    }));
  } catch (error) {
    console.error('テンプレートオプション取得エラー:', error);
    return [];
  }
}

export async function getScoutTicketsRemaining(): Promise<number> {
  const supabase = await createClient();

  try {
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      console.error('チケット残数取得の認証エラー:', authResult.error);
      return 0;
    }

    const { companyAccountId } = authResult.data;

    // 月次上限と今月の使用済みスカウト数を取得
    const { data: accountData, error: accountError } = await supabase
      .from('company_accounts')
      .select('scout_limit')
      .eq('id', companyAccountId)
      .single();

    if (accountError) {
      console.error('アカウントデータ取得エラー:', accountError);
      return 0;
    }

    // 今月のスカウト送信数をカウント
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: scoutSends, error: countError } = await supabase
      .from('scout_sends')
      .select('id', { count: 'exact' })
      .eq('company_account_id', companyAccountId)
      .gte('sent_at', startOfMonth.toISOString());

    if (countError) {
      console.error('スカウト送信数取得エラー:', countError);
      return accountData?.scout_limit || 0; // エラー時は上限をそのまま返す
    }

    const usedThisMonth = scoutSends?.length || 0;
    const remaining = (accountData?.scout_limit || 0) - usedThisMonth;

    return Math.max(0, remaining); // 負数にならないよう調整
  } catch (error) {
    console.error('チケット残数取得エラー:', error);
    return 0;
  }
}
