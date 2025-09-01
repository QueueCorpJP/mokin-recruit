import JobServerComponent from './JobServerComponent';

interface PageProps {
  searchParams: Promise<{
    status?: string;
    groupId?: string;
    scope?: string;
    search?: string;
  }>;
}

export default function CompanyJobsPage({ searchParams }: PageProps) {
  return <JobServerComponent searchParams={searchParams} />;
}

// ISR設定 - 30秒間キャッシュし、その後バックグラウンドで再生成
export const revalidate = 30;
