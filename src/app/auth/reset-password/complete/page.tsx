import { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { UserTypeBasedResetPasswordCompletePage } from '@/components/auth/UserTypeBasedResetPasswordCompletePage';

export const metadata: Metadata = {
  title: 'パスワード再設定完了 | CuePoint',
  description: 'パスワードの再設定が完了しました',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};


// Server Component (メタデータ、SEO、静的コンテンツ)
export default function ResetPasswordCompletePage() {
  return (
    <Suspense fallback={<div className='min-h-screen flex items-center justify-center'>読み込み中...</div>}>
      <UserTypeBasedResetPasswordCompletePage />
    </Suspense>
  );
}
