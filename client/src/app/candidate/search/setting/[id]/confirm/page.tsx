import CandidateApplicationServerComponent from './CandidateApplicationServerComponent';

interface CandidateSearchSettingConfirmPageProps {
  params: Promise<{ id: string }>;
}

export default async function CandidateSearchSettingConfirmPage({
  params
}: CandidateSearchSettingConfirmPageProps) {
  const resolvedParams = await params;
  return <CandidateApplicationServerComponent params={resolvedParams} />;
}