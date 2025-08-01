import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import './globals.css';

// サーバーサイド初期化の実行
import '@/lib/server/container/bindings';

// Providers
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthInitializer } from '../components/AuthInitializer';
import { AuthAwareNavigation } from '../components/layout/AuthAwareNavigation';
import { AuthAwareFooter } from '../components/layout/AuthAwareFooter';

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
  preload: false,
  variable: '--font-noto-sans-jp',
  weight: ['400', '500', '700'],
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

        {/* Preconnect */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />

        {/* Critical CSS - レスポンシブ対応のちらつき防止 */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            html { 
              font-family: var(--font-noto-sans-jp), system-ui, sans-serif; 
            }
            .font-noto-sans-jp { 
              font-family: var(--font-noto-sans-jp), sans-serif; 
            }
          `,
          }}
        />
      </head>
      <body className={`antialiased`}>
        <QueryProvider>
          <AuthInitializer />
          <AuthAwareNavigation />
          {children}
          <AuthAwareFooter />
        </QueryProvider>
      </body>
    </html>
  );
}
