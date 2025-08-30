'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function EditButton() {
  const router = useRouter();

  const handleEdit = () => {
    router.push('/candidate/account/profile/edit');
  };

  return (
    <div className="flex justify-center mt-6 lg:mt-10">
      <Button
        variant="green-gradient"
        size="figma-default"
        className="min-w-[160px] w-full lg:w-auto text-[16px] tracking-[1.6px]"
        onClick={handleEdit}
      >
        編集する
      </Button>
    </div>
  );
}