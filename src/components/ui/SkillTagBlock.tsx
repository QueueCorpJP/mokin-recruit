import React from 'react';
import SectionSubTitle from './SectionSubTitle';

interface SkillTagBlockProps {
  subTitle: React.ReactNode;
  tags: string[];
  containerStyle?: React.CSSProperties;
  subTitleStyle?: React.CSSProperties;
}

const SkillTagBlock: React.FC<SkillTagBlockProps> = ({
  subTitle,
  tags,
  containerStyle,
  subTitleStyle,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: '100%',
      ...containerStyle,
    }}
  >
    <SectionSubTitle
      style={{ width: 69, minWidth: 69, textAlign: 'right', ...subTitleStyle }}
    >
      {subTitle}
    </SectionSubTitle>
    <div style={{ width: 24 }} />
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        maxHeight: 64, // 2行分（32px×2）
        overflow: 'hidden',
        alignItems: 'flex-start',
      }}
    >
      {tags.map((tag, idx) => (
        <span
          key={idx}
          style={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '200%',
            color: '#0F9058',
            background: '#D2F1DA',
            padding: '0 16px',
            borderRadius: 8,
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default SkillTagBlock;
