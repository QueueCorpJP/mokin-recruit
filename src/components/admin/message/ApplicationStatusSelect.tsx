'use client';
import React, { useState } from 'react';
import { SelectInput } from '@/components/ui/select-input';

interface ApplicationStatusSelectProps {
  candidateId?: string | null;
  jobPostingId?: string | null;
  currentStatus: string;
}

const statusOptions = [
  { value: 'SENT', label: '書類提出' },
  { value: 'read', label: '書類確認済み' },
  { value: 'RESPONDED', label: '面接調整中' },
  { value: 'REJECTED', label: '不採用' },
];

export const ApplicationStatusSelect: React.FC<ApplicationStatusSelectProps> = ({
  candidateId,
  jobPostingId,
  currentStatus
}) => {
  const [status, setStatus] = useState(currentStatus);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    // TODO: API call to update status
  };

  return (
    <SelectInput
      options={statusOptions}
      value={status}
      onChange={handleStatusChange}
      className="w-[200px]"
      style={{
        fontFamily: "'Noto Sans JP', sans-serif",
        fontSize: '16px',
        fontWeight: 500,
        lineHeight: 2,
        letterSpacing: '1.6px'
      }}
    />
  );
};