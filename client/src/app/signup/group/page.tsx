import React from 'react';
import { GroupSignupFormClient } from './GroupSignupFormClient';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { requireCompanyAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface GroupSignupParams {
  searchParams: Promise<{ groupId?: string; companyId?: string; }>
}

export default async function GroupSignupPage({ searchParams }: GroupSignupParams) {
  // searchParamsをawaitで解決
  const params = await searchParams;
  // 認証チェック - 認証されていない場合はログインページにリダイレクト
  const user = await requireCompanyAuth();
  if (!user) {
    redirect('/company/auth/login');
  }

  const supabase = getSupabaseAdminClient();
  
  // 認証ユーザーの情報を取得
  const companyUserId = user.user_metadata?.company_user_id || user.id;
  const { data: currentUser, error: userError } = await supabase
    .from('company_users')
    .select(`
      email, 
      full_name,
      company_accounts!inner(
        id,
        company_name,
        industry,
        headquarters_address
      )
    `)
    .eq('id', companyUserId)
    .single();

  if (userError || !currentUser) {
    console.error('企業ユーザー情報取得エラー:', userError);
    redirect('/company/auth/login');
  }
  
  let companyData: any = null;
  let groupData: any = null;

  // 認証済みユーザーの企業アカウント情報から会社データを取得
  if (currentUser?.company_accounts) {
    const accounts = currentUser.company_accounts as any;
    companyData = Array.isArray(accounts) ? accounts[0] : accounts;
  }

  // URLパラメータからグループの情報を取得
  if (params.groupId && params.companyId) {
    // グループの情報を取得（認証ユーザーの企業に所属するグループのみ）
    const { data: group, error: groupError } = await supabase
      .from('company_groups')
      .select(`
        id,
        group_name,
        description
      `)
      .eq('id', params.groupId)
      .eq('company_account_id', params.companyId)
      .single();

    if (!groupError && group) {
      groupData = {
        id: group.id,
        group_name: group.group_name,
        description: group.description
      };
    }
  } else if (params.groupId) {
    // companyIdが指定されていない場合は、認証ユーザーの企業IDを使用
    const accounts = currentUser?.company_accounts as any;
    const userCompanyId = Array.isArray(accounts) ? accounts[0]?.id : accounts?.id;
    if (userCompanyId) {
      const { data: group, error: groupError } = await supabase
        .from('company_groups')
        .select(`
          id,
          group_name,
          description
        `)
        .eq('id', params.groupId)
        .eq('company_account_id', userCompanyId)
        .single();

      if (!groupError && group) {
        groupData = {
          id: group.id,
          group_name: group.group_name,
          description: group.description
        };
      }
    }
  }

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #229A4E 0%, #17856F 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 0',
      }}
    >
      {/* 背景円SVG */}
      <svg
        width='3000'
        height='3000'
        viewBox='0 0 3000 3000'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        style={{
          position: 'absolute',
          top: '535px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <linearGradient
            id='ctaCircleGradient'
            x1='1500'
            y1='0'
            x2='1500'
            y2='3000'
            gradientUnits='userSpaceOnUse'
          >
            <stop offset='0%' stopColor='#1CA74F' />
            <stop offset='10%' stopColor='#198D76' />
            <stop offset='100%' stopColor='#198D76' />
          </linearGradient>
        </defs>
        <circle cx='1500' cy='1500' r='1500' fill='url(#ctaCircleGradient)' />
      </svg>
      {/* メインフォームボックス */}
      <div
        className='w-full max-w-[800px]'
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div
          className='w-full bg-white flex flex-col gap-10'
          style={{
            borderRadius: '10px',
            boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
            padding: '80px 87px',
          }}
        >
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
              グループへの参加
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
              以下の情報を入力してグループに参加してください。
              <br />
              登録ボタンを押すと認証メールが送信されます。
            </p>
          </div>
          
          {/* 企業・グループ情報の表示 */}
          <div className='flex flex-col gap-6 w-full'>
            <div className='flex w-full justify-end'>
              <div className='flex flex-row justify-end gap-4 w-full max-w-[620px]'>
                <span
                  className='font-bold text-right'
                  style={{
                    fontSize: '16px',
                    lineHeight: '200%',
                    letterSpacing: '0.1em',
                    display: 'block',
                    width: '160px',
                    minWidth: '160px',
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
                    maxWidth: '400px',
                    width: '100%',
                    textAlign: 'left',
                    display: 'block',
                  }}
                >
                  {companyData?.company_name || 'データを取得できませんでした'}
                </span>
              </div>
            </div>
            <div className='flex w-full justify-end'>
              <div className='flex flex-row justify-end gap-4 w-full max-w-[620px]'>
                <span
                  className='font-bold text-right'
                  style={{
                    fontSize: '16px',
                    lineHeight: '200%',
                    letterSpacing: '0.1em',
                    display: 'block',
                    width: '160px',
                    minWidth: '160px',
                  }}
                >
                  グループ名
                </span>
                <span
                  className='font-normal'
                  style={{
                    fontSize: '16px',
                    lineHeight: '200%',
                    letterSpacing: '0.1em',
                    maxWidth: '400px',
                    width: '100%',
                    textAlign: 'left',
                    display: 'block',
                  }}
                >
                  {groupData?.group_name || 'データを取得できませんでした'}
                </span>
              </div>
            </div>
          </div>
          
          {/* 認証ユーザー情報の表示 */}
          <div className='flex flex-col gap-6 w-full'>
            <div className='flex w-full justify-end'>
              <div className='flex flex-row justify-end gap-4 w-full max-w-[620px]'>
                <span
                  className='font-bold text-right'
                  style={{
                    fontSize: '16px',
                    lineHeight: '200%',
                    letterSpacing: '0.1em',
                    display: 'block',
                    width: '160px',
                    minWidth: '160px',
                  }}
                >
                  メールアドレス
                </span>
                <span
                  className='font-normal'
                  style={{
                    fontSize: '16px',
                    lineHeight: '200%',
                    letterSpacing: '0.1em',
                    maxWidth: '400px',
                    width: '100%',
                    textAlign: 'left',
                    display: 'block',
                  }}
                >
                  {currentUser.email}
                </span>
              </div>
            </div>
            <div className='flex w-full justify-end'>
              <div className='flex flex-row justify-end gap-4 w-full max-w-[620px]'>
                <span
                  className='font-bold text-right'
                  style={{
                    fontSize: '16px',
                    lineHeight: '200%',
                    letterSpacing: '0.1em',
                    display: 'block',
                    width: '160px',
                    minWidth: '160px',
                  }}
                >
                  現在のお名前
                </span>
                <span
                  className='font-normal'
                  style={{
                    fontSize: '16px',
                    lineHeight: '200%',
                    letterSpacing: '0.1em',
                    maxWidth: '400px',
                    width: '100%',
                    textAlign: 'left',
                    display: 'block',
                  }}
                >
                  {currentUser.full_name}
                </span>
              </div>
            </div>
          </div>

          {/* フォーム部分はクライアントコンポーネントに移管 */}
          <GroupSignupFormClient 
            companyData={companyData}
            groupData={groupData}
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
}