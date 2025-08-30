import CandidateLayoutServer from '../CandidateLayoutServer';

export default function CandidateJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // /candidate/job 配下はSSRで一度だけ候補者認証を行う
  return <CandidateLayoutServer>{children}</CandidateLayoutServer>;
}

