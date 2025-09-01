'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import JobEditConfirmClient from '../JobEditConfirmClient';

interface JobData {
  id: string;
  title: string;
  jobDescription: string;
  positionSummary: string;
  requiredSkills: string;
  preferredSkills: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryNote: string;
  employmentType: string;
  workLocation: string[];
  locationNote: string;
  employmentTypeNote: string;
  workingHours: string;
  overtimeInfo: string;
  holidays: string;
  remoteWorkAvailable: boolean;
  jobType: string[];
  industry: string[];
  selectionProcess: string;
  appealPoints: string[];
  smokingPolicy: string;
  smokingPolicyNote: string;
  requiredDocuments: string[];
  internalMemo: string;
  publicationType: string;
  imageUrls: string[];
  groupName: string;
  groupId: string;
  status: string;
  applicationDeadline: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

interface JobEditConfirmPageClientProps {
  jobData: JobData;
  jobId: string;
}

export default function JobEditConfirmPageClient({ jobData, jobId }: JobEditConfirmPageClientProps) {
  const router = useRouter();
  const [editData, setEditData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // sessionStorageから編集データを取得
    try {
      const savedEditData = sessionStorage.getItem(`editData-${jobId}`);
      if (savedEditData) {
        const parsedEditData = JSON.parse(savedEditData);
        setEditData(parsedEditData);
      } else {
        // データがない場合は編集画面に戻る
        router.push(`/company/job/${jobId}/edit`);
        return;
      }
    } catch (error) {
      console.error('Failed to load edit data:', error);
      router.push(`/company/job/${jobId}/edit`);
      return;
    }
    setLoading(false);
  }, [jobId, router]);

  const handleBackToEdit = () => {
    // 編集画面に戻る（sessionStorageのデータは保持）
    router.push(`/company/job/${jobId}/edit`);
  };

  if (loading || !editData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>データを読み込んでいます...</div>
      </div>
    );
  }

  return (
    <JobEditConfirmClient 
      jobData={jobData}
      jobId={jobId}
      editData={editData}
      onBackToEdit={handleBackToEdit}
    />
  );
}