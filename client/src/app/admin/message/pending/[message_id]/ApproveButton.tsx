'use client';

import { useState } from 'react';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { useRouter } from 'next/navigation';
import MessageApprovalModal from '../MessageApprovalModal';

interface ApproveButtonProps {
  messageId: string;
  currentStatus?: '未対応' | '承認' | '非承認';
}

export default function ApproveButton({ messageId, currentStatus = '未対応' }: ApproveButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const router = useRouter();

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleStatusChange = async (status: '承認' | '非承認', reason: string, comment: string) => {
    setIsApproving(true);
    try {
      // TODO: 実際のステータス変更処理をここに実装
      console.log('Changing message status:', messageId, 'Status:', status, 'Reason:', reason, 'Comment:', comment);
      // ステータス変更処理後の自動遷移は行わない（モーダルのボタンで遷移）
      // setTimeout(() => {
      //   router.push('/admin/message/pending');
      // }, 1000);
    } catch (error) {
      console.error('Error changing message status:', error);
      setIsApproving(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <AdminButton
        className="mt-[20px]"
        variant="green-square"
        text="メッセージステータスを変更"
        onClick={handleOpenModal}
      />
      
      <MessageApprovalModal
        isOpen={showModal}
        onClose={handleCancel}
        onStatusChange={handleStatusChange}
        isProcessing={isApproving}
        currentStatus={currentStatus}
      />
    </>
  );
}