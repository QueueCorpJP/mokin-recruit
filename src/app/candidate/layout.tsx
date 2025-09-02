import { Suspense } from 'react';
import CandidateLayoutClient from './CandidateLayoutClient';

export const dynamic = 'force-dynamic';

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <div className="h-[80px] bg-white border-b border-gray-200" />
          <div className="animate-pulse bg-gray-100 h-4 w-full" />
          <div className="min-h-[200px] bg-[#323232]" />
        </div>
      }
    >
      <CandidateLayoutClient>{children}</CandidateLayoutClient>
    </Suspense>
  );
}