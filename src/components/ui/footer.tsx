'use client';

import Link from 'next/link';
import { Logo } from './logo';
import Open from '../svg/open';
import { useState } from 'react';

interface FooterProps {
  variant?: 'default' | 'candidate' | 'company' | 'login-before';
  isLoggedIn?: boolean;
  userInfo?: {
    companyName?: string;
    userName?: string;
  };
}

export function Footer({
  variant = 'default',
  isLoggedIn = false,
  userInfo,
}: FooterProps) {
  // リンクマッピング関数
  const getLinkForItem = (
    item: string,
    section: 'service' | 'support' | 'company'
  ) => {
    const baseUrl =
      variant === 'candidate'
        ? '/candidate'
        : variant === 'company'
          ? '/company'
          : '';

    // サービスセクション
    if (section === 'service') {
      switch (item) {
        case 'メッセージ':
          return `${baseUrl}/message`;
        case 'メディア':
          return `${baseUrl}/media`;
        case '求人を探す':
          return variant === 'candidate'
            ? '/candidate/search/setting'
            : '/search';
        case 'お気に入り求人':
          return '/candidate/job/favorite';
        case 'お知らせ一覧':
          return '/candidate/news';
        case '求人管理':
          return '/company/recruitment/detail';
        case '候補者検索':
          return '/company/search';
        case '企業設定':
          return '/company/account';
        case 'サービス紹介':
          return '/about';
        case '企業向け機能':
          return '/company/features';
        default:
          return '#';
      }
    }

    // お問い合わせセクション
    if (section === 'support') {
      switch (item) {
        case '問い合わせ':
          return '/contact';
        case 'よくある質問':
          return '/faq';
        case '不具合・要望フォーム':
          return '/feedback';
        default:
          return '#';
      }
    }

    // 会社情報・規約セクション
    if (section === 'company') {
      switch (item) {
        case '運営会社':
          return '/about-company';
        case '利用規約':
          return variant === 'candidate'
            ? '/candidate/terms'
            : variant === 'company'
              ? '/company/terms'
              : '/terms';
        case 'プライバシーポリシー':
          return variant === 'candidate'
            ? '/candidate/privacy'
            : variant === 'company'
              ? '/company/privacy'
              : '/privacy';
        case '法令に基づく表記':
          return variant === 'candidate' ? '/candidate/legal' : '/legal';
        default:
          return '#';
      }
    }

    return '#';
  };

  // variantと認証状態に応じたメニューデータ
  const getMenuData = () => {
    if (variant === 'candidate') {
      return {
        service: {
          title: 'サービス',
          items: isLoggedIn
            ? [
                'メッセージ',
                'メディア',
                '求人を探す',
                'お気に入り求人',
                'お知らせ一覧',
              ]
            : ['求人を探す', 'サービス紹介'],
        },
        support: {
          title: 'お問い合わせ',
          items: ['問い合わせ', 'よくある質問', '不具合・要望フォーム'],
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
    } else if (variant === 'company') {
      return {
        service: {
          title: 'サービス',
          items: isLoggedIn
            ? ['求人管理', 'メッセージ', '候補者検索', '企業設定']
            : ['サービス紹介', '企業向け機能'],
        },
        support: {
          title: 'お問い合わせ',
          items: ['問い合わせ', 'よくある質問', '不具合・要望フォーム'],
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
    } else if (variant === 'login-before') {
      // login-before variant (for auth pages)
      return {
        service: {
          title: 'サービス',
          items: ['求人を探す', 'サービス紹介'],
        },
        support: {
          title: 'お問い合わせ',
          items: ['問い合わせ', 'よくある質問', '不具合・要望フォーム'],
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
    } else {
      // default variant
      return {
        service: {
          title: 'サービス',
          items: [
            'メッセージ',
            'メディア',
            '求人を探す',
            'お気に入り求人',
            'お知らせ一覧',
          ],
        },
        support: {
          title: 'お問い合わせ',
          items: ['問い合わせ', 'よくある質問', '不具合・要望フォーム'],
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
    }
  };

  const menuData = getMenuData();

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
                <Logo
                  className='w-[32px] h-auto md:w-[180px] md:h-[32px]'
                  variant='white'
                />
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

            {/* 会員登録/ログインリンク または ログイン済み情報 - デスクトップ用 */}
            <div className='hidden md:flex items-center gap-2'>
              {!isLoggedIn ? (
                // 未認証時: 会員登録/ログインリンク
                <>
                  <div className='w-[104px] h-[32px] flex items-center justify-center'>
                    <Link
                      href={
                        variant === 'company'
                          ? '/company/auth/register'
                          : '/candidate/auth/register'
                      }
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
                      href={
                        variant === 'company'
                          ? '/company/auth/login'
                          : '/candidate/auth/login'
                      }
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
                </>
              ) : (
                // 認証済み時: ユーザー情報表示
                <div className='flex items-center gap-2'>
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
                    {userInfo?.userName && `${userInfo.userName}さん`}
                    {userInfo?.companyName && `${userInfo.companyName}様`}
                    {!userInfo?.userName &&
                      !userInfo?.companyName &&
                      'ログイン中'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 右側 - 3カラムメニュー */}
          <div className='w-[100%] lg:w-[800px] flex flex-col md:flex-row gap-6 md:gap-10'>
            {/* サービスメニュー */}
            <div className='md:w-[240px] w-[100%]'>
              <button
                onClick={() => setServiceOpen(!serviceOpen)}
                className='w-[100%]'
              >
                <div className='flex flex-row items-center justify-between md:block'>
                  <h3
                    className='text-white font-bold mb-4 text-left'
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
              </button>
              <div className='border-t border-white mb-2 w-full md:w-auto'></div>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  serviceOpen
                    ? 'max-h-[500px] opacity-100'
                    : 'max-h-0 opacity-0'
                } md:max-h-none md:opacity-100`}
              >
                <div className='space-y-0'>
                  {menuData.service.items.map((item, index) => (
                    <div key={index} className='flex items-center gap-2 py-1'>
                      <div className='w-2 h-2 bg-[#0F9058] rounded-full flex-shrink-0'></div>
                      <Link
                        href={getLinkForItem(item, 'service')}
                        className='text-white font-bold hover:text-[#0F9058] transition-colors'
                        style={{
                          fontFamily: 'Noto Sans JP, sans-serif',
                          fontWeight: 700,
                          fontSize: '16px',
                          lineHeight: '200%',
                          letterSpacing: '0.1em',
                        }}
                      >
                        {item}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* お問い合わせメニュー */}
            <div className='md:w-[240px] w-[100%]'>
              <button
                onClick={() => setSupportOpen(!supportOpen)}
                className='w-[100%]'
              >
                <div
                  className='flex flex-row items-center justify-between md:block'
                  onClick={() => setSupportOpen(!supportOpen)}
                >
                  <h3
                    className='text-white font-bold mb-4 text-left'
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
                    />
                  </div>
                </div>
              </button>

              <div className='border-t border-white mb-2 w-full md:w-auto'></div>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  supportOpen
                    ? 'max-h-[500px] opacity-100'
                    : 'max-h-0 opacity-0'
                } md:max-h-none md:opacity-100`}
              >
                <div className='space-y-0'>
                  {menuData.support.items.map((item, index) => (
                    <div key={index} className='flex items-center gap-2 py-1'>
                      <div className='w-2 h-2 bg-[#0F9058] rounded-full flex-shrink-0'></div>
                      <Link
                        href={getLinkForItem(item, 'support')}
                        className='text-white font-bold hover:text-[#0F9058] transition-colors'
                        style={{
                          fontFamily: 'Noto Sans JP, sans-serif',
                          fontWeight: 700,
                          fontSize: '16px',
                          lineHeight: '200%',
                          letterSpacing: '0.1em',
                        }}
                      >
                        {item}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 会社情報・規約メニュー */}
            <div className='md:w-[240px] w-[100%]'>
              <button
                onClick={() => setCompanyOpen(!companyOpen)}
                className='w-[100%]'
              >
                <div className='flex flex-row items-center justify-between md:block'>
                  <h3
                    className='text-white font-bold mb-4 text-left'
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
              </button>

              <div className='border-t border-white mb-2 w-full md:w-auto'></div>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  companyOpen
                    ? 'max-h-[500px] opacity-100'
                    : 'max-h-0 opacity-0'
                } md:max-h-none md:opacity-100`}
              >
                <div className='space-y-0'>
                  {menuData.company.items.map((item, index) => (
                    <div key={index} className='flex items-center gap-2 py-1'>
                      <div className='w-2 h-2 bg-[#0F9058] rounded-full flex-shrink-0'></div>
                      <Link
                        href={getLinkForItem(item, 'company')}
                        className='text-white font-bold hover:text-[#0F9058] transition-colors'
                        style={{
                          fontFamily: 'Noto Sans JP, sans-serif',
                          fontWeight: 700,
                          fontSize: '16px',
                          lineHeight: '200%',
                          letterSpacing: '0.1em',
                        }}
                      >
                        {item}
                      </Link>
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
              href='/signup'
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
              href='/candidate/auth/login'
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
