import React from 'react';
import { Button } from '@/components/ui/button';

/**
 * 共通ActionButtons部品
 * - isSubmitting: 送信中フラグ
 * - handleCancel: キャンセル時のコールバック
 * - submitLabel: 送信ボタンのラベル（省略時は「保存する」）
 * - cancelLabel: キャンセルボタンのラベル（省略時は「キャンセル」）
 * - isMobile: モバイル用レイアウトフラグ
 */
export interface ActionButtonsProps {
  isSubmitting: boolean;
  handleCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isMobile?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isSubmitting,
  handleCancel,
  submitLabel = '保存する',
  cancelLabel = 'キャンセル',
  isMobile,
}) => (
  <div
    className={
      isMobile
        ? 'flex gap-4 w-full justify-center'
        : 'flex justify-center gap-4'
    }
  >
    <Button
      type='button'
      variant='green-outline'
      size='figma-default'
      onClick={handleCancel}
      className={
        isMobile
          ? 'basis-0 grow min-w-40 text-[16px] tracking-[1.6px] text-center'
          : 'min-w-[160px] text-[16px] tracking-[1.6px]'
      }
    >
      {cancelLabel}
    </Button>
    <Button
      type='submit'
      variant='green-gradient'
      size='figma-default'
      disabled={isSubmitting}
      className={
        isMobile
          ? 'basis-0 grow min-w-40 text-[16px] tracking-[1.6px] text-center disabled:opacity-50 disabled:cursor-not-allowed'
          : 'min-w-[160px] text-[16px] tracking-[1.6px] disabled:opacity-50 disabled:cursor-not-allowed'
      }
    >
      {isSubmitting ? '保存中...' : submitLabel}
    </Button>
  </div>
);

export default ActionButtons;
