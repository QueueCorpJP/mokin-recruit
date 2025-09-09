import React from 'react';

export interface SectionTextProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const SectionText: React.FC<SectionTextProps> = ({ children, style }) => (
  <div
    style={{
      fontSize: 16,
      fontWeight: 500,
      lineHeight: '200%',
      ...style,
    }}
  >
    {children}
  </div>
);

export default SectionText;
