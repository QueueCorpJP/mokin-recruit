import React from 'react';
import type { CandidateData } from './CandidateCard';

interface Props {
  candidate: CandidateData;
}

const CandidateDetailTabDetail: React.FC<Props> = ({ candidate }) => {
  return (
    <div style={{ padding: 24 }}>
      <div>詳細情報タブの内容（仮）</div>
      <pre style={{ fontSize: 12, color: '#888' }}>
        {JSON.stringify(candidate, null, 2)}
      </pre>
    </div>
  );
};

export default CandidateDetailTabDetail;
