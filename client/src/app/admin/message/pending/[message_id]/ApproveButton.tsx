'use client';
import { useState } from 'react';
import { updateMessageApprovalStatus } from './actions';
import MessageApprovalModal from '../MessageApprovalModal';
import { AdminButton } from '@/components/admin/ui/AdminButton';

interface ApproveButtonProps {
  messageId: string;
  currentStatus?: '未対応' | '承認' | '非承認';
}

export default function ApproveButton({ messageId, currentStatus = '未対応' }: ApproveButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AdminButton
        text="メッセージ承認する"
        onClick={() => setIsOpen(true)}
        className="mt-4"
      />
      <MessageApprovalModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onStatusChange={async (status, reason, comment) =>
          await updateMessageApprovalStatus(messageId, status, reason, comment)
        }
        currentStatus={currentStatus}
      />
    </>
  );
}