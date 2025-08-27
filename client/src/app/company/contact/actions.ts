'use server';

import { requireCompanyAuthForAction } from '@/lib/auth/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import nodemailer from 'nodemailer';

export async function sendContactForm(formData: {
  group: string;
  inquiryType: string;
  ticketCount: string;
  content: string;
}) {
  try {
    console.log('=== sendContactForm開始 ===');
    console.log('フォームデータ:', formData);
    
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      console.log('認証エラー:', authResult.error);
      return { error: 'Unauthorized' };
    }
    console.log('認証成功 - ユーザーID:', authResult.data.companyUserId);
    
    const supabase = getSupabaseAdminClient();
    
    // 企業ユーザー情報を取得
    console.log('企業ユーザー情報を取得中...');
    const { data: companyUser, error: userError } = await supabase
      .from('company_users')
      .select(`
        email, 
        full_name,
        company_accounts(
          company_name
        )
      `)
      .eq('id', authResult.data.companyUserId)
      .single();

    if (userError || !companyUser) {
      console.error('企業ユーザー情報取得エラー:', userError);
      return { error: '企業ユーザー情報の取得に失敗しました' };
    }
    console.log('企業ユーザー情報:', companyUser);

    // Gmail SMTPでメール送信
    console.log('メール送信設定を確認中...');
    console.log('GMAIL_USER:', process.env.GMAIL_USER);
    console.log('GMAIL_APP_PASSWORD exists:', !!process.env.GMAIL_APP_PASSWORD);
    
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.log('Gmail設定が不完全です');
      return { error: 'メール送信設定が正しく構成されていません' };
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
      console.log('送信元:', process.env.GMAIL_USER);
      
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: companyUser.email, // 企業ユーザーにメール送信
        subject: 'お問い合わせ受付完了のお知らせ',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0f9058;">お問い合わせ受付完了</h2>
            <p>以下の内容でお問い合わせを受け付けました。</p>
            
            <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h3 style="color: #0f9058; margin-top: 0;">お問い合わせ内容</h3>
              <p><strong>企業名:</strong> ${(() => {
                const accounts = companyUser.company_accounts as any;
                if (Array.isArray(accounts) && accounts.length > 0) {
                  return accounts[0]?.company_name || 'データなし';
                } else if (accounts && accounts.company_name) {
                  return accounts.company_name;
                }
                return 'データなし';
              })()}</p>
              <p><strong>お名前:</strong> ${companyUser.full_name || 'データなし'}</p>
              <p><strong>メールアドレス:</strong> ${companyUser.email}</p>
              <p><strong>グループ:</strong> ${formData.group}</p>
              <p><strong>お問い合わせ種別:</strong> ${formData.inquiryType}</p>
              <p><strong>追加購入するチケット枚数:</strong> ${formData.ticketCount}枚</p>
              <p><strong>お問い合わせ内容:</strong></p>
              <div style="white-space: pre-wrap; background: white; padding: 15px; border: 1px solid #ddd; border-radius: 3px;">${formData.content}</div>
            </div>
            
            <p style="color: #666;">担当者よりご返信させていただきます。しばらくお待ちください。</p>
            <p style="color: #666; font-size: 12px;">このメールは自動送信です。</p>
          </div>
        `
      });
      
      console.log(`✅ メール送信成功! 送信先: ${companyUser.email}`);
      
    } catch (emailErr) {
      console.error('❌ メール送信エラー:', emailErr);
      return { error: 'メールの送信に失敗しました。しばらく時間をおいて再度お試しください。' };
    }
    
    console.log('=== sendContactForm完了 ===');
    return { success: true };
  } catch (error) {
    console.error('❌ sendContactForm全体エラー:', error);
    return { error: 'システムエラーが発生しました' };
  }
}