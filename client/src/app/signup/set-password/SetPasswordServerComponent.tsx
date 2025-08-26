import { SetPasswordClient } from './SetPasswordClient';
import { CandidateAuthBackground } from '@/components/ui/candidate-auth-background';
import { SpinnerIcon } from '@/components/ui/Loading';

interface SetPasswordServerComponentProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function SetPasswordServerComponent({ searchParams }: SetPasswordServerComponentProps) {
  // サーバーサイドでユーザータイプを検出
  const userTypeParam = searchParams?.userType;
  const userType = userTypeParam === 'candidate' || userTypeParam === 'company' ? userTypeParam : 'candidate';

  return (
    <CandidateAuthBackground>
      <main className='flex-1 px-4 sm:px-6 md:px-[80px] pt-6 md:pt-[80px] mb-20 lg:mb-0 lg:pb-[460px] flex justify-center items-start relative w-full'>
        <div className='flex justify-center w-full max-w-[480px] md:max-w-[800px] mx-auto'>
          <SetPasswordClient userType={userType} />
        </div>
      </main>
    </CandidateAuthBackground>
  );
}