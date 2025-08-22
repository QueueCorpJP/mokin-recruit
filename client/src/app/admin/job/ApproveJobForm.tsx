'use client';

import { useState } from 'react';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { approveJob } from './actions';

interface ApproveJobFormProps {
  jobId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApproveJobForm({ jobId, onClose, onSuccess }: ApproveJobFormProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setIsApproving(true);
    setError(null);
    
    try {
      const result = await approveJob(jobId);
      
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || '承認に失敗しました');
      }
    } catch (error) {
      setError('承認に失敗しました');
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold mb-4">求人を承認しますか？</h2>
        <p className="text-gray-600 mb-6">
          この求人を承認すると公開状態になります。
        </p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <AdminButton
            text="キャンセル"
            onClick={onClose}
            disabled={isApproving}
          />
          <AdminButton
            text={isApproving ? '承認中...' : '承認する'}
            variant="green-gradient"
            onClick={handleApprove}
            disabled={isApproving}
          />
        </div>
      </div>
    </div>
  );
}