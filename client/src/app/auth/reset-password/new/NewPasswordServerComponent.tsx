import { NewPasswordClient } from './NewPasswordClient';
import { CandidateAuthBackground } from '@/components/ui/candidate-auth-background';

interface NewPasswordServerComponentProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function NewPasswordServerComponent({ searchParams }: NewPasswordServerComponentProps) {
  // サーバーサイドでユーザータイプを検出
  const userTypeParam = searchParams?.userType;
  const userType = userTypeParam === 'candidate' || userTypeParam === 'company' ? userTypeParam : 'company';

  // 候補者の場合のローディング画面コンポーネント
  function CandidateLoadingScreen({ message = '読み込み中...' }: { message?: string }) {
    return (
      <div className='relative w-full max-w-[480px] md:max-w-[800px] mx-auto bg-white rounded-[20px] md:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-6 md:px-[80px] py-10 md:py-[80px]'>
        <div className='text-center space-y-6'>
          <h1 className='text-[#0F9058] font-bold text-[24px] md:text-[32px] leading-[1.6] tracking-[2.4px] md:tracking-[3.2px]'>
            パスワードの再設定
          </h1>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F9058] mx-auto'></div>
          <p className='text-[#323232] font-medium text-[14px] md:text-[16px]'>{message}</p>
        </div>
      </div>
    );
  }

  // 企業ユーザーの場合のローディング画面コンポーネント
  function CompanyLoadingScreen({ message = '読み込み中...' }: { message?: string }) {
    return (
      <div className='relative w-full max-w-[480px] md:max-w-[800px] mx-auto bg-white rounded-[20px] md:rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 md:p-[80px]'>
        <div className='text-center space-y-6'>
          <h1 className='text-[#0F9058] font-bold text-[24px] md:text-[32px] leading-[1.6] md:leading-[51.2px] tracking-[2.4px] md:tracking-[0.1em]'>
            パスワードの再設定
          </h1>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F9058] mx-auto'></div>
          <p className='text-[#323232] font-medium text-[14px] md:text-[16px]'>{message}</p>
        </div>
      </div>
    );
  }

  if (userType === 'candidate') {
    return (
      <CandidateAuthBackground>
        <main className='flex-1 px-4 sm:px-6 md:px-[80px] pt-6 md:pt-[80px] mb-20 lg:mb-0 lg:pb-[460px] flex justify-center items-start relative w-full'>
          <div className='flex justify-center w-full max-w-[480px] md:max-w-[800px] mx-auto'>
            <NewPasswordClient userType="candidate" />
          </div>
        </main>
      </CandidateAuthBackground>
    );
  }

  // デフォルト（company）または不明なユーザータイプの場合も CandidateAuthBackground を使用
  return (
    <CandidateAuthBackground>
      <main className='flex-1 px-4 sm:px-6 md:px-[80px] pt-6 md:pt-[80px] mb-20 lg:mb-0 lg:pb-[460px] flex justify-center items-start relative w-full'>
        <div className='flex justify-center w-full max-w-[480px] md:max-w-[800px]'>
          <NewPasswordClient userType="company" />
        </div>
      </main>
    </CandidateAuthBackground>
  );
}