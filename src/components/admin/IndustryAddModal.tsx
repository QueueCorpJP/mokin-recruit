'use client';

import React from 'react';
import { AdminModal } from './ui/AdminModal';

interface IndustryAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (industryName: string) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
}

export const IndustryAddModal: React.FC<IndustryAddModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  inputValue,
  onInputChange,
}) => {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title='新規オリジナル業種追加'
      description='新しいオリジナル業種名を入力してください'
      inputValue={inputValue}
      onInputChange={onInputChange}
      confirmText='追加する'
      cancelText='閉じる'
      placeholder='業種名を入力してください'
      showInput={true}
    />
  );
};
