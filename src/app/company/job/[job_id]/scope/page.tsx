import { getJobDetail } from '../../actions';
import JobScopeClient from './JobScopeClient';

interface PageProps {
  params: {
    job_id: string;
  };
}

export default async function JobScopePage({ params }: PageProps) {
  const jobId = params.job_id;

  // 求人データを取得
  const jobResult = await getJobDetail(jobId);

  if (!jobResult.success) {
    throw new Error(jobResult.error);
  }

  return (
    <JobScopeClient 
      jobData={jobResult.data}
      jobId={jobId}
    />
  );
}