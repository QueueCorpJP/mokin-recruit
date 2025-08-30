import React from 'react';
import { GroupVerifyClient } from './GroupVerifyClient';

interface GroupVerifyParams {
  searchParams: Promise<{ email?: string; }>
}

export default async function GroupVerifyPage({ searchParams }: GroupVerifyParams) {
  const params = await searchParams;
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
          className='flex flex-col gap-10' // gap-10は40px相当
        >
          {/* 既存の白背景フォーム本体 */}
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
                  letterSpacing: '0.1em',
                }}
              >
                認証コードの入力
              </h1>
              <p
                className='w-full font-bold text-center'
                style={{
                  fontSize: '16px',
                  lineHeight: '200%',
                  letterSpacing: '0.1em',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                認証コードを {params.email || '指定されたメールアドレス'} に送りました。
                <br />
                メールアドレスに届いた4桁の半角数字を入力してください。
              </p>
            </div>
            
            {/* フォーム部分はクライアントコンポーネントに移管 */}
            <GroupVerifyClient email={params.email || ''} />
          </div>
          {/* 注意事項エリア */}
          <div
            className='w-full bg-white'
            style={{
              borderRadius: '10px',
              boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
              padding: '80px 87px',
              minHeight: '100px', // 仮の高さ
            }}
          >
            <h3
              className='w-full font-bold text-center'
              style={{
                fontSize: '20px',
                lineHeight: '160%',
                color: '#0F9058',
                fontWeight: 'bold',
                textAlign: 'center',
                letterSpacing: '0.1em',
              }}
            >
              認証コードが届かない場合
            </h3>
            <p
              className='w-full text-center'
              style={{
                fontSize: '14px',
                lineHeight: '160%',
                letterSpacing: '0.1em',
                textAlign: 'center',
                fontWeight: 'bold',
                marginTop: '18px',
              }}
            >
              メール送信元からのメールを受信できる設定になっているか、
              <br />
              メールが迷惑メールボックスに振り分けられていないかをご確認の上、
              <br />
              新しい認証コードを再度送信してください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}