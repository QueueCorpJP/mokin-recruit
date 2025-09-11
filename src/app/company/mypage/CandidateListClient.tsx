'use client';

import React, { useState } from 'react';
import { CandidateCard, CandidateData } from '@/components/company/CandidateCard';
import { CandidateSlideMenu } from '../recruitment/detail/CandidateSlideMenu';

interface CandidateListClientProps {
  candidates: CandidateData[];
  showActions?: boolean;
  companyGroupId?: string;
  jobOptions?: Array<{ value: string; label: string; groupId?: string }>;
}

export function CandidateListClient({ 
  candidates: initialCandidates, 
  showActions = true,
  companyGroupId,
  jobOptions = []
}: CandidateListClientProps) {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const togglePickup = (id: number) => {
    setCandidates(prev =>
      prev.map(c => (c.id === id ? { ...c, isPickup: !c.isPickup } : c))
    );
  };

  const toggleHidden = (id: number) => {
    setCandidates(prev =>
      prev.map(c => (c.id === id ? { ...c, isHidden: !c.isHidden } : c))
    );
  };

  const handleCandidateClick = (candidate: CandidateData) => {
    setSelectedCandidate(candidate);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedCandidate(null);
  };

  const handleJobChange = (candidateId: string, jobId: string) => {
    // Job change logic if needed
  };

  return (
    <>
      <div className="space-y-2">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onTogglePickup={togglePickup}
            onToggleHidden={toggleHidden}
            onCandidateClick={handleCandidateClick}
            showActions={showActions}
          />
        ))}
      </div>

      <CandidateSlideMenu
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        candidateId={selectedCandidate?.id.toString()}
        candidateData={selectedCandidate}
        companyGroupId={companyGroupId}
        jobOptions={jobOptions}
        onJobChange={handleJobChange}
      />
    </>
  );
}