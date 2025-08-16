import CompanyRegistrationForm from '@/components/auth/CompanyRegistrationForm';
import Link from 'next/link';

export default function CompanySignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            企業アカウント作成
          </h1>
          <p className="mt-2 text-gray-600">
            企業情報と担当者情報を入力してください
          </p>
        </div>

        <CompanyRegistrationForm />

        <div className="text-center text-sm text-gray-600">
          すでにアカウントをお持ちですか？{' '}
          <Link
            href="/company/auth/login"
            className="text-blue-600 hover:underline"
          >
            ログインはこちら
          </Link>
        </div>

        <div className="text-center text-sm text-gray-600">
          <Link href="/signup" className="text-gray-500 hover:underline">
            ← アカウントタイプ選択に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
