'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/mo-dal';
import { Input } from '../ui/input';

interface GroupNameChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newGroupName: string) => void;
  currentGroupName?: string;
}

export function GroupNameChangeModal({
  isOpen,
  onClose,
  onConfirm,
  currentGroupName = '',
}: GroupNameChangeModalProps) {
  const [groupName, setGroupName] = useState('');

  const handleConfirm = () => {
    if (groupName.trim()) {
      onConfirm(groupName.trim());
    }
  };

  const handleClose = () => {
    setGroupName('');
    onClose();
  };

  return (
    <Modal
      title='グループ名変更'
      isOpen={isOpen}
      onClose={handleClose}
      primaryButtonText='保存'
      onPrimaryAction={handleConfirm}
      secondaryButtonText='キャンセル'
      onSecondaryAction={handleClose}
      width='760px'
      height='auto'
    >
      <div className='flex flex-col py-10 min-h-[240px] max-h-[400px] w-full justify-center items-center'>
        {/* Input form section*/}
        <div className='flex flex-row gap-4 items-center justify-center items-center w-full'>
          {/* Label */}
          <div className='flex items-center justify-start pb-6 px-0 shrink-0'>
            <div className="font-['Noto_Sans_JP'] text-[16px] font-bold leading-[2] tracking-[1.6px] text-[#323232] whitespace-nowrap">
              グループ名
            </div>
          </div>

          {/* Input field and description */}
          <div className='flex flex-col gap-2 w-[400px]'>
            <Input
              type='text'
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              placeholder='グループ名を入力'
              className="w-full font-['Noto_Sans_JP'] text-[16px] font-medium leading-[2] tracking-[1.6px] border-[#999999] rounded-[5px] px-[11px] py-0 h-[42px] placeholder:text-[#999999]"
            />

            {/* Description */}
            <div className="font-['Noto_Sans_JP'] text-[14px] font-medium leading-[1.6] tracking-[1.4px] text-[#999999] w-full flex justify-start items-start text-center">
              グループ名は候補者にも公開されます。
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
