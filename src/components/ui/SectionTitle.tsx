import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => (
  <div
    style={{
      fontSize: 20,
      fontWeight: 'bold',
      lineHeight: '200%',
      marginBottom: 16,
    }}
  >
    {children}
    <div
      style={{
        borderBottom: '1px solid #DCDCDC',
      }}
    />
  </div>
);

export default SectionTitle;
