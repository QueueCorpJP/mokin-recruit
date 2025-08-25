import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfileActionButtonsProps {
  isSubmitting: boolean;
  handleCancel: () => void;
  isMobile?: boolean;
}

const ProfileActionButtons: React.FC<ProfileActionButtonsProps> = ({
  isSubmitting,
  handleCancel,
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
      キャンセル
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
      {isSubmitting ? '保存中...' : '保存する'}
    </Button>
  </div>
);

export default ProfileActionButtons;
