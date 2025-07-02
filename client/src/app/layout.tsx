import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// サーバーサイド初期化の実行
import '@/lib/server/container/bindings';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mokin Recruit - 転職プラットフォーム',
  description: '転職活動を効率化するプラットフォーム',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ja'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
