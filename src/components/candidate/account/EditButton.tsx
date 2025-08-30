'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface EditButtonProps {
  editPath: string;
}

export default function EditButton({ editPath }: EditButtonProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(editPath);
  };

  return (
    <div className="flex justify-center mt-6 lg:mt-10">
      <Button
        variant="green-gradient"
        size="figma-default"
        onClick={handleEdit}
        className="min-w-[160px] w-full lg:w-auto text-[16px] tracking-[1.6px]"
      >
        編集する
      </Button>
    </div>
  );
}