import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import './globals.css';

// Stagewise Toolbar (development only)
// import StagewiseToolbarClient from './stagewise-toolbar-client';

// NOTE: DI Container initialization moved to API routes for better performance
// Previously: import '@/lib/server/container/bindings';

// Providers
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// 重要でないコンポーネントを遅延読み込み
const AuthAwareNavigation = dynamic(
  () => import('../components/layout/AuthAwareNavigation').then(mod => ({ default: mod.AuthAwareNavigation })),
  {
    loading: () => <div className="h-[80px] bg-white border-b border-gray-200" />,
  }
);

const AuthAwareFooter = dynamic(
  () => import('../components/layout/AuthAwareFooter').then(mod => ({ default: mod.AuthAwareFooter })),
  {
    loading: () => <div className="min-h-[200px] bg-[#323232]" />,
  }
);

// フォント最適化
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-noto-sans-jp',
  weight: ['400', '500', '700'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: 'Mokin Recruit - 転職プラットフォーム',
  description: '転職活動を効率化するプラットフォーム',
  keywords: ['転職', '求人', 'スカウト', 'プラットフォーム'],
  authors: [{ name: 'Mokin Recruit Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Mokin Recruit - 転職プラットフォーム',
    description: '転職活動を効率化するプラットフォーム',
    type: 'website',
    locale: 'ja_JP',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ja' className={`${inter.variable} ${notoSansJP.variable}`}>
      <head>
        {/* DNS Prefetch */}
        <link rel='dns-prefetch' href='//fonts.googleapis.com' />
        <link rel='dns-prefetch' href='//fonts.gstatic.com' />

        {/* Preconnect - 最適化 */}
        <link rel='preconnect' href='https://fonts.googleapis.com' crossOrigin='' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />
        

        {/* Critical CSS - レスポンシブ対応のちらつき防止 */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @font-face {
              font-family: 'Noto Sans JP Fallback';
              src: local('Noto Sans JP'), local('NotoSansJP-Regular'),
                   local('ヒラギノ角ゴ ProN'), local('Hiragino Kaku Gothic ProN'),
                   local('メイリオ'), local('Meiryo');
              unicode-range: U+3000-9FFF, U+FF00-FFEF;
              font-display: swap;
            }
            
            html { 
              font-family: var(--font-noto-sans-jp), 'Noto Sans JP Fallback', system-ui, sans-serif; 
            }
            
            .font-noto-sans-jp { 
              font-family: var(--font-noto-sans-jp), 'Noto Sans JP Fallback', sans-serif; 
            }
            
            /* フォント読み込み中のレイアウトシフト防止 */
            body {
              font-synthesis: none;
              text-rendering: optimizeLegibility;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
          `,
          }}
        />
      </head>
      <body className={`antialiased`}>
        <QueryProvider>
          <AuthProvider>
            {children}
            {/* <StagewiseToolbarClient /> */}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
