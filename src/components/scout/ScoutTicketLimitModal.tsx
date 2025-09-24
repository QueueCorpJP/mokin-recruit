'use client';

import React from 'react';
import { Modal } from '@/components/ui/mo-dal';
import { Button } from '@/components/ui/button';

interface ScoutTicketLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseTicket: () => void;
}

export const ScoutTicketLimitModal: React.FC<ScoutTicketLimitModalProps> = ({
  isOpen,
  onClose,
  onPurchaseTicket,
}) => {
  return (
    <Modal
      title='スカウト送信ができません'
      isOpen={isOpen}
      onClose={onClose}
      width='720px'
      height='auto'
      overlayBgColor='rgba(0,0,0,0.4)'
      hideFooter={false}
      primaryButtonText='チケットを追加購入する'
      onPrimaryAction={onPurchaseTicket}
    >
      <div className='flex flex-col gap-6 w-full min-h-60 items-center justify-center'>
        {/* メッセージ */}
        <div className='content-stretch flex flex-col gap-2 items-start justify-start relative shrink-0 w-full'>
          <div className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[1.6] not-italic relative shrink-0 text-[#323232] text-[18px] text-center tracking-[1.8px] w-full">
            <p className='mb-0'>
              スカウト送信可能数の上限に達したため、スカウトを送信できません。
            </p>
            <p className=''>
              引き続きスカウトを送信するには、追加チケットをご購入ください。
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
