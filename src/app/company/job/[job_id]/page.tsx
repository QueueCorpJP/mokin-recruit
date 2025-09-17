import JobDetailClient from './JobDetailClient';
import { getJobDetail } from '../actions';
import { notFound } from 'next/navigation';
import { requireCompanyAuthForAction } from '@/lib/auth/server';

interface PageProps {
  params: {
    job_id: string;
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const auth = await requireCompanyAuthForAction();
  if (!auth.success) {
    return (
      <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
        <main className='w-full max-w-[1280px] mx-auto'>
          <p>認証が必要です。</p>
        </main>
      </div>
    );
  }
  const result = await getJobDetail(params.job_id);

  if (!result.success) {
    notFound();
  }

  return <JobDetailClient jobData={result.data!} />;
}
