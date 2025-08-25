import { Button } from '@/components/ui/button';
import CtaGuideSection from '@/components/cta/CtaGuideSection';
import React from 'react';
import dynamic from 'next/dynamic';

// ナビゲーションとフッターを遅延読み込み（dynamic import）
const AuthAwareNavigation = dynamic(
  () =>
    import('@/components/layout/AuthAwareNavigation').then(mod => ({
      default: mod.AuthAwareNavigation,
    })),
  {
    loading: () => (
      <div className='h-[80px] bg-white border-b border-gray-200' />
    ),
  }
);
const AuthAwareFooter = dynamic(
  () =>
    import('@/components/layout/AuthAwareFooter').then(mod => ({
      default: mod.AuthAwareFooter,
    })),
  { loading: () => <div className='min-h-[200px] bg-[#323232]' /> }
);

export default function ContactCompletePage() {
  return (
    <>
      {/* ナビゲーション（ページ上部） */}
      <AuthAwareNavigation />
      {/* メインコンテンツラッパー（背景色F9F9F9） */}
      <div
        className='pt-10 px-20 flex justify-center w-full'
        style={{ background: '#F9F9F9', paddingBottom: '259px' }}
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
            {/* h1とpを1つのdivでラップし、24pxの間隔・中央揃え・太字にする */}
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
                お問い合わせ完了
              </h1>
              <p
                className='w-full font-bold text-center'
                style={{
                  fontSize: '16px',
                  lineHeight: '200%',
                  letterSpacing: '0.08em',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                お問い合わせが送信されました。
                <br />
                サービスに登録されているメールアドレス宛に担当者よりご返信いたしますので
                <br />
                今しばらくお待ちください。
              </p>
            </div>
            {/* マイページへボタン: contactページの送信ボタンと同じスタイル */}
            <div className='flex w-full justify-center'>
              <Button
                variant='green-gradient'
                style={{
                  width: '184px',
                  height: '60px',
                  borderRadius: '9999px',
                }}
              >
                マイページへ
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* CTAグラデーションエリア */}
      <CtaGuideSection />
      {/* フッター（ページ下部） */}
      <AuthAwareFooter />
    </>
  );
}
