'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AdminConfirmModal } from '@/components/admin/ui/AdminConfirmModal';
import JobApprovalCompleteModal from '@/components/admin/JobApprovalCompleteModal';

interface PendingJobDetailActionsProps {
  jobId: string;
  showLabels?: boolean;
}

export function PendingJobDetailActions({
  jobId,
  showLabels = false,
}: PendingJobDetailActionsProps) {
  const router = useRouter();
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [completeOpen, setCompleteOpen] = useState<null | 'approve' | 'reject'>(
    null
  );

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const { approveJob } = await import('../actions');
      const result = await approveJob(jobId);

      if (!result.success) {
        throw new Error(result.error || '承認に失敗しました');
      }

      setCompleteOpen('approve');
    } catch (e: any) {
      alert(e.message || '承認に失敗しました');
    } finally {
      setIsApproving(false);
      setApproveModalOpen(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      const { rejectJob } = await import('../actions');
      const result = await rejectJob(jobId);

      if (!result.success) {
        throw new Error(result.error || '却下に失敗しました');
      }

      setCompleteOpen('reject');
    } catch (e: any) {
      alert(e.message || '却下に失敗しました');
    } finally {
      setIsRejecting(false);
      setRejectModalOpen(false);
    }
  };

  return (
    <>
      <div className='flex gap-3'>
        <Button
          variant='green-gradient'
          size='figma-default'
          className='px-6 py-2 rounded-[32px] bg-gradient-to-r from-[#198D76] to-[#1CA74F] text-white'
          onClick={() => setApproveModalOpen(true)}
        >
          {showLabels ? 'この求人を承認' : '承認'}
        </Button>
        <Button
          variant='destructive'
          size='figma-outline'
          className='px-6 py-2 rounded-[32px] bg-red-500 text-white hover:bg-red-600'
          onClick={() => setRejectModalOpen(true)}
        >
          {showLabels ? 'この求人を却下' : '却下'}
        </Button>
      </div>

      <AdminConfirmModal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        onConfirm={handleApprove}
        title='求人承認'
        description='この求人を承認しますか？'
        confirmText={isApproving ? '承認中...' : '承認する'}
        cancelText='キャンセル'
        variant='approve'
      />

      <AdminConfirmModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleReject}
        title='求人却下'
        description='この求人を却下しますか？'
        confirmText={isRejecting ? '却下中...' : '却下する'}
        cancelText='キャンセル'
      />

      <JobApprovalCompleteModal
        isOpen={completeOpen !== null}
        onClose={() => {
          setCompleteOpen(null);
          router.push('/admin/job/pending');
          router.refresh();
        }}
        action={completeOpen === 'approve' ? 'approve' : 'reject'}
        count={1}
      />
    </>
  );
}
