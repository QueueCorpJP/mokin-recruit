import React from 'react';

// --- やることリストの各アイテムのスタイルを流用 ---
const todoItemStyle: React.CSSProperties = {
  background: '#FFFFFF',
  padding: '16px 24px',
  boxSizing: 'border-box',
  borderRadius: '8px',
  boxShadow: '0 0 20px rgba(0,0,0,0.05)',
};

export interface Job {
  id: string;
  title: string;
  company: string;
  location?: string;
  description?: string;
}

interface JobListCardProps {
  jobs: Job[];
  onClickJob?: (job: Job) => void;
}

export const JobListCard: React.FC<JobListCardProps> = ({
  jobs,
  onClickJob,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {jobs.map(job => (
        <div
          key={job.id}
          style={{
            ...todoItemStyle,
            cursor: onClickJob ? 'pointer' : 'default',
          }}
          onClick={onClickJob ? () => onClickJob(job) : undefined}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'stretch',
              gap: 24,
              width: '100%',
              height: 101,
            }}
          >
            {/* 左カラム: 固定幅・高さ101px・グレー背景・角丸5px */}
            <div
              style={{
                width: 151.5,
                height: 101,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                background: '#E0E0E0',
                borderRadius: 5,
              }}
            >
              {/* 画像は後で追加 */}
            </div>
            {/* 右カラム: 可変幅・高さ101px */}
            <div style={{ flex: 1, height: 101 }}>{/* 中身は今後追加 */}</div>
          </div>
        </div>
      ))}
    </div>
  );
};