'use client'

import Link from 'next/link';
import { Logo } from './logo';
import Open from '../svg/open';
import { useState } from 'react';

interface FooterProps {
  variant?: 'default' | 'login-before';
}

export function Footer({ variant = 'default' }: FooterProps) {
  // メニューデータ
  const menuData = {
    service: {
      title: 'サービス',
      items: [
        'メッセージ',
        '候補者を探す',
        '保存した検索条件',
        '進捗管理',
        'お知らせ一覧',
      ],
    },
    support: {
      title: 'お問い合わせ',
      items: [
        '問い合わせ',
        'ご利用ガイド',
        'よくある質問',
        '不具合・要望フォーム',
      ],
    },
    company: {
      title: '会社情報・規約',
      items: [
        '運営会社',
        '利用規約',
        'プライバシーポリシー',
        '法令に基づく表記',
      ],
    },
  };

  const [serviceOpen, setServiceOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  return (
    <footer className='bg-[#323232] text-white'>
      {/* メインフッターセクション */}
      <div className='md:px-20 px-[0px] md:py-20 py-[0px]'>
        <div className='flex flex-col lg:flex-row gap-10 lg:gap-20 xl:gap-[80px] px-[16px] md:px-0 py-[80px] md:py-0 pb-[40px] md:pb-0'>
          {/* 左側 - ロゴとキャッチフレーズ + 会員登録/ログイン */}
          <div className='flex-1 flex flex-col gap-10'>
            {/* ロゴとキャッチフレーズ */}
            <div className='flex flex-col gap-6'>
              <div className='w-[180px]'>
                <Logo className='w-[32px] h-auto md:w-[180px] md:h-[32px]' variant='white' />
              </div>
              <p
                className='text-white font-bold'
                style={{
                  fontFamily: 'Noto Sans JP, sans-serif',
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: '200%',
                  letterSpacing: '0.1em',
                }}
              >
                CuePointは、選考状況や志向を企業に共有することで、
                あなたの本音に届くスカウトを実現する転職支援サービスです。
              </p>
            </div>

            {/* 会員登録/ログインリンク - デスクトップ用 */}
            <div className='hidden md:flex items-center gap-2'>
              <div className='w-[104px] h-[32px] flex items-center justify-center'>
                <Link
                  href='/auth/register'
                  className='w-full h-full flex items-center justify-center text-white font-bold bg-transparent text-center hover:text-[#0F9058] transition-colors'
                  style={{
                    fontFamily: 'Noto Sans JP, sans-serif',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '200%',
                    letterSpacing: '0.1em',
                  }}
                >
                  会員登録
                </Link>
              </div>
              <span
                className='text-white font-bold'
                style={{
                  fontFamily: 'Noto Sans JP, sans-serif',
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: '200%',
                  letterSpacing: '0.1em',
                }}
              >
                /
              </span>
              <div className='w-[104px] h-[32px] flex items-center justify-center'>
                <Link
                  href='/auth/login'
                  className='w-full h-full flex items-center justify-center text-white font-bold bg-transparent text-center hover:text-[#0F9058] transition-colors'
                  style={{
                    fontFamily: 'Noto Sans JP, sans-serif',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '200%',
                    letterSpacing: '0.1em',
                  }}
                >
                  ログイン
                </Link>
              </div>
            </div>
          </div>

          {/* 右側 - 3カラムメニュー */}
          <div className='w-[100%] lg:w-[800px] flex flex-col md:flex-row gap-6 md:gap-10'>
            {/* サービスメニュー */}
            <div className='md:w-[240px] w-[100%]'>
              <div className='flex flex-row items-center justify-between md:block'>
                <h3
                  className='text-white font-bold mb-4'
                  style={{
                    fontFamily: 'Noto Sans JP, sans-serif',
                    fontWeight: 700,
                    fontSize: '18px',
                    lineHeight: '160%',
                    letterSpacing: '0.1em',
                  }}
                >
                  {menuData.service.title}
                </h3>
                <div className='md:hidden block'>
                  <Open 
                    width={12} 
                    height={12} 
                    fill='#FFF' 
                    rotate={serviceOpen ? 180 : 0} 
                    onClick={() => setServiceOpen(!serviceOpen)}
                  />
                </div>
              </div>
              <div className='border-t border-white mb-2 w-full md:w-auto'></div>
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  serviceOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                } md:max-h-none md:opacity-100`}
              >
                <div className='space-y-0'>
                  {menuData.service.items.map((item, index) => (
                    <div key={index} className='flex items-center gap-2 py-1'>
                      <div className='w-2 h-2 bg-[#0F9058] rounded-full flex-shrink-0'></div>
                      <span
                        className='text-white font-bold'
                        style={{
                          fontFamily: 'Noto Sans JP, sans-serif',
                          fontWeight: 700,
                          fontSize: '16px',
                          lineHeight: '200%',
                          letterSpacing: '0.1em',
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* お問い合わせメニュー */}
            <div className='md:w-[240px] w-[100%]'>
              <div className='flex flex-row items-center justify-between md:block'>
                <h3
                  className='text-white font-bold mb-4'
                  style={{
                    fontFamily: 'Noto Sans JP, sans-serif',
                    fontWeight: 700,
                    fontSize: '18px',
                    lineHeight: '160%',
                    letterSpacing: '0.1em',
                  }}
                >
                  {menuData.support.title}
                </h3>
                <div className='md:hidden block'>
                  <Open 
                    width={12} 
                    height={12} 
                    fill='#FFF' 
                    rotate={supportOpen ? 180 : 0} 
                    onClick={() => setSupportOpen(!supportOpen)}
                  />
                </div>
              </div>
              <div className='border-t border-white mb-2 w-full md:w-auto'></div>
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  supportOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                } md:max-h-none md:opacity-100`}
              >
                <div className='space-y-0'>
                  {menuData.support.items.map((item, index) => (
                    <div key={index} className='flex items-center gap-2 py-1'>
                      <div className='w-2 h-2 bg-[#0F9058] rounded-full flex-shrink-0'></div>
                      <span
                        className='text-white font-bold'
                        style={{
                          fontFamily: 'Noto Sans JP, sans-serif',
                          fontWeight: 700,
                          fontSize: '16px',
                          lineHeight: '200%',
                          letterSpacing: '0.1em',
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 会社情報・規約メニュー */}
            <div className='md:w-[240px] w-[100%]'>
              <div className='flex flex-row items-center justify-between md:block'>
                <h3
                  className='text-white font-bold mb-4'
                  style={{
                    fontFamily: 'Noto Sans JP, sans-serif',
                    fontWeight: 700,
                    fontSize: '18px',
                    lineHeight: '160%',
                    letterSpacing: '0.1em',
                  }}
                >
                  {menuData.company.title}
                </h3>
                <div className='md:hidden block'>
                  <Open 
                    width={12} 
                    height={12} 
                    fill='#FFF' 
                    rotate={companyOpen ? 180 : 0} 
                    onClick={() => setCompanyOpen(!companyOpen)}
                  />
                </div>
              </div>
              <div className='border-t border-white mb-2 w-full md:w-auto'></div>
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  companyOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                } md:max-h-none md:opacity-100`}
              >
                <div className='space-y-0'>
                  {menuData.company.items.map((item, index) => (
                    <div key={index} className='flex items-center gap-2 py-1'>
                      <div className='w-2 h-2 bg-[#0F9058] rounded-full flex-shrink-0'></div>
                      <span
                        className='text-white font-bold'
                        style={{
                          fontFamily: 'Noto Sans JP, sans-serif',
                          fontWeight: 700,
                          fontSize: '16px',
                          lineHeight: '200%',
                          letterSpacing: '0.1em',
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 会員登録/ログインリンク - モバイル用 */}
        <div className='md:hidden flex items-center gap-2 px-[16px] pb-[40px]'>
          <div className='w-[104px] h-[32px] flex items-center justify-center'>
            <Link
              href='/auth/register'
              className='w-full h-full flex items-center justify-center text-white font-bold bg-transparent text-center hover:text-[#0F9058] transition-colors'
              style={{
                fontFamily: 'Noto Sans JP, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '200%',
                letterSpacing: '0.1em',
              }}
            >
              会員登録
            </Link>
          </div>
          <span
            className='text-white font-bold'
            style={{
              fontFamily: 'Noto Sans JP, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '200%',
              letterSpacing: '0.1em',
            }}
          >
            /
          </span>
          <div className='w-[104px] h-[32px] flex items-center justify-center'>
            <Link
              href='/auth/login'
              className='w-full h-full flex items-center justify-center text-white font-bold bg-transparent text-center hover:text-[#0F9058] transition-colors'
              style={{
                fontFamily: 'Noto Sans JP, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '200%',
                letterSpacing: '0.1em',
              }}
            >
              ログイン
            </Link>
          </div>
        </div>
      </div>

      {/* コピーライトセクション */}
      <div className='bg-[#262626] px-20 py-6 flex justify-center items-center'>
        <p
          className='text-white'
          style={{
            fontFamily: 'Noto Sans JP, sans-serif',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '160%',
            letterSpacing: '0.1em',
            textAlign: 'center',
          }}
        >
          © 2025 DRS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}