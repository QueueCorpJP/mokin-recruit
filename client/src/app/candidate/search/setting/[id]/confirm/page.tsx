import CandidateApplicationServerComponent from './CandidateApplicationServerComponent';

interface CandidateSearchSettingConfirmPageProps {
  params: Promise<{ id: string }>;
}

export default async function CandidateSearchSettingConfirmPage({
  params
}: CandidateSearchSettingConfirmPageProps) {
  return <CandidateApplicationServerComponent params={params} />;
}