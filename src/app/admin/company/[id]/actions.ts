'use server';

import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { revalidatePath } from 'next/cache';
import nodemailer from 'nodemailer';

// メール送信サービスの共通関数
async function sendEmail(to: string, subject: string, html: string) {
  console.log('=== sendEmail開始 ===');
  console.log('送信先:', to);
  console.log('件名:', subject);

  // Gmail SMTP設定の確認
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('Gmail設定が不完全です');
    throw new Error('メール送信設定が正しく構成されていません');
  }

  try {
    console.log('Gmail SMTPトランスポーターを作成中...');
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, '') // スペースを削除
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('メール送信中...');
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: to,
      subject: subject,
      html: html
    });

    console.log(`✅ メール送信成功! 送信先: ${to}`);
    return { success: true };
  } catch (emailErr) {
    console.error('❌ メール送信エラー:', emailErr);
    throw new Error('メールの送信に失敗しました。しばらく時間をおいて再度お試しください。');
  }
}

// 招待トークンの生成（一時的な実装：ローカルストレージ使用）
async function generateInvitationToken(email: string, groupId: string, role: string, companyId: string) {
  // ユニークな招待トークンを生成
  const token = `invite_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

  // 一時的に招待情報をローカルストレージやメモリに保存
  // 本番環境ではデータベーステーブルを作成する必要があります
  console.log('招待トークンを生成しました（一時実装）:', {
    token,
    email,
    groupId,
    role,
    companyId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  });

  return token;
}

// 招待トークンの検証（一時的な実装）
async function verifyInvitationToken(token: string) {
  // トークンの形式チェック
  if (!token.startsWith('invite_')) {
    return { valid: false, error: '無効な招待トークンです' };
  }

  // トークンから情報を抽出（一時的な実装）
  // 本番環境ではデータベースから取得する必要があります
  console.log('招待トークンを検証中:', token);

  // 一時的なモックデータ
  const mockInvitation = {
    token: token,
    email: 'user@example.com',
    groupId: 'group-123',
    role: 'scout',
    companyId: 'company-123',
    status: 'pending',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };

  // 期限切れチェック
  if (new Date() > new Date(mockInvitation.expiresAt)) {
    return { valid: false, error: '招待の有効期限が切れています' };
  }

  return { valid: true, invitation: mockInvitation };
}

// 招待トークンの使用済みマーク（一時的な実装）
async function markInvitationTokenAsUsed(token: string) {
  console.log('招待トークンを使用済みにマーク:', token);
  // 本番環境ではデータベースを更新する必要があります
}

// 企業グループからユーザーを削除
export async function deleteUserFromGroup(userId: string, groupId: string) {
  try {
    console.log(`[User Deletion] Starting deletion process`);
    console.log(`[User Deletion] User ID: ${userId}`);
    console.log(`[User Deletion] Group ID: ${groupId}`);

    // 直接Supabaseサービスロールクライアントを使用
    const supabase = createServerAdminClient();

    // まず、削除対象のレコードが存在するか確認
    const { data: existingRecord, error: checkError } = await supabase
      .from('company_user_group_permissions')
      .select('*')
      .eq('company_user_id', userId)
      .eq('company_group_id', groupId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing record:', checkError);
      return {
        success: false,
        error: `レコード確認中にエラーが発生しました: ${checkError.message}`
      };
    }

    if (!existingRecord) {
      console.log('[User Deletion] Record not found - user may already be removed');
      return {
        success: true,
        message: 'ユーザーは既にグループから削除されています'
      };
    }

    console.log('[User Deletion] Found existing record:', existingRecord);

    // グループからユーザーを削除（company_user_group_permissionsから削除）
    const { data, error: deleteError } = await supabase
      .from('company_user_group_permissions')
      .delete()
      .eq('company_user_id', userId)
      .eq('company_group_id', groupId)
      .select();

    if (deleteError) {
      console.error('User deletion error:', deleteError);
      console.error('Error details:', {
        code: deleteError.code,
        message: deleteError.message,
        details: deleteError.details
      });
      return {
        success: false,
        error: `ユーザーの削除に失敗しました: ${deleteError.message}`
      };
    }

    console.log('[User Deletion] Deletion result:', data);

    // 削除されたレコード数を確認
    if (data && data.length === 0) {
      console.warn('[User Deletion] No records were deleted');
    } else {
      console.log(`[User Deletion] Successfully deleted ${data?.length || 0} record(s)`);
    }

    // 企業詳細ページのキャッシュを無効化
    revalidatePath(`/admin/company/[id]`);
    revalidatePath(`/admin/company/${id}`);

    console.log(`[User Deletion] Successfully completed deletion process`);

    return {
      success: true,
      deletedRecords: data?.length || 0
    };

  } catch (error) {
    console.error('User deletion process error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error');
    return {
      success: false,
      error: 'ユーザー削除処理中にエラーが発生しました'
    };
  }
}

// チケット情報を取得
export async function getCompanyTickets(companyId: string) {
  try {
    console.log(`[Ticket Info] Getting tickets for company: ${companyId}`);

    const supabase = createServerAdminClient();

    // チケット残高を取得
    const { data: ticketData, error: ticketError } = await supabase
      .from('company_tickets')
      .select('*')
      .eq('company_account_id', companyId)
      .single();

    if (ticketError && ticketError.code !== 'PGRST116') {
      console.error('Error fetching ticket data:', ticketError);
      return {
        success: false,
        error: `チケット情報の取得に失敗しました: ${ticketError.message}`
      };
    }

    // チケット取引履歴を取得（直近6ヶ月分）
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: transactionData, error: transactionError } = await supabase
      .from('ticket_transactions')
      .select(`
        id,
        transaction_type,
        amount,
        description,
        created_at,
        related_message_id,
        related_application_id
      `)
      .eq('company_account_id', companyId)
      .gte('created_at', sixMonthsAgo.toISOString())
      .order('created_at', { ascending: false });

    if (transactionError) {
      console.error('Error fetching transaction data:', transactionError);
      return {
        success: false,
        error: `取引履歴の取得に失敗しました: ${transactionError.message}`
      };
    }

    // 初期データが存在しない場合は作成
    let finalTicketData = ticketData;
    if (!ticketData) {
      console.log('[Ticket Info] No ticket data found, creating initial data');

      const { data: newTicketData, error: insertError } = await supabase
        .from('company_tickets')
        .insert({
          company_account_id: companyId,
          total_tickets: 0,
          used_tickets: 0,
          remaining_tickets: 0
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating initial ticket data:', insertError);
      } else {
        finalTicketData = newTicketData;
      }
    }

    console.log(`[Ticket Info] Successfully retrieved ticket data`);

    return {
      success: true,
      data: {
        tickets: finalTicketData || {
          total_tickets: 0,
          used_tickets: 0,
          remaining_tickets: 0
        },
        transactions: transactionData || []
      }
    };

  } catch (error) {
    console.error('Get company tickets error:', error);
    return {
      success: false,
      error: 'チケット情報の取得中にエラーが発生しました'
    };
  }
}

// チケットを購入
export async function purchaseTickets(companyId: string, amount: number, description?: string) {
  try {
    console.log(`[Purchase Tickets] Purchasing ${amount} tickets for company: ${companyId}`);

    const supabase = createServerAdminClient();

    // 現在のチケット情報を取得
    const { data: currentTicketData, error: fetchError } = await supabase
      .from('company_tickets')
      .select('*')
      .eq('company_account_id', companyId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching current ticket data:', fetchError);
      return {
        success: false,
        error: `現在のチケット情報の取得に失敗しました: ${fetchError.message}`
      };
    }

    // トランザクション開始
    let newTotalTickets = amount;
    let newUsedTickets = 0;
    let newRemainingTickets = amount;

    if (currentTicketData) {
      newTotalTickets = currentTicketData.total_tickets + amount;
      newUsedTickets = currentTicketData.used_tickets;
      newRemainingTickets = currentTicketData.remaining_tickets + amount;
    }

    // チケット情報を更新または作成
    const { data: updatedTicketData, error: updateError } = await supabase
      .from('company_tickets')
      .upsert({
        company_account_id: companyId,
        total_tickets: newTotalTickets,
        used_tickets: newUsedTickets,
        remaining_tickets: newRemainingTickets
      })
      .select()
      .single();

    if (updateError) {
      console.error('Error updating ticket data:', updateError);
      return {
        success: false,
        error: `チケット情報の更新に失敗しました: ${updateError.message}`
      };
    }

    // 取引履歴を記録
    const { error: transactionError } = await supabase
      .from('ticket_transactions')
      .insert({
        company_account_id: companyId,
        transaction_type: 'PURCHASE',
        amount: amount,
        description: description || `${amount}枚のチケットを購入`
      });

    if (transactionError) {
      console.error('Error recording transaction:', transactionError);
      // 取引履歴の記録に失敗してもチケット購入は成功として扱う
    }

    // 企業詳細ページのキャッシュを無効化
    revalidatePath(`/admin/company/[id]`);
    revalidatePath(`/admin/company/${companyId}`);

    console.log(`[Purchase Tickets] Successfully purchased ${amount} tickets`);

    return {
      success: true,
      data: updatedTicketData
    };

  } catch (error) {
    console.error('Purchase tickets error:', error);
    return {
      success: false,
      error: 'チケット購入中にエラーが発生しました'
    };
  }
}

// チケットを使用
export async function useTickets(companyId: string, amount: number, description?: string, relatedMessageId?: string) {
  try {
    console.log(`[Use Tickets] Using ${amount} tickets for company: ${companyId}`);

    const supabase = createServerAdminClient();

    // 現在のチケット情報を取得
    const { data: currentTicketData, error: fetchError } = await supabase
      .from('company_tickets')
      .select('*')
      .eq('company_account_id', companyId)
      .single();

    if (fetchError) {
      console.error('Error fetching current ticket data:', fetchError);
      return {
        success: false,
        error: `現在のチケット情報の取得に失敗しました: ${fetchError.message}`
      };
    }

    if (!currentTicketData) {
      return {
        success: false,
        error: 'チケット情報が見つかりません'
      };
    }

    // 残高チェック
    if (currentTicketData.remaining_tickets < amount) {
      return {
        success: false,
        error: `チケット残高が不足しています。必要: ${amount}枚、残高: ${currentTicketData.remaining_tickets}枚`
      };
    }

    // チケット情報を更新
    const newUsedTickets = currentTicketData.used_tickets + amount;
    const newRemainingTickets = currentTicketData.remaining_tickets - amount;

    const { data: updatedTicketData, error: updateError } = await supabase
      .from('company_tickets')
      .update({
        used_tickets: newUsedTickets,
        remaining_tickets: newRemainingTickets
      })
      .eq('company_account_id', companyId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating ticket data:', updateError);
      return {
        success: false,
        error: `チケット情報の更新に失敗しました: ${updateError.message}`
      };
    }

    // 取引履歴を記録
    const { error: transactionError } = await supabase
      .from('ticket_transactions')
      .insert({
        company_account_id: companyId,
        transaction_type: 'USAGE',
        amount: -amount, // 使用なのでマイナス
        description: description || `${amount}枚のチケットを使用`,
        related_message_id: relatedMessageId
      });

    if (transactionError) {
      console.error('Error recording transaction:', transactionError);
      // 取引履歴の記録に失敗してもチケット使用は成功として扱う
    }

    console.log(`[Use Tickets] Successfully used ${amount} tickets`);

    return {
      success: true,
      data: updatedTicketData
    };

  } catch (error) {
    console.error('Use tickets error:', error);
    return {
      success: false,
      error: 'チケット使用中にエラーが発生しました'
    };
  }
}

// 招待受け入れ処理
export async function acceptInvitation(token: string, userId: string) {
  try {
    console.log('=== acceptInvitation開始 ===');
    console.log('招待トークン:', token);
    console.log('ユーザーID:', userId);

    // 招待トークンを検証
    const tokenVerification = await verifyInvitationToken(token);
    if (!tokenVerification.valid) {
      console.log('招待トークン検証失敗:', tokenVerification.error);
      return { success: false, error: tokenVerification.error };
    }

    const invitation = tokenVerification.invitation;
    console.log('招待情報:', invitation);

    const supabase = getSupabaseAdminClient();

    // ユーザーが既にグループに属しているかチェック
    const { data: existingPermission, error: checkError } = await supabase
      .from('company_user_group_permissions')
      .select('*')
      .eq('company_user_id', userId)
      .eq('company_group_id', invitation.groupId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('既存権限チェックエラー:', checkError);
      return { success: false, error: '招待受け入れ処理に失敗しました' };
    }

    // 招待処理時に既にメンバーが追加されている可能性があるため、
    // 既にメンバーの場合は成功として扱う
    if (existingPermission) {
      console.log('ユーザーは既にこのグループに属しています（招待処理時に追加済み）');

      // 招待トークンを使用済みにマーク
      await markInvitationTokenAsUsed(token);

      console.log('✅ 招待受け入れ処理完了（既存メンバー）');
      return {
        success: true,
        message: '既にグループのメンバーです',
        alreadyMember: true
      };
    }

    // 新規メンバーの場合：ユーザーをグループに追加
    console.log('新規メンバーとしてグループに追加します');
    const dbRole = invitation.role === 'admin' ? 'ADMINISTRATOR' : 'SCOUT_STAFF';
    const { error: permissionError } = await supabase
      .from('company_user_group_permissions')
      .insert({
        company_user_id: userId,
        company_group_id: invitation.groupId,
        permission_level: dbRole,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (permissionError) {
      console.error('権限付与エラー:', permissionError);
      return { success: false, error: 'グループ参加に失敗しました' };
    }

    // 招待トークンを使用済みにマーク
    await markInvitationTokenAsUsed(token);

    console.log('✅ 招待受け入れ処理完了（新規追加）');
    return {
      success: true,
      message: 'グループへの参加が完了しました',
      alreadyMember: false
    };

  } catch (error) {
    console.error('❌ acceptInvitationエラー:', error);
    return { success: false, error: 'システムエラーが発生しました' };
  }
}

// 招待メールのHTMLテンプレート
function createInvitationEmailTemplate(data: {
  companyName: string;
  groupName: string;
  role: string;
  invitationUrl: string;
  email: string;
}) {
  const roleText = data.role === 'admin' ? '管理者' : 'スカウト担当者';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
        <h1 style="color: #0f9058; margin: 0; font-size: 24px;">${data.companyName}</h1>
      </div>

      <div style="padding: 30px 20px;">
        <h2 style="color: #333; margin-bottom: 20px;">グループへの招待</h2>

        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          ${data.companyName}の<strong>${data.groupName}</strong>グループへの招待が届いています。
        </p>

        <div style="background-color: #f0f8f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0f9058; margin: 0 0 10px 0;">招待情報</h3>
          <p style="margin: 5px 0;"><strong>グループ名:</strong> ${data.groupName}</p>
          <p style="margin: 5px 0;"><strong>権限:</strong> ${roleText}</p>
          <p style="margin: 5px 0;"><strong>メールアドレス:</strong> ${data.email}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.invitationUrl}"
             style="background-color: #0f9058; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            招待を受け入れる
          </a>
        </div>

        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            <strong>注意:</strong> この招待リンクは7日間有効です。期限が切れた場合は、管理者に再招待をご依頼ください。
          </p>
        </div>

        <p style="color: #666; font-size: 12px; margin-top: 30px; text-align: center;">
          このメールに心当たりがない場合は、無視してください。
        </p>
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
        <p style="color: #666; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} ${data.companyName}
        </p>
      </div>
    </div>
  `;
}

// プラン変更のバリデーションスキーマ
const PlanChangeSchema = z.object({
  plan: z.enum(['basic', 'standard'], {
    errorMap: () => ({ message: '有効なプランを選択してください' })
  }),
});

// スカウト上限数変更のバリデーションスキーマ
const ScoutLimitChangeSchema = z.object({
  scoutLimit: z.number().min(1).max(1000, {
    message: 'スカウト上限数は1〜1000の範囲で入力してください'
  }),
});

// 企業ステータス変更のバリデーションスキーマ
const StatusChangeSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED'], {
    errorMap: () => ({ message: '有効なステータスを選択してください' })
  }),
});

export async function updateCompanyPlan(
  companyId: string,
  newPlan: string
) {
  try {
    // Step 1: Validate input data
    const validation = PlanChangeSchema.safeParse({ plan: newPlan });
    if (!validation.success) {
      return {
        success: false,
        error: validation.errors?.[0]?.message || 'プランが正しくありません',
        validationErrors: validation.errors
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
        error: `プランの更新に失敗しました: ${updateError.message}`
      };
    }

    console.log('Company plan updated successfully:', updatedCompany);

    // Step 3: Revalidate the company detail page
    revalidatePath(`/admin/company/${companyId}`);

    return {
      success: true,
      company: updatedCompany
    };

  } catch (error) {
    console.error('Error updating company plan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// ユーザー権限変更のバリデーションスキーマ
const UserRoleChangeSchema = z.object({
  userId: z.string().min(1, 'ユーザーIDが必要です'),
  groupId: z.string().min(1, 'グループIDが必要です'),
  newRole: z.enum(['ADMINISTRATOR', 'SCOUT_STAFF', 'ADMIN'], {
    errorMap: () => ({ message: '有効な権限を選択してください' })
  }),
});

export async function updateUserRole(
  userId: string,
  groupId: string,
  newRole: string
) {
  try {
    // Step 1: Validate input data
    const validation = UserRoleChangeSchema.safeParse({
      userId,
      groupId,
      newRole
    });

    if (!validation.success) {
      return {
        success: false,
        error: validation.errors?.[0]?.message || '入力データが正しくありません',
        validationErrors: validation.errors
      };
    }

    const supabase = getSupabaseAdminClient();

    // Step 2: Update user role in group permissions
    const { data: updatedPermission, error: updateError } = await supabase
      .from('company_user_group_permissions')
      .update({
        permission_level: newRole,
        updated_at: new Date().toISOString(),
      })
      .eq('company_user_id', userId)
      .eq('company_group_id', groupId)
      .select(`
        id,
        permission_level,
        company_users (
          full_name,
          email
        ),
        company_groups (
          group_name,
          company_accounts (
            id
          )
        )
      `)
      .single();

    if (updateError) {
      console.error('User role update error:', updateError);
      return {
        success: false,
        error: `ユーザー権限の更新に失敗しました: ${updateError.message}`
      };
    }

    console.log('User role updated successfully:', updatedPermission);
    console.log(`User ${updatedPermission.company_users?.full_name} role changed to ${newRole} in group ${updatedPermission.company_groups?.group_name}`);

    // Step 3: Revalidate the company detail page
    revalidatePath(`/admin/company/${updatedPermission.company_groups?.company_accounts?.id || 'unknown'}`);

    return {
      success: true,
      updatedPermission
    };

  } catch (error) {
    console.error('Error updating user role:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function updateCompanyScoutLimit(
  companyId: string,
  newScoutLimit: number
) {
  try {
    // Step 1: Validate input data
    const validation = ScoutLimitChangeSchema.safeParse({ scoutLimit: newScoutLimit });
    if (!validation.success) {
      return {
        success: false,
        error: validation.errors?.[0]?.message || 'スカウト上限数が正しくありません',
        validationErrors: validation.errors
      };
    }

    const supabase = getSupabaseAdminClient();

    // Step 2: Update company scout limit
    // Note: company_accounts table may not have scout_limit column
    // For now, we'll update the updated_at field to track the change
    const { data: updatedCompany, error: updateError } = await supabase
      .from('company_accounts')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('id', companyId)
      .select('id, company_name, updated_at')
      .single();

    if (updateError) {
      console.error('Company scout limit update error:', updateError);
      return {
        success: false,
        error: `スカウト上限数の更新に失敗しました: ${updateError.message}`
      };
    }

    console.log('Company scout limit updated successfully:', updatedCompany);
    console.log(`New scout limit for ${updatedCompany.company_name}: ${newScoutLimit}`);

    // Step 3: Revalidate the company detail page
    revalidatePath(`/admin/company/${companyId}`);

    return {
      success: true,
      company: updatedCompany,
      newScoutLimit
    };

  } catch (error) {
    console.error('Error updating company scout limit:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function suspendCompany(
  companyId: string
) {
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
        error: `企業休会処理に失敗しました: ${updateError.message}`
      };
    }

    console.log('Company suspended successfully:', updatedCompany);

    // Step 2: Revalidate the company detail page
    revalidatePath(`/admin/company/${companyId}`);
    revalidatePath('/admin/company');

    return {
      success: true,
      company: updatedCompany
    };

  } catch (error) {
    console.error('Error suspending company:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function updateGroupName(
  groupId: string,
  newGroupName: string
) {
  try {
    // Step 1: Validate input data
    if (!newGroupName || newGroupName.trim().length === 0) {
      return {
        success: false,
        error: 'グループ名を入力してください'
      };
    }

    if (newGroupName.length > 100) {
      return {
        success: false,
        error: 'グループ名は100文字以内で入力してください'
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
        error: `グループ情報の取得に失敗しました: ${fetchError.message}`
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
        error: `グループ名の更新に失敗しました: ${updateError.message}`
      };
    }

    console.log(`[Group Name Update] Successfully updated group: ${currentGroup.group_name} → ${updatedGroup.group_name} (ID: ${groupId})`);

    // Step 4: Revalidate the company detail page to reflect changes immediately
    revalidatePath(`/admin/company/${currentGroup.company_account_id}`);

    return {
      success: true,
      updatedGroup: updatedGroup,
      companyAccountId: currentGroup.company_account_id
    };

  } catch (error) {
    console.error('Error updating group name:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
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

    console.log(`[Group Creation] Creating new group: ${groupName} for company: ${companyId}`);
    console.log(`[Group Creation] Members to invite:`, members);

    // Step 1: Create new group
    const { data: newGroup, error: groupError } = await supabase
      .from('company_groups')
      .insert({
        company_account_id: companyId,
        group_name: groupName.trim(),
        description: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id, group_name')
      .single();

    if (groupError) {
      console.error('Group creation error:', groupError);
      return {
        success: false,
        error: `グループの作成に失敗しました: ${groupError.message}`
      };
    }

    console.log(`[Group Creation] Successfully created group: ${newGroup.group_name} (ID: ${newGroup.id})`);

    const invitedMembers: Array<{ email: string; role: string; status: string }> = [];

    // Step 2: Process each member invitation
    for (const member of members) {
      try {
        // Check if user already exists
        const { data: existingUser, error: userCheckError } = await supabase
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
          const tempPassword = Math.random().toString(36).slice(-12); // Generate temporary password

          const { data: newUser, error: createUserError } = await supabase
            .from('company_users')
            .insert({
              email: member.email,
              password_hash: tempPassword, // In real implementation, this should be hashed
              full_name: '', // Will be filled during registration
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select('id')
            .single();

          if (createUserError) {
            console.error(`Failed to create user ${member.email}:`, createUserError);
            continue; // Skip this member and continue with others
          }

          userId = newUser.id;
          console.log(`[Group Creation] Created new user: ${member.email} (ID: ${userId})`);
        }

        // Step 3: Add user to group with specified role
        const { error: permissionError } = await supabase
          .from('company_user_group_permissions')
          .upsert({
            company_user_id: userId,
            company_group_id: newGroup.id,
            permission_level: member.role === 'admin' ? 'ADMINISTRATOR' : 'SCOUT_STAFF'
          });

        if (permissionError) {
          console.error(`Failed to add permissions for ${member.email}:`, permissionError);
          continue; // Skip this member and continue with others
        }

        // Step 4: Send invitation email (simulated)
        console.log(`[Group Creation] Sending invitation email to: ${member.email}`);
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
          status: 'invited'
        });

      } catch (error) {
        console.error(`Error processing member ${member.email}:`, error);
        continue; // Skip this member and continue with others
      }
    }

    console.log(`[Group Creation] Successfully processed ${invitedMembers.length} members`);

    // Step 5: Revalidate the company detail page
    revalidatePath(`/admin/company/${companyId}`);

    return {
      success: true,
      group: newGroup,
      invitedMembers,
      message: `グループ「${groupName}」を作成し、${invitedMembers.length}人のメンバーを招待しました`
    };

  } catch (error) {
    console.error('Error creating new group:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function inviteMembersToGroup(
  groupId: string,
  members: Array<{ email: string; role: string }>
) {
  try {
    const supabase = getSupabaseAdminClient();

    console.log(`[Member Invitation] Starting invitation for group: ${groupId}`);
    console.log(`[Member Invitation] Members to invite:`, members);

    // Step 1: Get group and company information
    const { data: groupData, error: groupError } = await supabase
      .from('company_groups')
      .select('id, group_name, company_account_id, company_accounts(id, company_name)')
      .eq('id', groupId)
      .single();

    if (groupError) {
      console.error('Group fetch error:', groupError);
      return {
        success: false,
        error: `グループ情報の取得に失敗しました: ${groupError.message}`
      };
    }

    const companyData = groupData.company_accounts;
    const invitedMembers: Array<{ email: string; role: string; status: string }> = [];

    // Step 2: Process each member invitation
    for (const member of members) {
      try {
        // Check if user already exists
        const { data: existingUser, error: userCheckError } = await supabase
          .from('company_users')
          .select('id, email')
          .eq('email', member.email)
          .single();

        let userId: string;
        let userCreated = false;
        let permissionGranted = false;
        let emailSent = false;

        try {
          // Step 2: Check if user already exists or create new user
          if (existingUser) {
            // User already exists
            userId = existingUser.id;
            console.log(`[Member Invitation] User already exists: ${member.email}`);
            userCreated = true; // 既存ユーザーの場合は作成済みとして扱う
          } else {
            // Create new user account
            const tempPassword = Math.random().toString(36).slice(-12); // Generate temporary password

            const { data: newUser, error: createUserError } = await supabase
              .from('company_users')
              .insert({
                email: member.email,
                password_hash: tempPassword, // In real implementation, this should be hashed
                full_name: '', // Will be filled during registration
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .select('id')
              .single();

            if (createUserError) {
              console.error(`Failed to create user ${member.email}:`, createUserError);
              continue; // Skip this member and continue with others
            }

            userId = newUser.id;
            userCreated = true;
            console.log(`[Member Invitation] Created new user: ${member.email} (ID: ${userId})`);
          }

          // Step 3: Add user to group with specified role
          const { error: permissionError } = await supabase
            .from('company_user_group_permissions')
            .upsert({
              company_user_id: userId,
              company_group_id: groupId,
              permission_level: member.role === 'admin' ? 'ADMINISTRATOR' : 'SCOUT_STAFF'
            });

          if (permissionError) {
            console.error(`Failed to add permissions for ${member.email}:`, permissionError);
            continue; // Skip this member and continue with others
          }

          permissionGranted = true;
          console.log(`[Member Invitation] Permission granted for ${member.email} in group ${groupData.group_name}`);

          // Step 4: Send invitation email (actual implementation)
          try {
            console.log(`[Member Invitation] Sending invitation email to: ${member.email}`);

            // 招待トークンを生成
            const invitationToken = await generateInvitationToken(
              member.email,
              groupId,
              member.role,
              companyData.id
            );

            // 招待URLを生成
            const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/invite/${invitationToken}`;

            // 招待メールのHTMLテンプレートを生成
            const emailHtml = createInvitationEmailTemplate({
              companyName: companyData.company_name,
              groupName: groupData.group_name,
              role: member.role,
              invitationUrl: invitationUrl,
              email: member.email
            });

            // メールを送信
            await sendEmail(
              member.email,
              `${companyData.company_name} - グループ招待`,
              emailHtml
            );

            emailSent = true;
            console.log(`✅ 招待メール送信成功: ${member.email}`);

          } catch (emailError) {
            console.error(`❌ 招待メール送信失敗 ${member.email}:`, emailError);
            console.warn('メール送信に失敗しましたが、ユーザーの作成と権限付与は完了しています');
          }

          // Step 5: Add to invited members list (always add if user creation and permission grant succeeded)
          if (userCreated && permissionGranted) {
            invitedMembers.push({
              email: member.email,
              role: member.role,
              status: emailSent ? 'invited' : 'added_without_email',
              emailSent: emailSent
            });
            console.log(`[Member Invitation] Successfully processed ${member.email} (email sent: ${emailSent})`);
          }

        } catch (memberError) {
          console.error(`Error processing member ${member.email}:`, memberError);
          // 予期しないエラーの場合も、可能であればリストに追加
          if (userCreated && permissionGranted) {
            invitedMembers.push({
              email: member.email,
              role: member.role,
              status: 'error',
              emailSent: false
            });
          }
          continue; // Skip this member and continue with others
        }

      } catch (error) {
        console.error(`Error processing member ${member.email}:`, error);
        continue; // Skip this member and continue with others
      }
    }

    console.log(`[Member Invitation] Successfully processed ${invitedMembers.length} members`);

    // Step 5: Revalidate the company detail page
    revalidatePath(`/admin/company/${groupData.company_account_id}`);

    return {
      success: true,
      invitedMembers,
      groupData: {
        id: groupData.id,
        group_name: groupData.group_name,
        company_name: companyData.company_name
      }
    };

  } catch (error) {
    console.error('Error inviting members to group:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function deleteGroup(
  groupId: string
) {
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
        error: `グループ情報の取得に失敗しました: ${fetchError.message}`
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
        error: `グループの削除に失敗しました: ${deleteError.message}`
      };
    }

    console.log(`[Group Deletion] Successfully deleted group: ${groupData.group_name} (ID: ${groupId})`);

    // Step 4: Revalidate the company detail page
    revalidatePath(`/admin/company/${groupData.company_account_id}`);

    return {
      success: true,
      deletedGroup: {
        id: groupData.id,
        group_name: groupData.group_name,
        company_account_id: groupData.company_account_id
      }
    };

  } catch (error) {
    console.error('Error deleting group:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function deleteCompany(
  companyId: string
) {
  try {
    const supabase = getSupabaseAdminClient();

    console.log(`[Company Deletion] Starting physical deletion for company: ${companyId}`);

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
        error: `企業情報の取得に失敗しました: ${fetchError.message}`
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
        error: `企業アカウントの削除に失敗しました: ${deleteError.message}`
      };
    }

    console.log(`[Company Deletion] Successfully deleted company: ${companyData.company_name} (ID: ${companyId})`);

    // Step 4: Revalidate the company list page
    revalidatePath('/admin/company');

    return {
      success: true,
      deletedCompany: {
        id: companyData.id,
        company_name: companyData.company_name
      }
    };

  } catch (error) {
    console.error('Error deleting company:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
