'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { sendEmailViaSendGrid } from '@/lib/email/sender';

interface GroupSignupData {
  email: string;
  password: string;
  groupId: string;
  companyId: string;
}

// グループサインアップ用の認証テーブル作成が必要かチェックし、なければ既存のテーブルを流用
export async function sendGroupSignupVerification(formData: GroupSignupData) {
  try {
    console.log('=== sendGroupSignupVerification開始 ===');
    console.log('フォームデータ:', { ...formData, password: '[HIDDEN]' });

    const supabase = getSupabaseAdminClient();

    // 既存ユーザーが同じグループにすでに参加しているかチェック
    console.log('グループ参加済みチェック中...');
    const { data: existingPermission, error: permissionError } = await supabase
      .from('company_user_group_permissions')
      .select(
        `
        id,
        company_users!inner(email)
      `
      )
      .eq('company_users.email', formData.email)
      .eq('company_group_id', formData.groupId)
      .single();

    if (permissionError && permissionError.code !== 'PGRST116') {
      // PGRST116 = No rows found
      console.error('グループ参加チェックエラー:', permissionError);
      return { error: 'グループ参加状況の確認に失敗しました' };
    }

    if (existingPermission) {
      console.log('ユーザーは既にこのグループに参加済み');
      return { error: 'このグループには既に参加済みです' };
    }
    console.log('グループ参加チェック完了 - 参加可能');

    // グループとカンパニーの存在確認
    console.log('グループ存在チェック中...');
    const { data: groupCheck, error: groupError } = await supabase
      .from('company_groups')
      .select('id, group_name, company_account_id')
      .eq('id', formData.groupId)
      .eq('company_account_id', formData.companyId)
      .single();

    if (groupError || !groupCheck) {
      console.error('グループ存在チェックエラー:', groupError);
      return { error: '指定されたグループが見つかりません' };
    }
    console.log('グループ存在確認完了:', groupCheck);

    // 4桁の認証コード生成
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    console.log('生成された認証コード:', verificationCode);

    // signup_verification_codesテーブルにユーザーデータも含めて保存
    // 注意: 実際の実装では専用のテーブルを作成することを推奨
    console.log('認証コードとユーザーデータをデータベースに保存中...');

    // パスワードをハッシュ化
    const bcrypt = await import('bcrypt');
    const saltRounds = 10;
    const passwordHash = await (bcrypt as any).hash(
      formData.password,
      saltRounds
    );

    const userData = {
      password_hash: passwordHash,
      group_id: formData.groupId,
      company_id: formData.companyId,
    };

    const { error: saveError } = await supabase
      .from('signup_verification_codes')
      .insert({
        email: formData.email,
        verification_code: verificationCode,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10分後に期限切れ
        created_at: new Date().toISOString(),
        used_at: null,
        // user_dataカラムが存在しない場合は、テーブル構造の拡張が必要
        // 暫定的にupdated_atカラムにJSONとして保存（本来は推奨されない）
        updated_at: JSON.stringify(userData),
      });

    if (saveError) {
      console.error('認証コード保存エラー:', saveError);
      return { error: '認証コードの生成に失敗しました' };
    }
    console.log('認証コードとユーザーデータをデータベースに保存完了');

    // セッションにユーザーデータを一時保存するため、追加のテーブルが必要
    // 今回は簡単のため、signup_verification_codesテーブルを拡張して使用
    // 実際の実装では別テーブルを作成することを推奨

    // メール送信
    console.log('メール送信中...');
    console.log('送信先:', formData.email);

    const emailResult = await sendEmailViaSendGrid({
      to: formData.email,
      subject: 'グループ参加の認証コード',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f9058;">グループ参加の認証コード</h2>
          <p>以下の4桁の認証コードを入力してください：</p>
          <div style="background-color: #f9f9f9; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h3 style="color: #0f9058; font-size: 32px; margin: 0; letter-spacing: 8px;">${verificationCode}</h3>
          </div>
          <p><strong>グループ:</strong> ${groupCheck.group_name}</p>
          <p style="color: #666;">このコードは10分間有効です。</p>
          <p style="color: #666; font-size: 12px;">このメールに心当たりがない場合は、無視してください。</p>
        </div>
      `,
    });

    if (!emailResult.success) {
      console.error('❌ メール送信エラー:', emailResult.error);
      return {
        error:
          emailResult.error ||
          'メールの送信に失敗しました。しばらく時間をおいて再度お試しください。',
      };
    }

    console.log(`✅ メール送信成功! 送信先: ${formData.email}`);
    console.log('メッセージID:', emailResult.messageId);

    console.log('=== sendGroupSignupVerification完了 ===');
    return { success: true };
  } catch (error) {
    console.error('❌ sendGroupSignupVerification全体エラー:', error);
    return { error: 'システムエラーが発生しました' };
  }
}

export async function verifyGroupSignupCode(email: string, code: string) {
  try {
    console.log('=== verifyGroupSignupCode開始 ===');
    console.log('入力されたメール:', email);
    console.log('入力された認証コード:', code);

    const supabase = getSupabaseAdminClient();

    console.log('認証コードをデータベースから検索中...');
    const { data: verification, error: fetchError } = await supabase
      .from('signup_verification_codes')
      .select('*')
      .eq('email', email)
      .eq('verification_code', code)
      .is('used_at', null) // 未使用のものだけ
      .single();

    if (fetchError || !verification) {
      console.log('認証コード検索エラーまたは見つからない:', fetchError);
      return { error: '認証コードが正しくありません' };
    }
    console.log('認証コード見つかりました:', verification);

    if (new Date() > new Date(verification.expires_at)) {
      console.log('認証コードが期限切れです');
      return { error: '認証コードの有効期限が切れています' };
    }
    console.log('認証コードは有効です');

    console.log('認証コードを使用済みにマーク中...');
    const { error: markUsedError } = await supabase
      .from('signup_verification_codes')
      .update({ used_at: new Date().toISOString() })
      .eq('id', verification.id);

    if (markUsedError) {
      console.error('認証コード使用済みマークエラー:', markUsedError);
      return { error: '認証処理に失敗しました' };
    }
    console.log('認証コードを使用済みにマーク完了');

    // ここでパスワードを反映し、グループ権限を付与
    console.log('パスワード反映とグループ権限付与を開始...');

    // 保存されたユーザーデータを復元
    let userData;
    try {
      userData = JSON.parse(verification.updated_at);
      console.log('ユーザーデータ復元完了:', {
        ...userData,
        password_hash: '[HIDDEN]',
      });
    } catch (parseError) {
      console.error('ユーザーデータ復元エラー:', parseError);
      return { error: 'ユーザーデータの復元に失敗しました' };
    }

    // 認証済みユーザーの情報を取得（グループ参加のため）
    console.log('認証済みユーザー情報取得中...');
    const { data: currentUser, error: getUserError } = await supabase
      .from('company_users')
      .select('id, company_account_id, auth_user_id')
      .eq('email', email)
      .single();

    if (getUserError || !currentUser) {
      console.error('認証済みユーザー取得エラー:', getUserError);
      return { error: '認証済みユーザーの情報取得に失敗しました' };
    }
    console.log('認証済みユーザー情報取得完了:', currentUser);

    // パスワードをcompany_usersテーブルに反映
    console.log('company_usersのパスワードを更新中...');
    const { error: updatePwdErr } = await supabase
      .from('company_users')
      .update({
        password_hash: userData.password_hash,
        updated_at: new Date().toISOString(),
      })
      .eq('id', currentUser.id);
    if (updatePwdErr) {
      console.error('company_usersパスワード更新エラー:', updatePwdErr);
      return { error: 'パスワードの更新に失敗しました' };
    }

    // Supabase Authのパスワードも更新（auth_user_idがある場合のみ）
    try {
      if (currentUser.auth_user_id) {
        // 注意: 管理APIでのパスワード更新にはプレーンな新パスワードが必要だが、ここではハッシュのみ保持しているためスキップ
        // 必要であれば別フローで設定用リンクを送る
        console.log(
          'auth_user_idが存在するため、Authのパスワード更新は別手段が必要（スキップ）'
        );
      }
    } catch {}

    // グループ権限を設定
    console.log('グループ権限を設定中...');
    const { error: permissionError } = await supabase
      .from('company_user_group_permissions')
      .insert({
        company_user_id: currentUser.id,
        company_group_id: userData.group_id,
        permission_level: 'SCOUT_STAFF', // デフォルトで一般スタッフ権限
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (permissionError) {
      console.error('グループ権限設定エラー:', permissionError);
      return { error: 'グループ権限の設定に失敗しました' };
    } else {
      console.log('グループ権限設定完了');
    }

    console.log('=== verifyGroupSignupCode完了（グループ参加完了） ===');
    return { success: true, email: verification.email, userId: currentUser.id };
  } catch (error) {
    console.error('❌ verifyGroupSignupCode全体エラー:', error);
    return { error: 'システムエラーが発生しました' };
  }
}
