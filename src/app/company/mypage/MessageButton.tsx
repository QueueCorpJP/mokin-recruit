'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function MessageButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/company/message');
  };

  return (
    <Button
      variant='green-outline'
      size='lg'
      onClick={handleClick}
      style={{
        paddingLeft: 40,
        paddingRight: 40,
        height: 60,
        borderRadius: '999px',
      }}
    >
      メッセージ一覧
    </Button>
  );
}