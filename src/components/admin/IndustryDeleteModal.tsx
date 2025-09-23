'use client';

import React from 'react';
import { AdminModal } from './ui/AdminModal';

interface IndustryDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  industryName: string;
}

export const IndustryDeleteModal: React.FC<IndustryDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  industryName,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title='オリジナル業種削除'
      description={`${industryName}\n\nこのオリジナル業種を削除してよいですか？`}
      inputValue=''
      onInputChange={() => {}}
      confirmText='削除する'
      cancelText='閉じる'
      showInput={false}
    />
  );
};
