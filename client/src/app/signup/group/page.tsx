'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { PasswordFormField } from '@/components/ui/password-form-field';
import { BaseInput } from '@/components/ui/base-input';
import Link from 'next/link';

// グループサインアップページ
export default function GroupSignupPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

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
              ご質問、お問い合わせは下記フォームよりご連絡ください。
              <br />
              サービスに登録されているメールアドレス宛に担当者よりご返信いたします。
            </p>
          </div>
          {/* 入力項目エリア */}
          <div className='flex flex-col gap-6 w-full'>
            {/* 企業名 */}
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
                  株式会社サンプル
                </span>
              </div>
            </div>
            {/* グループ名 */}
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
                  グループサンプル
                </span>
              </div>
            </div>
            {/* お名前 input */}
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
                  お名前
                </span>
                <BaseInput
                  id='name'
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder='お名前を入力してください'
                  className='w-full'
                  style={{ maxWidth: '400px' }}
                />
              </div>
            </div>
            {/* パスワード欄 */}
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
                  パスワード
                </span>
                <div style={{ maxWidth: '400px', width: '100%' }}>
                  <PasswordFormField
                    id='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    label=''
                    placeholder='半角英数字・記号のみ、8文字以上'
                    showValidation={true}
                    className='w-full'
                    hideLabel={true}
                  />
                </div>
              </div>
            </div>
            {/* パスワード再入力欄 */}
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
                  パスワード再入力
                </span>
                <div style={{ maxWidth: '400px', width: '100%' }}>
                  <PasswordFormField
                    id='passwordConfirm'
                    value={passwordConfirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
                    label=''
                    placeholder='もう一度パスワードを入力してください'
                    showValidation={true}
                    isConfirmField={true}
                    confirmTarget={password}
                    className='w-full'
                    hideLabel={true}
                  />
                </div>
              </div>
            </div>
            {/* 利用規約・個人情報同意チェック（中央寄せ・上マージン削除） */}
            <div className='flex items-center gap-2 justify-center w-full'>
              <img
                src='/images/checkbox.svg'
                alt='同意する'
                width={21}
                height={20}
              />
              <span
                style={{
                  fontSize: '14px',
                  lineHeight: '200%',
                  color: '#333',
                  fontWeight: 'bold',
                  letterSpacing: '0.1em',
                }}
              >
                <Link href='/terms' passHref legacyBehavior>
                  <a
                    style={{
                      color: '#333',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginRight: 2,
                    }}
                  >
                    利用規約
                  </a>
                </Link>
                ・
                <Link href='/privacy' passHref legacyBehavior>
                  <a
                    style={{
                      color: '#333',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginLeft: 2,
                    }}
                  >
                    個人情報
                  </a>
                </Link>
                に同意する
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
              送信する
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
