'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { PasswordFormField } from '@/components/ui/password-form-field';
import { BaseInput } from '@/components/ui/base-input';

// グループサインアップページ
export default function GroupSignupPage() {
  const [code, setCode] = useState('');

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
                認証コードを~~~~~~~~~~~~~~に送りました。
                <br />
                メールアドレスに届いた4桁の半角英数字を入力してください。
              </p>
            </div>
            {/* 入力項目エリア */}
            <div className='flex flex-col gap-6 w-full'>
              {/* 認証コード input */}
              <div className='flex w-full justify-center'>
                <div
                  className='flex flex-row justify-center gap-4 w-full max-w-[620px]'
                  style={{ alignItems: 'center' }}
                >
                  <span
                    className='font-bold text-right'
                    style={{
                      fontSize: '16px',
                      lineHeight: '200%',
                      letterSpacing: '0.1em',
                      width: '160px',
                    }}
                  >
                    認証コード
                  </span>
                  <BaseInput
                    id='code'
                    value={code}
                    onChange={e => {
                      // 4桁までの数字のみ許可
                      const value = e.target.value
                        .replace(/[^0-9]/g, '')
                        .slice(0, 4);
                      setCode(value);
                    }}
                    placeholder='4桁の認証コードを入力してください'
                    className='w-full'
                    style={{ maxWidth: '400px' }}
                    type='number'
                    inputMode='numeric'
                    maxLength={4}
                  />
                </div>
              </div>
              {/* 認証コード再発行案内テキスト */}
              <div
                className='flex flex-row justify-center gap-2 w-full max-w-[620px]'
                style={{ marginTop: '8px' }}
              >
                <span
                  className='font-bold text-center'
                  style={{
                    fontSize: '14px',
                    lineHeight: '200%',
                    letterSpacing: '0.1em',
                    display: 'block',
                    minWidth: '160px',
                  }}
                >
                  認証コードが受け取れなかった場合は、新規のコードを発行してください。
                  <br />
                  <span
                    style={{
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    新しいコードを発行する
                  </span>
                </span>
              </div>
            </div>
            {/* 送信ボタン */}
            <div className='flex w-full justify-center'>
              <Button
                variant='green-gradient'
                style={{
                  width: '160px',
                  height: '60px',
                  borderRadius: '9999px',
                }}
              >
                認証する
              </Button>
            </div>
          </div>
          {/* 新規追加：外枠のみの白背景フォーム本体 */}
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
              「@example.com」からのメールを受信できる設定になっているか、
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
