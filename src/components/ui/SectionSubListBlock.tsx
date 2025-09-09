import React from 'react';
import SectionSubTitle from './SectionSubTitle';
import SectionListText from './SectionListText';

export interface SectionSubListBlockProps {
  subTitle: React.ReactNode;
  listItems: React.ReactNode[];
  containerStyle?: React.CSSProperties;
  subTitleStyle?: React.CSSProperties;
}

const SectionSubListBlock: React.FC<SectionSubListBlockProps> = ({
  subTitle,
  listItems,
  containerStyle,
  subTitleStyle,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: 440,
      ...containerStyle,
    }}
  >
    <SectionSubTitle style={subTitleStyle}>{subTitle}</SectionSubTitle>
    <div style={{ width: 24 }} />
    <ul style={{ padding: 0, margin: 0 }}>
      {listItems.map((item, idx) => (
        <SectionListText key={idx}>{item}</SectionListText>
      ))}
    </ul>
  </div>
);

export default SectionSubListBlock;
