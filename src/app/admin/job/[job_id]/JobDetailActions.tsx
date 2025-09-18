'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { JobApprovalModal } from '@/components/admin/ui/JobApprovalModal';

interface JobDetailActionsProps {
  jobId: string;
  jobTitle: string;
}

export default function JobDetailActions({
  jobId,
  jobTitle,
}: JobDetailActionsProps) {
  const router = useRouter();
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const handleEdit = () => {
    router.push(`/admin/job/${jobId}/edit`);
  };

  const handleApprovalClick = () => {
    setIsApprovalModalOpen(true);
  };

  const handleApprove = async (reason: string, comment: string) => {
    try {
      const { bulkApproveJobs } = await import('../pending/actions');
      const result = await bulkApproveJobs([jobId], reason, comment);

      if (!result.success) {
        throw new Error(result.error || '承認に失敗しました');
      }

      alert('求人を承認しました');
      setIsApprovalModalOpen(false);
      router.refresh();
    } catch (e: any) {
      alert(e.message || '承認に失敗しました');
    }
  };

  const handleReject = async (reason: string, comment: string) => {
    try {
      const { bulkRejectJobs } = await import('../pending/actions');
      const result = await bulkRejectJobs([jobId], reason, comment);

      if (!result.success) {
        throw new Error(result.error || '却下に失敗しました');
      }

      alert('求人を却下しました');
      setIsApprovalModalOpen(false);
      router.refresh();
    } catch (e: any) {
      alert(e.message || '却下に失敗しました');
    }
  };

  return (
    <>
      <div className='flex justify-center gap-4 mt-8 mb-8'>
        <Button
          variant='green-gradient'
          size='figma-default'
          onClick={handleEdit}
        >
          編集する
        </Button>
        <Button
          variant='green-gradient'
          size='figma-default'
          onClick={handleApprovalClick}
        >
          求人承認/非承認
        </Button>
      </div>

      <JobApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        isProcessing={false}
        jobTitle={jobTitle}
      />
    </>
  );
}
