'use client';

import { useState, useEffect } from 'react';
import { getJobDetails } from './actions';
import CandidateApplicationClient from './CandidateApplicationClient';

interface CandidateApplicationServerComponentProps {
  params: Promise<{ id: string }>;
}

export default function CandidateApplicationServerComponent({
  params
}: CandidateApplicationServerComponentProps) {
  const [jobId, setJobId] = useState<string>('');
  const [jobData, setJobData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // パラメータを取得
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setJobId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  // 求人情報を取得
  useEffect(() => {
    if (!jobId) return;

    const fetchJobData = async () => {
      try {
        const jobResponse = await getJobDetails(jobId);
        
        if (!jobResponse.success || !jobResponse.data) {
          setError(jobResponse.error || '求人情報が見つかりませんでした');
          return;
        }

        const job = jobResponse.data;
        
        // 求人が応募可能な状態かチェック
        if (job.status !== 'PUBLISHED') {
          setError('この求人は現在応募できません。');
          return;
        }

        setJobData(job);
      } catch (error) {
        setError('システムエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobData();
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-xl font-bold text-red-600 mb-4">エラー</h1>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <CandidateApplicationClient
      jobId={jobId}
      jobTitle={jobData.title}
      companyName={jobData.companyName}
      requiredDocuments={jobData.requiredDocuments}
    />
  );
}