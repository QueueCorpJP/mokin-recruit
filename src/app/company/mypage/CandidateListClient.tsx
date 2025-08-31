'use client';

import React, { useState } from 'react';
import { CandidateCard, CandidateData } from '@/components/company/CandidateCard';

interface CandidateListClientProps {
  candidates: CandidateData[];
  showActions?: boolean;
}

export function CandidateListClient({ candidates: initialCandidates, showActions = true }: CandidateListClientProps) {
  const [candidates, setCandidates] = useState(initialCandidates);

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

  return (
    <div className="space-y-2">
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          onTogglePickup={togglePickup}
          onToggleHidden={toggleHidden}
          showActions={showActions}
        />
      ))}
    </div>
  );
}