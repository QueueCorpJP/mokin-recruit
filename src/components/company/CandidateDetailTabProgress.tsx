import React from 'react';
import type { CandidateData } from './CandidateCard';
import SectionBlock from '../ui/SectionBlock';
import SectionTitle from '../ui/SectionTitle';
import ProgressStatusBox from '../ui/ProgressStatusBox';
import { SelectInput } from '../ui/select-input';
import { useState } from 'react';

interface Props {
  candidate: CandidateData;
}

const jobOptions = [
  { value: 'frontend', label: 'フロントエンドエンジニア' },
  { value: 'backend', label: 'バックエンドエンジニア' },
  { value: 'designer', label: 'UI/UXデザイナー' },
];

const CandidateDetailTabProgress: React.FC<Props> = () => {
  const [selectedJob, setSelectedJob] = useState(jobOptions[0].value);
  return (
    <div style={{ padding: 24 }}>
      <SectionBlock>
        <SectionTitle>この候補者の進捗状況</SectionTitle>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <ProgressStatusBox>書類選考中</ProgressStatusBox>
          <div style={{ width: 18 }} />
          <div style={{ width: 662 }}>
            <SelectInput
              options={jobOptions}
              value={selectedJob}
              onChange={setSelectedJob}
              style={{
                width: '100%',
                height: 38,
                background: '#fff',
                color: '#323232',
                borderRadius: 8,
                borderColor: '#999999',
                fontWeight: 'bold',
                fontSize: 14,
                lineHeight: '160%',
                letterSpacing: '0.1em',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
              placeholder='求人名を選択'
            />
          </div>
        </div>
      </SectionBlock>
    </div>
  );
};

export default CandidateDetailTabProgress;
