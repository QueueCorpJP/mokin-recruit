import JobDetailClient from './JobDetailClient';
import { getJobDetail } from '../actions';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    job_id: string;
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const result = await getJobDetail(params.job_id);
  
  if (!result.success) {
    notFound();
  }

  return <JobDetailClient jobData={result.data} />;
}
