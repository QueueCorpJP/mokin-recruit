import CandidateApplicationServerComponent from './CandidateApplicationServerComponent';

interface CandidateSearchSettingConfirmPageProps {
  params: Promise<{ id: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CandidateSearchSettingConfirmPage({
  params,
  searchParams
}: CandidateSearchSettingConfirmPageProps) {
  const resolvedParams = await params;
  return <CandidateApplicationServerComponent params={resolvedParams} searchParams={searchParams} />;
}