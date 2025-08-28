import React from 'react';
import { CandidateItem, Candidate } from './CandidateItem';

interface CandidateListProps {
  candidates: Candidate[];
}

export const CandidateList: React.FC<CandidateListProps> = ({ candidates }) => (
  <div className='mt-6 bg-[#EFEFEF] rounded-lg p-6'>
    {candidates.map(c => (
      <CandidateItem key={c.id} candidate={c} />
    ))}
  </div>
);
