import type { Metadata } from 'next';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import './globals.css';

// サーバーサイド初期化の実行
import '@/lib/server/container/bindings';

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
});

export const metadata: Metadata = {
  title: 'Mokin Recruit - 転職プラットフォーム',
  description: '転職活動を効率化するプラットフォーム',
  keywords: ['転職', '求人', 'スカウト', 'プラットフォーム'],
  authors: [{ name: 'Mokin Recruit Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Mokin Recruit - 転職プラットフォーム',
    description: '転職活動を効率化するプラットフォーム',
    type: 'website',
    locale: 'ja_JP',
  },
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

        {/* Critical CSS */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            html { font-family: var(--font-inter), system-ui, sans-serif; }
            .font-noto-sans-jp { font-family: var(--font-noto-sans-jp), sans-serif; }
          `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
