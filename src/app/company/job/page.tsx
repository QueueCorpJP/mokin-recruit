import JobServerComponent from './JobServerComponent';

interface PageProps {
  searchParams: Promise<{
    status?: string;
    groupId?: string;
    scope?: string;
    search?: string;
  }>;
}

export default async function CompanyJobsPage({ searchParams }: PageProps) {
  const { requireCompanyAuthForAction } = await import('@/lib/auth/server');
  const authResult = await requireCompanyAuthForAction();

  if (!authResult.success) {
    return (
      <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
        <main className='w-full max-w-[1280px] mx-auto'>
          <p>認証が必要です。</p>
        </main>
      </div>
    );
  }

  return <JobServerComponent searchParams={searchParams} />;
}

// ISR設定 - 30秒間キャッシュし、その後バックグラウンドで再生成
export const revalidate = 30;
