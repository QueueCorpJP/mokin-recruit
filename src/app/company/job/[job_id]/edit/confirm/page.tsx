import { getJobDetail } from '../../../actions';
import JobEditConfirmPageClient from './JobEditConfirmPageClient';

interface PageProps {
  params: {
    job_id: string;
  };
}

export default async function JobEditConfirmPage({ params }: PageProps) {
  const jobId = params.job_id;

  // 求人データを取得
  const jobResult = await getJobDetail(jobId);

  if (!jobResult.success || !jobResult.data) {
    throw new Error(jobResult.error || 'Job data not found');
  }

  return <JobEditConfirmPageClient jobData={jobResult.data} jobId={jobId} />;
}
