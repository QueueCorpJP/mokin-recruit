import React from 'react';

interface IndustryTagProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const IndustryTag: React.FC<IndustryTagProps> = ({ children, style }) => (
  <span
    style={{
      fontSize: 16,
      fontWeight: 500,
      color: '#0F9058',
      lineHeight: '200%',
      background: '#D2F1DA',
      padding: '0 16px',
      borderRadius: 8,
      display: 'inline-flex',
      alignItems: 'center',
      ...style,
    }}
  >
    {children}
  </span>
);

export default IndustryTag;
