'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// Client Component (インタラクティブ機能)
export function ResetPasswordCompleteContent() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push('/auth/login');
  };

  const handleHomeRedirect = () => {
    router.push('/');
  };

  return (
    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
      <Button
        onClick={handleLoginRedirect}
        className='bg-[#0F9058] text-white px-8 py-3 rounded-md hover:bg-[#0D7A4A] transition-colors'
      >
        ログインページへ
      </Button>
      <Button
        onClick={handleHomeRedirect}
        variant='outline'
        className='border border-[#0F9058] text-[#0F9058] px-8 py-3 rounded-md hover:bg-[#0F9058] hover:text-white transition-colors'
      >
        ホームページへ
      </Button>
    </div>
  );
}
