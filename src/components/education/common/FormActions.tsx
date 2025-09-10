import { Button } from '@/components/ui/button';
import React from 'react';

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: (e?: React.FormEvent) => void;
  isSubmitting: boolean;
  variant?: 'pc' | 'sp';
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onSubmit,
  isSubmitting,
  variant = 'pc',
}) => {
  const containerClass =
    variant === 'pc'
      ? 'flex justify-center gap-4'
      : 'flex gap-4 w-full justify-center';
  const buttonClass =
    variant === 'pc'
      ? 'min-w-[160px] text-[16px] tracking-[1.6px]'
      : 'basis-0 grow min-w-40 text-[16px] tracking-[1.6px] text-center';

  return (
    <div className={containerClass}>
      <Button
        type='button'
        variant='green-outline'
        size='figma-default'
        onClick={onCancel}
        className={buttonClass}
      >
        キャンセル
      </Button>
      <Button
        type='submit'
        variant='green-gradient'
        size='figma-default'
        disabled={isSubmitting}
        className={
          buttonClass + ' disabled:opacity-50 disabled:cursor-not-allowed'
        }
      >
        {isSubmitting ? '保存中...' : '保存する'}
      </Button>
    </div>
  );
};
