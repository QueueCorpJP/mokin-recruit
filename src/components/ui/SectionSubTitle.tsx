import React from 'react';

interface SectionSubTitleProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const SectionSubTitle: React.FC<SectionSubTitleProps> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontSize: 16,
      fontWeight: 'bold',
      lineHeight: '200%',
      color: '#999999',
      textAlign: 'right',
      ...style,
    }}
  >
    {children}
  </div>
);

export default SectionSubTitle;
