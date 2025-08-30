import { CandidateProvider } from '@/contexts/CandidateContext';

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CandidateProvider>
      {children}
    </CandidateProvider>
  );
}