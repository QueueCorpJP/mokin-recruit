import React from 'react';
import SectionSubTitle from './SectionSubTitle';
import SectionText from './SectionText';

interface SectionSubTextBlockProps {
  subTitle: React.ReactNode;
  text: React.ReactNode;
  containerStyle?: React.CSSProperties;
  subTitleStyle?: React.CSSProperties;
  textStyle?: React.CSSProperties;
}

const SectionSubTextBlock: React.FC<SectionSubTextBlockProps> = ({
  subTitle,
  text,
  containerStyle,
  subTitleStyle,
  textStyle,
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
      style={{
        width: 140,
        minWidth: 140,
        textAlign: 'right',
        ...subTitleStyle,
      }}
    >
      {subTitle}
    </SectionSubTitle>
    <div style={{ width: 24 }} />
    <SectionText style={textStyle}>{text}</SectionText>
  </div>
);

export default SectionSubTextBlock;
