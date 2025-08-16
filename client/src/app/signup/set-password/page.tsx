import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'パスワード設定 | CuePoint',
  description: 'サインアップ後のパスワード設定ページ',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function SetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">パスワード設定ページ</h1>
        <p className="text-gray-600">こちらはまだ作成されていないページです。</p>
        <p className="text-gray-600">後でパスワード設定機能を実装予定です。</p>
      </div>
    </div>
  );
}