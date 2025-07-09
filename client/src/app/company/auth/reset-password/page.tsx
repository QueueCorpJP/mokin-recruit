import { Metadata, Viewport } from 'next';
import { Navigation } from '@/components/ui/navigation';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: '企業パスワード再設定 | CuePoint',
  description:
    '企業アカウントのパスワードをリセットするためのメールを送信します',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function CompanyResetPasswordPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#17856F] to-[#229A4E] flex flex-col'>
      <Navigation />
      <main className='flex-1 flex items-center justify-center px-4 py-12'>
        <div className='relative w-full max-w-[800px] bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-8 md:p-12 lg:p-20'>
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              企業パスワード再設定
            </h1>
            <p className='text-gray-600'>
              登録されたメールアドレスにパスワード再設定リンクを送信します
            </p>
          </div>
          <ForgotPasswordForm userType='company' />
        </div>
      </main>
    </div>
  );
}
