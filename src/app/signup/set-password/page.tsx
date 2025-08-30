import { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import SetPasswordServerComponent from './SetPasswordServerComponent';

export const metadata: Metadata = {
  title: 'パスワードの再設定 - 新しいパスワード設定 | CuePoint',
  description: 'パスワードリセット用の新しいパスワードを設定します',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

interface SetPasswordPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SetPasswordPage({ searchParams }: SetPasswordPageProps) {
  const params = await searchParams;
  return (
    <Suspense fallback={<div className='min-h-screen flex items-center justify-center'>読み込み中...</div>}>
      <SetPasswordServerComponent searchParams={params} />
    </Suspense>
  );
}