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

export const dynamic = 'force-dynamic';
