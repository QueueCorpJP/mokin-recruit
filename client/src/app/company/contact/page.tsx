import React from 'react';
import { ContactFormClient } from './ContactFormClient';
import CtaGuideSection from '@/components/cta/CtaGuideSection';
import { AuthAwareNavigation } from '@/components/layout/AuthAwareNavigation';
import { AuthAwareFooter } from '@/components/layout/AuthAwareFooter';
import { requireCompanyAuth } from '@/lib/auth/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const user = await requireCompanyAuth();
  if (!user) {
    redirect('/company/auth/login');
  }

  const supabase = getSupabaseAdminClient();
  
  // company_usersとcompany_accountsをJOINして企業情報を取得
  const companyUserId = user.user_metadata?.company_user_id || user.id;
  const { data: companyUser, error: userError } = await supabase
    .from('company_users')
    .select(`
      email, 
      full_name,
      company_accounts!inner(
        company_name
      )
    `)
    .eq('id', companyUserId)
    .single();

  if (userError || !companyUser) {
    console.error('企業ユーザー情報取得エラー:', userError);
    redirect('/company/auth/login');
  }

  return (
    <>
      {/* ナビゲーション（ページ上部） */}
      <AuthAwareNavigation />
      {/* メインコンテンツラッパー（背景色F9F9F9） */}
      <div
        className='pt-10 px-20 pb-20 flex justify-center w-full'
        style={{ background: '#F9F9F9' }}
      >
        <div className='w-full max-w-[800px]'>
          {/* 白い枠組み（Box） */}
          <div
            className='w-full bg-white flex flex-col gap-10'
            style={{
              borderRadius: '10px',
              boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
              padding: '80px 87px',
            }}
          >
            {/* ヘッダー */}
            <div className='flex flex-col items-center gap-6 w-full'>
              <h1
                className='w-full font-bold text-center'
                style={{
                  fontSize: '32px',
                  lineHeight: '160%',
                  color: '#0F9058',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                お問い合わせ／申請
              </h1>
              <p
                className='w-full font-bold text-center'
                style={{
                  fontSize: '16px',
                  lineHeight: '200%',
                  letterSpacing: '0.1em',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: '32px',
                }}
              >
                ご質問、お問い合わせは下記フォームよりご連絡ください。
                <br />
                サービスに登録されているメールアドレス宛に担当者よりご返信いたします。
              </p>
            </div>
            
            {/* 企業情報の表示 */}
            <div className='flex flex-col gap-6 w-full'>
              <div className='flex w-full justify-end'>
                <div className='flex flex-row items-center gap-4'>
                  <span
                    className='font-bold text-right'
                    style={{
                      fontSize: '16px',
                      lineHeight: '200%',
                      letterSpacing: '0.1em',
                      display: 'block',
                    }}
                  >
                    企業名
                  </span>
                  <span
                    className='font-normal'
                    style={{
                      fontSize: '16px',
                      lineHeight: '200%',
                      letterSpacing: '0.1em',
                      width: '400px',
                      textAlign: 'left',
                      display: 'block',
                    }}
                  >
                    {(() => {
                      const accounts = companyUser.company_accounts as any;
                      if (Array.isArray(accounts) && accounts.length > 0) {
                        return accounts[0]?.company_name || 'データなし';
                      } else if (accounts && accounts.company_name) {
                        return accounts.company_name;
                      }
                      return 'データなし';
                    })()}
                  </span>
                </div>
              </div>
              <div className='flex w-full justify-end'>
                <div className='flex flex-row items-center gap-4'>
                  <span
                    className='font-bold text-right'
                    style={{
                      fontSize: '16px',
                      lineHeight: '200%',
                      letterSpacing: '0.1em',
                      display: 'block',
                    }}
                  >
                    お名前
                  </span>
                  <span
                    className='font-normal'
                    style={{
                      fontSize: '16px',
                      lineHeight: '200%',
                      letterSpacing: '0.1em',
                      width: '400px',
                      textAlign: 'left',
                      display: 'block',
                    }}
                  >
                    {companyUser.full_name || 'データなし'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* フォーム部分はクライアントコンポーネントに移管 */}
            <ContactFormClient />
          </div>
        </div>
      </div>
      {/* CTAグラデーションエリア */}
      <CtaGuideSection />
      {/* フッター */}
      <AuthAwareFooter />
    </>
  );
}
