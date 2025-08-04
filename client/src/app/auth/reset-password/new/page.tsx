import { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import NewPasswordServerComponent from './NewPasswordServerComponent';

export const metadata: Metadata = {
  title: 'パスワードの再設定 - 新しいパスワード設定 | CuePoint',
  description: 'パスワードリセット用の新しいパスワードを設定します',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

interface NewPasswordPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

// Server Component (メタデータ、SEO、静的コンテンツ)
export default function NewPasswordPage({ searchParams }: NewPasswordPageProps) {
  return (
    <Suspense fallback={<div className='min-h-screen flex items-center justify-center'>読み込み中...</div>}>
      <NewPasswordServerComponent searchParams={searchParams} />
    </Suspense>
  );
}
