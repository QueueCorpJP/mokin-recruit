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
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SetPasswordPage({ searchParams }: SetPasswordPageProps) {
  return (
    <Suspense fallback={<div className='min-h-screen flex items-center justify-center'>読み込み中...</div>}>
      <SetPasswordServerComponent searchParams={searchParams} />
    </Suspense>
  );
}