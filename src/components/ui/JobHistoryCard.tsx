import React from 'react';
import IndustryTag from './IndustryTag';
import SectionText from './SectionText';

interface JobHistoryCardProps {
  children?: React.ReactNode;
}

const JobHistoryCard: React.FC<JobHistoryCardProps> = ({ children }) => (
  <div
    style={{
      width: '100%',
      height: 304,
      background: '#F9F9F9',
      padding: 24,
      boxSizing: 'border-box',
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <span
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: '#0F9058',
          lineHeight: '160%',
        }}
      >
        企業名テキスト
      </span>
      <span
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: '#999999',
          lineHeight: '200%',
        }}
      >
        2020年01月01日～2023年12月31日
      </span>
    </div>
    <div style={{ height: 8 }} />
    <div style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
      {['タグ1', 'タグ2', 'タグ3'].map((tag, idx) => (
        <IndustryTag key={idx}>{tag}</IndustryTag>
      ))}
    </div>
    <div style={{ height: 8 }} />
    <div
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <span
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: '#323232',
          lineHeight: '200%',
        }}
      >
        部署・役職名テキスト
      </span>
      <div
        style={{
          width: 2,
          height: 28,
          background: '#EFEFEF',
          margin: '0 12px',
        }}
      />
      <span
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: '#323232',
          lineHeight: '200%',
        }}
      >
        職種テキスト
      </span>
    </div>
    <div style={{ height: 8 }} />
    <div style={{ width: '100%', height: 1, background: '#EFEFEF' }} />
    <div style={{ height: 8 }} />
    <SectionText>
      当該企業での業務内容が入ります。当該企業での業務内容が入ります。当該企業での業務内容が入ります。当該企業での業務内容が入ります。当該企業での業務内容が入ります。当該企業での業務内容が入ります。
      当該企業での業務内容が入ります。当該企業での業務内容が入ります。当該企業での業務内容が入ります。当該企業での業務内容が入ります。当該企業での業務内容が入ります。当該企業での業務内容が入ります。
    </SectionText>
    {children}
  </div>
);

export default JobHistoryCard;
