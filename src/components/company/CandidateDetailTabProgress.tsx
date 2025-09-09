import React from 'react';
import type { CandidateData } from './CandidateCard';

interface Props {
  candidate: CandidateData;
}

const CandidateDetailTabProgress: React.FC<Props> = ({ candidate }) => {
  return (
    <div style={{ padding: 24 }}>
      <div>進捗・メモタブの内容（仮）</div>
      <pre style={{ fontSize: 12, color: '#888' }}>
        {JSON.stringify(candidate, null, 2)}
      </pre>
    </div>
  );
};

export default CandidateDetailTabProgress;
