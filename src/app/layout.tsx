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

const FontLoader = dynamic(
  () =>
    import('../components/FontLoader').then(mod => ({
      default: mod.FontLoader,
    })),
  { ssr: false } // クライアントサイドでのみ実行
);

// フォント最適化 - 遅延読み込み後に適用
const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap', // フォールバック表示後にWebフォントに置き換え
  preload: true, // 重要なフォントなので事前読み込みを有効化
  variable: '--font-noto-sans-jp',
  weight: ['300', '400', '500', '600', '700', '800', '900'], // より多くのウェイトを追加
  adjustFontFallback: true, // メトリクス調整を有効化
  fallback: [
    'Hiragino Kaku Gothic ProN',
    'Hiragino Sans',
    'Yu Gothic Medium',
    'Meiryo',
    'MS PGothic',
    'system-ui',
    'sans-serif',
  ],
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
        {/* Critical CSS - レスポンシブ対応のちらつき防止 */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* システムフォントのフォールバック設定 */
            html { 
              font-family: "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic Medium", "Meiryo", "MS PGothic", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
            }
            
            /* Noto Sans JPが読み込まれた後に適用 */
            .font-loaded html,
            .font-loaded body { 
              font-family: var(--font-noto-sans-jp), "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic Medium", "Meiryo", "MS PGothic", system-ui, sans-serif; 
            }
            
            /* フォント読み込み中のレイアウトシフト防止 */
            body {
              font-synthesis: none;
              text-rendering: optimizeLegibility;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            
            /* フォント読み込み状態の管理 */
            .font-loading {
              font-display: swap;
            }
          `,
          }}
        />
      </head>
      <body className={`antialiased`}>
        <FontLoader />
        <CombinedProviders>
          {children}
          {/* <StagewiseToolbarClient /> */}
        </CombinedProviders>
      </body>
    </html>
  );
}
