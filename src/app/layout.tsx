import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import './globals.css';

// Image constructor polyfill
import '@/lib/image-polyfill';

// Stagewise Toolbar (development only)
// import StagewiseToolbarClient from './stagewise-toolbar-client';

// NOTE: DI Container initialization moved to API routes for better performance
// Previously: import '@/lib/server/container/bindings';

// Providers - 並列読み込み用に最適化
import { CombinedProviders } from '@/providers/CombinedProviders';
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

// フォント最適化 - 遅延読み込み戦略
const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
  preload: false, // 初回読み込み高速化
  variable: '--font-noto-sans-jp',
  weight: ['400', '700'], // 重要な重みのみ
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial', 'sans-serif'],
});

// Interは削除（システムフォントで代用）

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
    <html lang='ja' className={`${notoSansJP.variable}`}>
      <head>
        {/* DNS Prefetch - 遅延で必要時のみ */}
        <link rel='dns-prefetch' href='//fonts.googleapis.com' />
        <link rel='dns-prefetch' href='//fonts.gstatic.com' />
        

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
              font-family: var(--font-noto-sans-jp), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
            }
            
            .font-noto-sans-jp { 
              font-family: var(--font-noto-sans-jp), system-ui, sans-serif; 
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
        <CombinedProviders>
          {children}
          {/* <StagewiseToolbarClient /> */}
        </CombinedProviders>
      </body>
    </html>
  );
}
