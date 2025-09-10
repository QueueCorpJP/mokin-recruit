import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  cancelLabel?: string;
  submitLabel?: string;
}

/**
 * [FormActions]
 * キャンセル・保存ボタンの配置を共通化するコンポーネント。
 * - onCancel: キャンセル時のハンドラ
 * - isSubmitting: 保存中かどうか
 * - cancelLabel: キャンセルボタンのラベル
 * - submitLabel: 保存ボタンのラベル
 */
const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isSubmitting,
  cancelLabel = 'キャンセル',
  submitLabel = '保存する',
}) => {
  return (
    <div className='flex gap-4 w-full lg:w-auto'>
      <Button
        type='button'
        variant='green-outline'
        size='figma-default'
        onClick={onCancel}
        disabled={isSubmitting}
        className='min-w-[160px] flex-1 lg:flex-none text-[16px] tracking-[1.6px]'
      >
        {cancelLabel}
      </Button>
      <Button
        type='submit'
        variant='green-gradient'
        size='figma-default'
        disabled={isSubmitting}
        className='min-w-[160px] flex-1 lg:flex-none text-[16px] tracking-[1.6px]'
      >
        {isSubmitting ? '保存中...' : submitLabel}
      </Button>
    </div>
  );
};

export default FormActions;